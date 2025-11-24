/**
 * EXIF 读取功能
 * 用于从图片文件中提取元数据信息
 */

// @ts-ignore - exif-js doesn't have proper ES module support
import * as EXIF from "exif-js";
import type {
  ImageMetadata,
  CameraInfo,
  GPSLocation,
  ShootingParams,
} from "@/types/core";

/**
 * 将 GPS 坐标从度分秒格式转换为十进制
 */
function convertDMSToDD(
  degrees: number,
  minutes: number,
  seconds: number,
  direction: string
): number {
  let dd = degrees + minutes / 60 + seconds / 3600;
  if (direction === "S" || direction === "W") {
    dd = dd * -1;
  }
  return dd;
}

/**
 * 解析 GPS 坐标
 */
function parseGPS(exifData: any): GPSLocation | undefined {
  if (!exifData.GPSLatitude || !exifData.GPSLongitude) {
    return undefined;
  }

  try {
    const lat = convertDMSToDD(
      exifData.GPSLatitude[0],
      exifData.GPSLatitude[1],
      exifData.GPSLatitude[2],
      exifData.GPSLatitudeRef || "N"
    );

    const lon = convertDMSToDD(
      exifData.GPSLongitude[0],
      exifData.GPSLongitude[1],
      exifData.GPSLongitude[2],
      exifData.GPSLongitudeRef || "E"
    );

    return { latitude: lat, longitude: lon };
  } catch (error) {
    console.error("Error parsing GPS data:", error);
    return undefined;
  }
}

/**
 * 解析光圈值
 */
function parseAperture(exifData: any): string | undefined {
  if (exifData.FNumber) {
    return `f/${exifData.FNumber}`;
  }
  if (exifData.ApertureValue) {
    const fNumber = Math.pow(2, exifData.ApertureValue / 2);
    return `f/${fNumber.toFixed(1)}`;
  }
  return undefined;
}

/**
 * 解析快门速度
 */
function parseShutterSpeed(exifData: any): string | undefined {
  if (exifData.ExposureTime) {
    if (exifData.ExposureTime < 1) {
      return `1/${Math.round(1 / exifData.ExposureTime)}`;
    }
    return `${exifData.ExposureTime.toFixed(1)}s`;
  }
  if (exifData.ShutterSpeedValue) {
    const exposureTime = Math.pow(2, -exifData.ShutterSpeedValue);
    if (exposureTime < 1) {
      return `1/${Math.round(1 / exposureTime)}`;
    }
    return `${exposureTime.toFixed(1)}s`;
  }
  return undefined;
}

/**
 * 解析日期时间
 */
function parseDateTime(exifData: any): string | undefined {
  if (exifData.DateTimeOriginal) {
    return exifData.DateTimeOriginal;
  }
  if (exifData.DateTime) {
    return exifData.DateTime;
  }
  if (exifData.DateTimeDigitized) {
    return exifData.DateTimeDigitized;
  }
  return undefined;
}

/**
 * 从图片文件中读取 EXIF 元数据
 * @param file 图片文件对象
 * @returns Promise<ImageMetadata> 元数据对象
 */
