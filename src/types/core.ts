/**
 * 核心类型定义
 * 用于图片处理和元数据管理
 */

/**
 * 文件处理状态
 */
export type ProcessingStatus = "queued" | "processing" | "done" | "error";

/**
 * 智能标签类型
 */
export type BadgeType = "warning" | "info" | "safe" | "danger";

/**
 * 智能标签
 */
export interface Badge {
  /** 标签文本 */
  text: string;
  /** 国际化 key，用于在 Result 页面重新本地化 */
  key?: string;
  /** 标签类型，决定颜色 */
  type: BadgeType;
}

/**
 * GPS 坐标（十进制）
 */
export interface GPSLocation {
  /** 纬度 */
  latitude: number;
  /** 经度 */
  longitude: number;
}

/**
 * 相机信息
 */
export interface CameraInfo {
  /** 制造商（如 "Canon", "Nikon"） */
  make?: string;
  /** 型号（如 "EOS R5", "D850"） */
  model?: string;
}

/**
 * 拍摄参数
 */
export interface ShootingParams {
  /** ISO 感光度 */
  iso?: number;
  /** 光圈值（如 f/2.8） */
  aperture?: string;
  /** 快门速度（如 "1/125"） */
  shutterSpeed?: string;
  /** 焦距（mm） */
  focalLength?: number;
}

/**
 * 图片元数据
 */
export interface ImageMetadata {
  /** 相机信息 */
  camera?: CameraInfo;
  /** 拍摄日期时间（ISO 8601 格式） */
  dateTime?: string;
  /** GPS 位置信息 */
  gps?: GPSLocation;
  /** 拍摄参数 */
  shooting?: ShootingParams;
  /** 图片宽度（像素） */
  width?: number;
  /** 图片高度（像素） */
  height?: number;
  /** 原始 EXIF 数据（完整对象，用于调试） */
  rawExif?: Record<string, unknown>;
}

/**
 * 处理后的图片对象
 */
export interface ProcessedImage {
  /** 唯一标识符 */
  id: string;
  /** 原始文件对象 */
  originalFile: File;
  /** 原始文件大小（字节） */
  originalSize: number;
  /** 处理后的文件对象（Blob） */
  processedBlob?: Blob;
  /** 处理后的文件大小（字节） */
  processedSize?: number;
  /** 缩略图 URL（用于预览） */
  thumbnailUrl: string;
  /** 文件名 */
  fileName: string;
  /** 文件类型（MIME） */
  fileType: string;
  /** 处理状态 */
  status: ProcessingStatus;
  /** 元数据信息 */
  meta: ImageMetadata;
  /** 智能标签列表 */
  badges: Badge[];
  /** 错误信息（如果处理失败） */
  error?: string;
  /** 处理开始时间戳 */
  createdAt: number;
  /** 处理完成时间戳 */
  completedAt?: number;
}

/**
 * 批量处理结果
 */
export interface BatchProcessResult {
  /** 处理成功的图片列表 */
  success: ProcessedImage[];
  /** 处理失败的图片列表 */
  failed: ProcessedImage[];
  /** 总数量 */
  total: number;
  /** 成功数量 */
  successCount: number;
  /** 失败数量 */
  failedCount: number;
  /** 总处理时间（毫秒） */
  processingTime: number;
}

/**
 * 处理进度信息
 */
export interface ProcessingProgress {
  /** 当前处理的图片索引（从 0 开始） */
  currentIndex: number;
  /** 总数量 */
  total: number;
  /** 当前处理的文件名 */
  currentFileName?: string;
  /** 进度百分比（0-100） */
  percentage: number;
}

