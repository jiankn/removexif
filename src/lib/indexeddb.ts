/**
 * IndexedDB 工具类
 * 用于存储和检索处理后的图片数据，支持页面刷新后恢复
 */

const DB_NAME = "removexif";
const DB_VERSION = 1;
const STORE_NAME = "processedImages";

import type { ProcessingStatus } from "@/types/core";

interface ProcessedImageData {
  id: string;
  originalSize: number;
  processedSize?: number;
  thumbnailUrl: string;
  fileName: string;
  fileType: string;
  status: ProcessingStatus;
  meta: any;
  badges: any[];
  error?: string;
  createdAt: number;
  completedAt?: number;
  processedBlob: Blob; // 图片数据
}

/**
 * 打开数据库
 */
function openDB(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, DB_VERSION);

    request.onerror = () => {
      reject(new Error("Failed to open IndexedDB"));
    };

    request.onsuccess = () => {
      resolve(request.result);
    };

    request.onupgradeneeded = (event) => {
      const db = (event.target as IDBOpenDBRequest).result;
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        // 创建对象存储，使用 id 作为主键
        db.createObjectStore(STORE_NAME, { keyPath: "id" });
      }
    };
  });
}

/**
 * 保存处理后的图片数据到 IndexedDB
 */
export async function saveProcessedImages(
  images: ProcessedImageData[]
): Promise<void> {
  try {
    const db = await openDB();
    const transaction = db.transaction([STORE_NAME], "readwrite");
    const store = transaction.objectStore(STORE_NAME);

    // 清除旧数据
    await new Promise<void>((resolve, reject) => {
      const clearRequest = store.clear();
      clearRequest.onsuccess = () => resolve();
      clearRequest.onerror = () => reject(clearRequest.error);
    });

    // 保存新数据
    const savePromises = images.map((image) => {
      return new Promise<void>((resolve, reject) => {
        const request = store.put(image);
        request.onsuccess = () => resolve();
        request.onerror = () => reject(request.error);
      });
    });

    await Promise.all(savePromises);
    // 等待事务完成
    await new Promise<void>((resolve) => {
      transaction.oncomplete = () => {
        db.close();
        resolve();
      };
      transaction.onerror = () => {
        db.close();
        throw transaction.error;
      };
    });
  } catch (error) {
    console.error("Failed to save images to IndexedDB:", error);
    throw error;
  }
}

/**
 * 从 IndexedDB 恢复处理后的图片数据
 */
export async function loadProcessedImages(): Promise<
  ProcessedImageData[] | null
> {
  try {
    const db = await openDB();
    const transaction = db.transaction([STORE_NAME], "readonly");
    const store = transaction.objectStore(STORE_NAME);

    return new Promise((resolve, reject) => {
      const request = store.getAll();
      request.onsuccess = () => {
        const images = request.result;
        db.close();
        resolve(images.length > 0 ? images : null);
      };
      request.onerror = () => {
        db.close();
        reject(request.error);
      };
    });
  } catch (error) {
    console.error("Failed to load images from IndexedDB:", error);
    return null;
  }
}

/**
 * 清除 IndexedDB 中的所有图片数据
 */
export async function clearProcessedImages(): Promise<void> {
  try {
    const db = await openDB();
    const transaction = db.transaction([STORE_NAME], "readwrite");
    const store = transaction.objectStore(STORE_NAME);

    return new Promise((resolve, reject) => {
      const request = store.clear();
      request.onsuccess = () => {
        db.close();
        resolve();
      };
      request.onerror = () => {
        db.close();
        reject(request.error);
      };
    });
  } catch (error) {
    console.error("Failed to clear images from IndexedDB:", error);
    throw error;
  }
}

/**
 * 检查 IndexedDB 是否可用
 */
export function isIndexedDBAvailable(): boolean {
  return typeof indexedDB !== "undefined";
}

