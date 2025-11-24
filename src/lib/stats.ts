/**
 * 统计工具 - 用于跟踪处理过的图片数量和总大小
 * 使用 localStorage 存储统计数据（客户端本地存储）
 */

interface StatsData {
  totalImages: number;
  totalSizeBytes: number; // 以字节为单位存储
  lastUpdated: number; // 时间戳
}

const STATS_KEY = "removexif_stats";

/**
 * 获取统计数据
 */
export function getStats(): StatsData {
  if (typeof window === "undefined") {
    return { totalImages: 0, totalSizeBytes: 0, lastUpdated: Date.now() };
  }

  try {
    const stored = localStorage.getItem(STATS_KEY);
    if (stored) {
      return JSON.parse(stored);
    }
  } catch (error) {
    console.warn("Failed to read stats from localStorage:", error);
  }

  return { totalImages: 0, totalSizeBytes: 0, lastUpdated: Date.now() };
}

/**
 * 更新统计数据（添加新处理的图片）
 */
export function updateStats(imagesCount: number, totalSizeBytes: number): void {
  if (typeof window === "undefined") return;

  try {
    const current = getStats();
    const updated: StatsData = {
      totalImages: current.totalImages + imagesCount,
      totalSizeBytes: current.totalSizeBytes + totalSizeBytes,
      lastUpdated: Date.now(),
    };
    localStorage.setItem(STATS_KEY, JSON.stringify(updated));
  } catch (error) {
    console.warn("Failed to update stats in localStorage:", error);
    // 如果存储失败（配额超限），尝试清理旧数据
    try {
      localStorage.removeItem(STATS_KEY);
    } catch {
      // 忽略清理错误
    }
  }
}

/**
 * 格式化文件大小
 */
export function formatFileSize(bytes: number): string {
  if (bytes === 0) return "0 B";
  
  const k = 1024;
  const sizes = ["B", "KB", "MB", "GB", "TB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  
  const value = bytes / Math.pow(k, i);
  
  if (i >= 3) {
    // GB 或更大，保留2位小数
    return `${value.toFixed(2)} ${sizes[i]}`;
  } else if (i >= 2) {
    // MB，保留1位小数
    return `${value.toFixed(1)} ${sizes[i]}`;
  } else {
    // KB 或 B，保留整数
    return `${Math.round(value)} ${sizes[i]}`;
  }
}

/**
 * 格式化数字（添加千位分隔符）
 * @param num 要格式化的数字
 * @param locale 语言环境，默认为浏览器语言环境
 */
export function formatNumber(num: number, locale?: string): string {
  return new Intl.NumberFormat(locale).format(num);
}

/**
 * 格式化博客文章日期（默认使用文章自身的日期）
 * @param locale 语言环境
 * @param dateInput 日期字符串或 Date 对象
 * @param options 日期格式化选项
 */
export function formatBlogDate(
  locale: string,
  dateInput?: string | Date,
  options?: {
    year?: "numeric" | "2-digit";
    month?: "numeric" | "2-digit" | "long" | "short" | "narrow";
    day?: "numeric" | "2-digit";
  }
): string {
  const date =
    dateInput instanceof Date
      ? dateInput
      : dateInput
      ? new Date(dateInput)
      : new Date();

  const validDate = Number.isNaN(date.getTime()) ? new Date() : date;

  const defaultOptions: Intl.DateTimeFormatOptions = {
    year: "numeric",
    month: "long",
    day: "numeric",
    ...options,
  };

  return validDate.toLocaleDateString(locale, defaultOptions);
}

