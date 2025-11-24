/**
 * EXIF 清除功能
 * 用于从图片文件中移除所有元数据
 */

import piexif from "piexifjs";

/**
 * 从 JPEG 文件中移除 EXIF 数据
 * @param file JPEG 文件对象
 * @returns Promise<Blob> 处理后的图片 Blob
 */
export async function removeExifFromJPEG(file: File): Promise<Blob> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.onload = (e) => {
      try {
        const arrayBuffer = e.target?.result as ArrayBuffer;
        if (!arrayBuffer) {
          reject(new Error("Failed to read file"));
          return;
        }

        // 将 ArrayBuffer 转换为二进制字符串
        const binaryString = Array.from(new Uint8Array(arrayBuffer))
          .map((byte) => String.fromCharCode(byte))
          .join("");

        // 使用 piexifjs 移除 EXIF 数据
        // 如果图片没有 EXIF 数据，load 会抛出错误，我们需要捕获它
        let exifData;
        try {
          exifData = piexif.load(binaryString);
        } catch (error) {
          // 如果没有 EXIF 数据，直接返回原文件
          resolve(new Blob([arrayBuffer], { type: "image/jpeg" }));
          return;
        }

        // 创建空的 EXIF 数据（只保留必要的结构）
        const emptyExif = {
          "0th": {},
          Exif: {},
          GPS: {},
          Interop: {},
          "1st": {},
          thumbnail: null,
        };

        // 将空 EXIF 数据插入图片
        const newBinaryString = piexif.insert(
          piexif.dump(emptyExif),
          binaryString
        );

        // 将二进制字符串转换回 ArrayBuffer
        const newArrayBuffer = new ArrayBuffer(newBinaryString.length);
        const view = new Uint8Array(newArrayBuffer);
        for (let i = 0; i < newBinaryString.length; i++) {
          view[i] = newBinaryString.charCodeAt(i);
        }

        resolve(new Blob([newArrayBuffer], { type: "image/jpeg" }));
      } catch (error) {
        console.error("Error removing EXIF from JPEG:", error);
        reject(error);
      }
    };

    reader.onerror = () => {
      reject(new Error("Failed to read file"));
    };

    reader.readAsArrayBuffer(file);
  });
}

/**
 * 从 PNG 文件中移除元数据
 * 注意：PNG 的元数据存储在 tEXt、zTXt、iTXt 等块中
 * 这里使用 Canvas API 重新绘制图片来移除元数据
 * @param file PNG 文件对象
 * @returns Promise<Blob> 处理后的图片 Blob
 */
export async function removeExifFromPNG(file: File): Promise<Blob> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    const url = URL.createObjectURL(file);

    img.onload = () => {
      try {
        // 创建 Canvas 并绘制图片
        const canvas = document.createElement("canvas");
        canvas.width = img.width;
        canvas.height = img.height;

        const ctx = canvas.getContext("2d");
        if (!ctx) {
          reject(new Error("Failed to get canvas context"));
          return;
        }

        // 绘制图片（这会移除所有元数据）
        ctx.drawImage(img, 0, 0);

        // 将 Canvas 转换为 Blob
        canvas.toBlob(
          (blob) => {
            URL.revokeObjectURL(url);
            if (blob) {
              resolve(blob);
            } else {
              reject(new Error("Failed to convert canvas to blob"));
            }
          },
          "image/png",
          1.0 // 最高质量
        );
      } catch (error) {
        URL.revokeObjectURL(url);
        console.error("Error removing metadata from PNG:", error);
        reject(error);
      }
    };

    img.onerror = () => {
      URL.revokeObjectURL(url);
      reject(new Error("Failed to load image"));
    };

    img.src = url;
  });
}

/**
 * 从 WebP 文件中移除元数据
 * 使用 Canvas API 重新绘制图片来移除元数据
 * @param file WebP 文件对象
 * @returns Promise<Blob> 处理后的图片 Blob
 */
export async function removeExifFromWebP(file: File): Promise<Blob> {
  return removeMetadataViaCanvas(file, "image/webp");
}

/**
 * 从 GIF 文件中移除元数据
 * 使用 Canvas API 重新绘制图片来移除元数据
 * @param file GIF 文件对象
 * @returns Promise<Blob> 处理后的图片 Blob
 */
export async function removeExifFromGIF(file: File): Promise<Blob> {
  return removeMetadataViaCanvas(file, "image/gif");
}

/**
 * 从 BMP 文件中移除元数据
 * 使用 Canvas API 重新绘制图片来移除元数据
 * @param file BMP 文件对象
 * @returns Promise<Blob> 处理后的图片 Blob
 */