export function readExifData(file: File): Promise<ImageMetadata> {
  return new Promise((resolve, reject) => {
    // 检查文件类型 - 扩展支持的格式
    const fileName = file.name.toLowerCase();
    const supportedTypes = /^image\/(jpeg|jpg|png|webp|gif|bmp|x-ms-bmp|tiff|tif|avif|heic|heif)$/i;
    const supportedExtensions = [
      ".jpg",
      ".jpeg",
      ".png",
      ".webp",
      ".gif",
      ".bmp",
      ".tiff",
      ".tif",
      ".avif",
      ".heic",
      ".heif",
    ];
    const hasSupportedExtension = supportedExtensions.some((ext) =>
      fileName.endsWith(ext)
    );
    
    if (!supportedTypes.test(file.type) && !hasSupportedExtension) {
      // 对于不支持EXIF读取的格式（如GIF、BMP等），返回空元数据
      // 这些格式仍然可以通过Canvas处理来移除元数据
      if (file.type.match(/^image\/(gif|bmp|x-ms-bmp)$/i) || fileName.endsWith(".gif") || fileName.endsWith(".bmp")) {
        resolve({
          rawExif: {},
        });
        return;
      }
      reject(new Error("Unsupported file type"));
      return;
    }

    // EXIF.js 只支持 JPEG/TIFF，如果是其他格式就直接返回空结果，避免 DataView 越界
    const isExifSupportedFormat =
      /^image\/(jpeg|jpg|tiff|tif)$/i.test(file.type) ||
      fileName.endsWith(".jpg") ||
      fileName.endsWith(".jpeg") ||
      fileName.endsWith(".tiff") ||
      fileName.endsWith(".tif");

    if (!isExifSupportedFormat) {
      resolve({
        rawExif: {},
      });
      return;
    }

    const reader = new FileReader();

    reader.onload = (e) => {
      const arrayBuffer = e.target?.result as ArrayBuffer;
      if (!arrayBuffer) {
        reject(new Error("Failed to read file"));
        return;
      }

      try {
        // 使用 EXIF.js 解析
        EXIF.getData(
          new Blob([arrayBuffer], { type: file.type }) as any,
          function (this: any) {
            try {
              const exifData = EXIF.getAllTags(this);

              // 如果没有 EXIF 数据，返回空元数据
              if (!exifData || Object.keys(exifData).length === 0) {
                resolve({
                  rawExif: {},
                });
                return;
              }

              // 提取相机信息
              const camera: CameraInfo | undefined =
                exifData.Make || exifData.Model
                  ? {
                      make: exifData.Make,
                      model: exifData.Model,
                    }
                  : undefined;

              // 提取 GPS 信息
              const gps = parseGPS(exifData);

              // 提取拍摄参数
              const shooting: ShootingParams | undefined =
                exifData.ISO ||
                exifData.FNumber ||
                exifData.ApertureValue ||
                exifData.ExposureTime ||
                exifData.ShutterSpeedValue ||
                exifData.FocalLength
                  ? {
                      iso: exifData.ISO,
                      aperture: parseAperture(exifData),
                      shutterSpeed: parseShutterSpeed(exifData),
                      focalLength: exifData.FocalLength,
                    }
                  : undefined;

              // 提取日期时间
              const dateTime = parseDateTime(exifData);

              // 获取图片尺寸
              let width: number | undefined;
              let height: number | undefined;

              if (exifData.PixelXDimension) {
                width = exifData.PixelXDimension;
              }
              if (exifData.PixelYDimension) {
                height = exifData.PixelYDimension;
              }

              // 如果 EXIF 中没有尺寸信息，尝试从图片本身获取
              if (!width || !height) {
                const img = new Image();
                img.onload = () => {
                  const metadata: ImageMetadata = {
                    camera,
                    dateTime,
                    gps,
                    shooting,
                    width: width || img.width,
                    height: height || img.height,
                    rawExif: exifData,
                  };
                  resolve(metadata);
                };
                img.onerror = () => {
                  const metadata: ImageMetadata = {
                    camera,
                    dateTime,
                    gps,
                    shooting,
                    width,
                    height,
                    rawExif: exifData,
                  };
                  resolve(metadata);
                };
                img.src = URL.createObjectURL(
                  new Blob([arrayBuffer], { type: file.type })
                );
                return;
              }

              const metadata: ImageMetadata = {
                camera,
                dateTime,
                gps,
                shooting,
                width,
                height,
                rawExif: exifData,
              };

              resolve(metadata);
            } catch (error) {
              console.error("Error parsing EXIF data:", error);
              reject(error);
            }
          }
        );
      } catch (error) {
        console.error("Error reading EXIF:", error);
        reject(error);
      }
    };

    reader.onerror = () => {
      reject(new Error("Failed to read file"));
    };

    reader.readAsArrayBuffer(file);
  });
}

