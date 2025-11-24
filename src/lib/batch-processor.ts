/**
 * 批量处理逻辑
 * 用于处理多张图片的 EXIF 清除和元数据提取
 */

import { readExifData } from "./exif-reader";
import { removeExifData } from "./exif-remover";
import { generateBadges } from "./badge-generator";
import type {
  ProcessedImage,
  ProcessingStatus,
  ProcessingProgress,
  BatchProcessResult,
} from "@/types/core";

type TranslationFunction = (key: string) => string;

/**
 * 创建缩略图 URL
 */
function createThumbnailUrl(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const url = e.target?.result as string;
      resolve(url);
    };
    reader.onerror = () => {
      reject(new Error("Failed to create thumbnail"));
    };
    reader.readAsDataURL(file);
  });
}

/**
 * 处理单张图片
 * @param file 图片文件
 * @param id 唯一标识符
 * @param t 翻译函数（可选）
 * @returns Promise<ProcessedImage>
 */
async function processSingleImage(
  file: File,
  id: string,
  t?: TranslationFunction
): Promise<ProcessedImage> {
  const createdAt = Date.now();
  const thumbnailUrl = await createThumbnailUrl(file);

  // 创建初始对象
  const processedImage: ProcessedImage = {
    id,
    originalFile: file,
    originalSize: file.size,
    thumbnailUrl,
    fileName: file.name,
    fileType: file.type,
    status: "processing" as ProcessingStatus,
    meta: {},
    badges: [],
    createdAt,
  };

  try {
    // 1. 读取 EXIF 数据
    const metadata = await readExifData(file);
    processedImage.meta = metadata;

    // 2. 生成智能标签
    processedImage.badges = generateBadges(metadata, t);

    // 3. 移除 EXIF 数据
    const processedBlob = await removeExifData(file);
    processedImage.processedBlob = processedBlob;
    processedImage.processedSize = processedBlob.size;
    processedImage.status = "done";
    processedImage.completedAt = Date.now();
  } catch (error) {
    processedImage.status = "error";
    processedImage.error =
      error instanceof Error ? error.message : "Unknown error";
    processedImage.completedAt = Date.now();
  }

  return processedImage;
}

/**
 * 让出主线程
 */
function yieldToMain(): Promise<void> {
  return new Promise((resolve) => {
    setTimeout(resolve, 0);
  });
}

/**
 * 批量处理图片
 * @param files 图片文件数组
 * @param onProgress 进度回调函数
 * @param t 翻译函数（可选）
 * @returns Promise<BatchProcessResult>
 */
export async function batchProcessImages(
  files: File[],
  onProgress?: (progress: ProcessingProgress) => void,
  t?: TranslationFunction
): Promise<BatchProcessResult> {
  const startTime = Date.now();
  const total = files.length;
  const processedImages: ProcessedImage[] = [];
  const failedImages: ProcessedImage[] = [];

  // 每次处理 5 张图片
  const batchSize = 5;

  for (let i = 0; i < files.length; i += batchSize) {
    const batch = files.slice(i, i + batchSize);

    // 处理当前批次
    const batchPromises = batch.map((file, batchIndex) => {
      const globalIndex = i + batchIndex;
      const id = `${Date.now()}-${globalIndex}-${file.name}`;

      // 更新进度
      if (onProgress) {
        onProgress({
          currentIndex: globalIndex,
          total,
          currentFileName: file.name,
          percentage: Math.round((globalIndex / total) * 100),
        });
      }

      return processSingleImage(file, id, t);
    });

    // 等待当前批次完成
    const batchResults = await Promise.all(batchPromises);

    // 分类成功和失败的结果
    for (const result of batchResults) {
      if (result.status === "done") {
        processedImages.push(result);
      } else {
        failedImages.push(result);
      }
    }

    // 让出主线程，避免阻塞 UI
    if (i + batchSize < files.length) {
      await yieldToMain();
    }
  }

  // 最终进度更新
  if (onProgress) {
    onProgress({
      currentIndex: total,
      total,
      percentage: 100,
    });
  }

  const processingTime = Date.now() - startTime;

  return {
    success: processedImages,
    failed: failedImages,
    total,
    successCount: processedImages.length,
    failedCount: failedImages.length,
    processingTime,
  };
}

/**
 * 清理所有图片的缩略图 URL
 * @param images 处理后的图片数组
 */
export function cleanupThumbnails(images: ProcessedImage[]): void {
  for (const image of images) {
    if (image.thumbnailUrl && image.thumbnailUrl.startsWith("blob:")) {
      URL.revokeObjectURL(image.thumbnailUrl);
    }
  }
}