export async function removeExifFromBMP(file: File): Promise<Blob> {
  return removeMetadataViaCanvas(file, "image/bmp");
}

/**
 * 从 TIFF 文件中移除元数据
 * 使用 Canvas API 重新绘制图片来移除元数据
 * 注意：浏览器对TIFF支持有限，可能无法处理
 * @param file TIFF 文件对象
 * @returns Promise<Blob> 处理后的图片 Blob
 */
export async function removeExifFromTIFF(file: File): Promise<Blob> {
  // TIFF在浏览器中支持有限，尝试转换为PNG
  return removeMetadataViaCanvas(file, "image/png");
}

/**
 * 从 AVIF 文件中移除元数据
 * 使用 Canvas API 重新绘制图片来移除元数据
 * @param file AVIF 文件对象
 * @returns Promise<Blob> 处理后的图片 Blob
 */
export async function removeExifFromAVIF(file: File): Promise<Blob> {
  return removeMetadataViaCanvas(file, "image/avif");
}

/**
 * 从 HEIC/HEIF 文件中移除元数据
 * 使用 Canvas API 重新绘制图片来移除元数据
 * 注意：浏览器对HEIC支持有限，可能无法处理
 * @param file HEIC 文件对象
 * @returns Promise<Blob> 处理后的图片 Blob
 */
export async function removeExifFromHEIC(file: File): Promise<Blob> {
  // HEIC在浏览器中支持有限，尝试转换为JPEG
  return removeMetadataViaCanvas(file, "image/jpeg", 0.95);
}

/**
 * 通用方法：使用 Canvas API 移除元数据
 * @param file 图片文件对象
 * @param outputType 输出MIME类型
 * @param quality 输出质量（0-1，仅对JPEG/WebP有效）
 * @returns Promise<Blob> 处理后的图片 Blob
 */
function removeMetadataViaCanvas(
  file: File,
  outputType: string,
  quality: number = 1.0
): Promise<Blob> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    const url = URL.createObjectURL(file);

    img.onload = () => {
      try {
        // 创建 Canvas 并绘制图片
        const canvas = document.createElement("canvas");
        canvas.width = img.width;
        canvas.height = img.height;

        const ctx = canvas.getContext("2d");
        if (!ctx) {
          URL.revokeObjectURL(url);
          reject(new Error("Failed to get canvas context"));
          return;
        }

        // 绘制图片（这会移除所有元数据）
        ctx.drawImage(img, 0, 0);

        // 将 Canvas 转换为 Blob
        canvas.toBlob(
          (blob) => {
            URL.revokeObjectURL(url);
            if (blob) {
              resolve(blob);
            } else {
              reject(new Error("Failed to convert canvas to blob"));
            }
          },
          outputType,
          quality
        );
      } catch (error) {
        URL.revokeObjectURL(url);
        console.error(`Error removing metadata from ${outputType}:`, error);
        reject(error);
      }
    };

    img.onerror = () => {
      URL.revokeObjectURL(url);
      reject(new Error("Failed to load image"));
    };

    img.src = url;
  });
}

/**
 * 根据文件类型移除 EXIF 数据
 * @param file 图片文件对象
 * @returns Promise<Blob> 处理后的图片 Blob
 */
export async function removeExifData(file: File): Promise<Blob> {
  const fileType = file.type.toLowerCase();
  const fileName = file.name.toLowerCase();

  if (fileType === "image/jpeg" || fileType === "image/jpg") {
    return removeExifFromJPEG(file);
  } else if (fileType === "image/png") {
    return removeExifFromPNG(file);
  } else if (fileType === "image/webp") {
    return removeExifFromWebP(file);
  } else if (fileType === "image/gif") {
    return removeExifFromGIF(file);
  } else if (fileType === "image/bmp" || fileType === "image/x-ms-bmp") {
    return removeExifFromBMP(file);
  } else if (fileType === "image/tiff" || fileType === "image/tif" || fileName.endsWith(".tiff") || fileName.endsWith(".tif")) {
    return removeExifFromTIFF(file);
  } else if (fileType === "image/avif" || fileName.endsWith(".avif")) {
    return removeExifFromAVIF(file);
  } else if (fileType === "image/heic" || fileType === "image/heif" || fileName.endsWith(".heic") || fileName.endsWith(".heif")) {
    return removeExifFromHEIC(file);
  } else {
    throw new Error(`Unsupported file type: ${fileType}`);
  }
}

