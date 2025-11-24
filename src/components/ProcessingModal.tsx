"use client";

import { useEffect, useState, useMemo } from "react";
import { useTranslations } from "next-intl";
import { Loader2 } from "lucide-react";
import { batchProcessImages } from "@/lib/batch-processor";
import { updateStats } from "@/lib/stats";
import {
  saveProcessedImages,
  isIndexedDBAvailable,
} from "@/lib/indexeddb";
import type { ProcessedImage, ProcessingProgress } from "@/types/core";

interface ProcessingModalProps {
  files: File[];
  onComplete: (images: ProcessedImage[]) => void;
  onError?: (error: Error) => void;
}

export default function ProcessingModal({
  files,
  onComplete,
  onError,
}: ProcessingModalProps) {
  const t = useTranslations("Dashboard");
  const [progress, setProgress] = useState<ProcessingProgress>({
    currentIndex: 0,
    total: files.length,
    percentage: 0,
  });
  const [stage, setStage] = useState(0);
  const [isComplete, setIsComplete] = useState(false);

  const stages = useMemo(
    () => [
      { text: t("processing_analyzing"), progress: 30 },
      { text: t("processing_detecting"), progress: 70 },
      { text: t("processing_verifying"), progress: 95 },
      { text: t("processing_done"), progress: 100 },
    ],
    [t]
  );

  useEffect(() => {
    let mounted = true;

    const processFiles = async () => {
      try {
        // 阶段 0: 分析文件结构 (0-500ms)
        setStage(0);
        await new Promise((resolve) => setTimeout(resolve, 500));

        if (!mounted) return;

        // 开始处理
        const result = await batchProcessImages(files, (prog) => {
          if (mounted) {
            setProgress(prog);
            // 根据进度更新阶段
            if (prog.percentage < 30) {
              setStage(0);
            } else if (prog.percentage < 70) {
              setStage(1);
            } else {
              setStage(2);
            }
          }
        }, (key: string) => t(key));

        if (!mounted) return;

        // 阶段 2: 验证隐私标签 (1200-1800ms)
        setStage(2);
        await new Promise((resolve) => setTimeout(resolve, 300));

        if (!mounted) return;

        // 完成
        setStage(3);
        setIsComplete(true);
        await new Promise((resolve) => setTimeout(resolve, 500));

        if (mounted) {
          // 将处理后的图片数据存储到 sessionStorage（不存储 base64 图片数据，避免配额超限）
          // 只存储元数据，不存储实际的图片数据（作为备用方案）
          try {
            const imagesToStore = result.success.map((img) => {
              // 只存储元数据，不存储 base64 图片数据
              return {
                id: img.id,
                originalSize: img.originalSize,
                processedSize: img.processedSize,
                thumbnailUrl: img.thumbnailUrl,
                fileName: img.fileName,
                fileType: img.fileType,
                status: img.status,
                meta: img.meta,
                badges: img.badges,
                error: img.error,
                createdAt: img.createdAt,
                completedAt: img.completedAt,
                // 不存储 processedBlobBase64，避免超出存储配额
                // 不存储 originalFile，因为不能序列化
              };
            });
            
            // 使用 sessionStorage 存储元数据（不存储图片数据，避免配额超限）
            sessionStorage.setItem(
              "processedImages",
              JSON.stringify(imagesToStore)
            );
          } catch (error) {
            // 如果存储失败（配额超限或其他错误），记录错误但不影响用户体验
            console.warn("Failed to store processed images metadata:", error);
            // 继续执行，不影响图片处理完成
          }
          
          // 将图片数据（包含 processedBlob）存储到 IndexedDB，支持页面刷新后恢复
          if (isIndexedDBAvailable()) {
            try {
              const imagesForIndexedDB = result.success
                .filter((img) => img.processedBlob) // 只保存有图片数据的
                .map((img) => ({
                  id: img.id,
                  originalSize: img.originalSize,
                  processedSize: img.processedSize,
                  thumbnailUrl: img.thumbnailUrl,
                  fileName: img.fileName,
                  fileType: img.fileType,
                  status: img.status,
                  meta: img.meta,
                  badges: img.badges,
                  error: img.error,
                  createdAt: img.createdAt,
                  completedAt: img.completedAt,
                  processedBlob: img.processedBlob!, // 保存图片 Blob 数据
                }));
              
              if (imagesForIndexedDB.length > 0) {
                await saveProcessedImages(imagesForIndexedDB);
              }
            } catch (error) {
              // 如果 IndexedDB 存储失败，记录错误但不影响用户体验
              console.warn("Failed to store images to IndexedDB:", error);
              // 继续执行，不影响图片处理完成
            }
          }
          
          // 将图片数据（包含 processedBlob）存储到临时内存中，用于页面跳转后恢复
          // 使用 window 对象作为临时存储，只在当前会话中有效
          (window as any).__processedImagesData = result.success;
          
          // 更新统计数据
          const totalSize = result.success.reduce(
            (sum, img) => sum + (img.originalSize || 0),
            0
          );
          updateStats(result.success.length, totalSize);
          
          // 触发自定义事件，通知其他组件统计数据已更新
          if (typeof window !== "undefined") {
            window.dispatchEvent(new CustomEvent("statsUpdated"));
          }
          
          onComplete(result.success);
        }
      } catch (error) {
        if (mounted && onError) {
          onError(error as Error);
        }
      }
    };

    processFiles();

    return () => {
      mounted = false;
    };
  }, [files, onComplete, onError]);


  const currentStage = stages[stage];
  const displayProgress = isComplete
    ? 100
    : Math.max(
        progress.percentage,
        currentStage?.progress || 0
      );

  return (
    <div className="fixed inset-0 bg-white z-50 flex items-center justify-center border-4 border-black">
      <div className="max-w-md w-full mx-4 text-center bg-white border-4 border-black shadow-brutal-xl p-8">
        {/* 进度环 */}
        <div className="relative w-32 h-32 mx-auto mb-8 border-4 border-black shadow-brutal-lg">
          <svg className="w-32 h-32 transform -rotate-90" viewBox="0 0 120 120">
            <circle
              cx="60"
              cy="60"
              r="54"
              stroke="currentColor"
              strokeWidth="8"
              fill="none"
              className="text-black opacity-20"
            />
            <circle
              cx="60"
              cy="60"
              r="54"
              stroke="currentColor"
              strokeWidth="8"
              fill="none"
              strokeDasharray={`${(displayProgress / 100) * 339.292} 339.292`}
              className="text-[#A3E635] transition-all duration-300"
              strokeLinecap="round"
            />
          </svg>
          <div className="absolute inset-0 flex items-center justify-center">
            {isComplete ? (
              <div className="w-16 h-16 bg-[#A3E635] border-4 border-black shadow-brutal flex items-center justify-center">
                <svg
                  className="w-8 h-8 text-black"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={3}
                    d="M5 13l4 4L19 7"
                  />
                </svg>
              </div>
            ) : (
              <Loader2 className="w-8 h-8 text-[#A3E635] animate-spin" />
            )}
          </div>
        </div>

        {/* 阶段文本 */}
        <h2 className="text-2xl font-black text-black mb-2 uppercase">
          {currentStage?.text || t("processing")}
        </h2>

        {/* 进度文本 */}
        {files.length > 1 && !isComplete && (
          <p className="text-black mb-4 font-bold">
            {t("processing_image", {
              current: progress.currentIndex + 1,
              total: progress.total,
            })}
          </p>
        )}

        {/* 进度百分比 */}
        <p className="text-3xl font-black text-[#A3E635] border-4 border-black bg-white px-6 py-3 inline-block shadow-brutal">
          {Math.round(displayProgress)}%
        </p>
      </div>
    </div>
  );
}

