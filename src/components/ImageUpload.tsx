"use client";

import {
  useCallback,
  useState,
  useEffect,
  useRef,
  type ReactNode,
} from "react";
import { useDropzone } from "react-dropzone";
import { useTranslations, useLocale } from "next-intl";
import { Upload, Image as ImageIcon, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { getStats, formatFileSize, formatNumber } from "@/lib/stats";
import { type Locale } from "@/i18n";

const MIN_UPLOAD_DURATION = 3000;

interface ImageUploadProps {
  onFilesSelected: (files: File[]) => void;
  maxFiles?: number;
  maxSize?: number; // in bytes
}

export default function ImageUpload({
  onFilesSelected,
  maxFiles = 50,
  maxSize = 50 * 1024 * 1024, // 50MB default
}: ImageUploadProps) {
  const t = useTranslations("Home");
  const locale = useLocale() as Locale;
  const [dragActive, setDragActive] = useState(false);
  const [dragRejected, setDragRejected] = useState(false);
  const [stats, setStats] = useState({ totalImages: 0, totalSizeBytes: 0 });
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploadPhase, setUploadPhase] = useState<"virtual" | "actual" | null>(
    null
  );
  const [uploadError, setUploadError] = useState<string | null>(null);

  const animationRef = useRef<number | null>(null);
  const isMountedRef = useRef(true);
  const virtualProgressRef = useRef(0);
  const realProgressRef = useRef(0);
  const realStartedRef = useRef(false);
  const realCompleteRef = useRef(false);

  // 加载统计数据
  useEffect(() => {
    const loadStats = () => {
      const currentStats = getStats();
      setStats(currentStats);
    };
    
    loadStats();
    
    // 监听统计数据更新事件
    window.addEventListener("statsUpdated", loadStats);
    
    return () => {
      window.removeEventListener("statsUpdated", loadStats);
    };
  }, []);

  useEffect(() => {
    isMountedRef.current = true;
    return () => {
      isMountedRef.current = false;
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, []);

  const cleanupAnimation = () => {
    if (animationRef.current) {
      cancelAnimationFrame(animationRef.current);
      animationRef.current = null;
    }
  };

  const updateProgressDisplay = useCallback(() => {
    setUploadProgress((prev) => {
      const virtual = virtualProgressRef.current;
      const real = realProgressRef.current;

      if (!realStartedRef.current) {
        const cappedVirtual = Math.min(virtual, 0.08);
        return prev > cappedVirtual * 100 ? prev : cappedVirtual * 100;
      }

      const nextValue = Math.min(virtual, real) * 100;
      return nextValue < prev ? prev : nextValue;
    });
  }, []);

  const runVirtualTimer = useCallback(async () => {
    virtualProgressRef.current = 0;

    await new Promise<void>((resolve) => {
      const start = performance.now();

      const tick = () => {
        const elapsed = performance.now() - start;
        virtualProgressRef.current = Math.min(
          elapsed / MIN_UPLOAD_DURATION,
          1
        );
        updateProgressDisplay();

        if (virtualProgressRef.current >= 1) {
          cleanupAnimation();
          resolve();
          return;
        }

        animationRef.current = requestAnimationFrame(tick);
      };

      animationRef.current = requestAnimationFrame(tick);
    });
  }, [updateProgressDisplay]);

  const readFileWithProgress = useCallback(
    async (file: File, onChunk: (bytes: number) => void) => {
      if (file.stream) {
        const reader = file.stream().getReader();
        try {
          for (;;) {
            const { done, value } = await reader.read();
            if (done) break;
            onChunk(value?.byteLength || 0);
            if (!isMountedRef.current) {
              await reader.cancel();
              throw new Error("upload_cancelled");
            }
          }
        } finally {
          reader.releaseLock();
        }
      } else {
        const buffer = await file.arrayBuffer();
        onChunk(buffer.byteLength);
      }
    },
    []
  );

  const trackRealUpload = useCallback(
    async (files: File[]) => {
      realProgressRef.current = 0;
      realStartedRef.current = false;
      realCompleteRef.current = false;

      const totalBytes = Math.max(
        files.reduce((sum, file) => sum + file.size, 0),
        1
      );
      let uploadedBytes = 0;

      const pushProgress = () => {
        const ratio = uploadedBytes / totalBytes;
        realProgressRef.current = ratio;
        if (!realStartedRef.current && ratio > 0) {
          realStartedRef.current = true;
        }
        updateProgressDisplay();
      };

      for (const file of files) {
        await readFileWithProgress(file, (chunkBytes) => {
          uploadedBytes += chunkBytes;
          pushProgress();
        });
      }

      realCompleteRef.current = true;
      pushProgress();
    },
    [readFileWithProgress, updateProgressDisplay]
  );

  const startUploadFlow = useCallback(
    async (files: File[]) => {
      if (!files.length) return;

      setUploadError(null);
      setIsUploading(true);
      setUploadPhase("virtual");
      setUploadProgress(0);

      try {
        const realPromise = trackRealUpload(files);
        await runVirtualTimer();

        if (!realCompleteRef.current) {
          setUploadPhase("actual");
        }

        await realPromise;
        virtualProgressRef.current = 1;
        realProgressRef.current = 1;
        realStartedRef.current = true;
        updateProgressDisplay();

        await new Promise((resolve) => setTimeout(resolve, 200));

        if (isMountedRef.current) {
          setIsUploading(false);
          setUploadPhase(null);
          setUploadProgress(100);
          onFilesSelected(files);
        }
      } catch (error) {
        if (!isMountedRef.current) return;
        console.error("Upload preparation failed:", error);
        cleanupAnimation();
        setIsUploading(false);
        setUploadPhase(null);
        setUploadProgress(0);
        setUploadError(t("upload_progress_error"));
      } finally {
        cleanupAnimation();
      }
    },
    [onFilesSelected, runVirtualTimer, trackRealUpload, t, updateProgressDisplay]
  );

  const onDrop = useCallback(
    (acceptedFiles: File[]) => {
      setDragActive(false);
      setDragRejected(false);
      if (acceptedFiles.length > 0 && !isUploading) {
        void startUploadFlow(acceptedFiles);
      }
    },
    [isUploading, startUploadFlow]
  );

  const onDropRejected = useCallback(() => {
    setDragActive(false);
    setDragRejected(true);
    setTimeout(() => setDragRejected(false), 1000);
  }, []);

  const { getRootProps, getInputProps, isDragActive, isDragReject } =
    useDropzone({
      onDrop,
      onDropRejected,
      accept: {
        "image/jpeg": [".jpg", ".jpeg"],
        "image/png": [".png"],
        "image/webp": [".webp"],
        "image/gif": [".gif"],
        "image/bmp": [".bmp"],
        "image/tiff": [".tiff", ".tif"],
        "image/avif": [".avif"],
        "image/heic": [".heic", ".heif"],
      },
      maxFiles,
      maxSize,
      multiple: true,
      disabled: isUploading,
    });

  return (
    <>
      {/* Full-screen overlay when dragging */}
      {isDragActive && (
        <div className="fixed inset-0 bg-[#A3E635]/20 z-40 pointer-events-none border-4 border-black" />
      )}

      <div
        {...getRootProps()}
        className={cn(
          "relative border-4 border-black p-12 text-center cursor-pointer transition-all duration-200",
          "shadow-brutal-lg hover-brutal touch-feedback overflow-hidden",
          isDragActive && !isDragReject
            ? "bg-[#A3E635] scale-[1.02]"
            : dragRejected || isDragReject
              ? "bg-[#FF6B9D] animate-shake"
              : "bg-white",
          isUploading && "pointer-events-none opacity-95"
        )}
        style={
          !isDragActive && !dragRejected && !isDragReject
            ? {
                backgroundImage: "url('/upload-bg.webp')",
                backgroundSize: "cover",
                backgroundPosition: "center",
                backgroundRepeat: "no-repeat",
              }
            : undefined
        }
      >
        {/* 背景遮罩层，确保文字可读性 */}
        {!isDragActive && !dragRejected && !isDragReject && (
          <div className="absolute inset-0 bg-white/70 z-0" />
        )}
        <input {...getInputProps()} />
        <div className="flex flex-col items-center gap-4 relative z-10">
          <div
            className={cn(
              "transition-all duration-300",
              isDragActive && !isDragReject && "animate-bounce"
            )}
          >
            {isDragActive && !isDragReject ? (
              <Upload className="w-16 h-16 text-black" />
            ) : dragRejected || isDragReject ? (
              <X className="w-16 h-16 text-black" />
            ) : (
              <ImageIcon className="w-16 h-16 text-black" />
            )}
          </div>
          <div>
            <p className="text-2xl font-black text-black mb-2 uppercase">
              {t("dropzone_main")}
            </p>
            <p className="text-lg text-black mb-4 font-bold">{t("dropzone_sub")}</p>
            <p className="text-sm text-black mb-2 font-bold border-2 border-black inline-block px-4 py-2 bg-white">{t("dropzone_supported")}</p>
            <p className="text-xs text-black font-bold">{t("dropzone_max_size", { maxSize: Math.round(maxSize / 1024 / 1024) })}</p>
          </div>
        </div>
        
        {/* 统计数字 - 一行文字式 */}
        {stats.totalImages > 0 && (() => {
          const formattedCount = formatNumber(stats.totalImages, locale);
          const formattedSize = formatFileSize(stats.totalSizeBytes);
          
          // 获取翻译模板（包含 {count} 和 {size} 占位符）
          // 注意：这里我们需要手动构建，因为 next-intl 的插值会直接替换
          // 我们使用正则表达式来解析模板并替换占位符
          const template = t("stats_summary", { count: "{count}", size: "{size}" });
          
          // 使用正则表达式分割字符串，保留占位符位置
          const parts: (string | ReactNode)[] = [];
          const regex = /\{count\}|\{size\}/g;
          let lastIndex = 0;
          let match;
          let key = 0;
          
          while ((match = regex.exec(template)) !== null) {
            // 添加占位符之前的文本
            if (match.index > lastIndex) {
              parts.push(
                <span key={key++} className="text-black">
                  {template.substring(lastIndex, match.index)}
                </span>
              );
            }
            
            // 根据占位符类型添加加粗的数字
            if (match[0] === "{count}") {
              parts.push(
                <span key={key++} className="font-bold text-base" style={{ color: '#1e5e1e' }}>
                  {formattedCount}
                </span>
              );
            } else if (match[0] === "{size}") {
              parts.push(
                <span key={key++} className="font-bold text-base" style={{ color: '#1e5e1e' }}>
                  {formattedSize}
                </span>
              );
            }
            
            lastIndex = match.index + match[0].length;
          }
          
          // 添加剩余文本
          if (lastIndex < template.length) {
            parts.push(
              <span key={key++} className="text-black">
                {template.substring(lastIndex)}
              </span>
            );
          }
          
          return (
            <div className="mt-6 pt-6 border-t-4 border-black relative z-10">
              <p className="text-sm text-black text-center font-bold uppercase">
                {parts}
              </p>
            </div>
          );
        })()}

        {isUploading && (
          <div className="absolute inset-0 bg-white/95 z-20 border-4 border-black flex flex-col items-center justify-center gap-4 px-6 text-black text-center">
            <p className="text-2xl font-black uppercase">
              {t("upload_progress_title")}
            </p>
            <p className="text-sm font-bold">
              {uploadPhase === "actual"
                ? t("upload_progress_subtitle_slow")
                : t("upload_progress_subtitle", { seconds: 3 })}
            </p>
            <div className="w-full max-w-md">
              <div
                role="progressbar"
                aria-label={t("upload_progress_aria_label")}
                aria-valuemin={0}
                aria-valuemax={100}
                aria-valuenow={Math.round(uploadProgress)}
                className="w-full h-5 border-4 border-black bg-white shadow-brutal-lg"
              >
                <div
                  className="h-full bg-[#A3E635]"
                  style={{
                    width: `${Math.min(uploadProgress, 100)}%`,
                    transition: "width 200ms linear",
                  }}
                />
              </div>
            </div>
            <p className="text-lg font-black border-2 border-black px-4 py-1 bg-white inline-block">
              {Math.round(uploadProgress)}%
            </p>
            {uploadError && (
              <p className="text-sm font-bold text-red-600 max-w-md">
                {uploadError}
              </p>
            )}
          </div>
        )}
      </div>
    </>
  );
}

