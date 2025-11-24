"use client";

import { memo } from "react";
import { useTranslations } from "next-intl";
import { Download, AlertTriangle, CheckCircle2 } from "lucide-react";
import { cn } from "@/lib/utils";
import type { ProcessedImage, Badge } from "@/types/core";
import { saveAs } from "file-saver";

interface ImageListItemProps {
  image: ProcessedImage;
  viewMode?: "list" | "grid";
}

function ImageListItem({
  image,
  viewMode = "list",
}: ImageListItemProps) {
  const t = useTranslations("Dashboard");
  const getBadgeLabel = (badge: Badge) =>
    badge.key ? t(badge.key as any) : badge.text;

  const handleDownload = () => {
    if (image.processedBlob) {
      const fileName = image.fileName.replace(/\.[^/.]+$/, "") + "_cleaned" + getFileExtension(image.fileType);
      saveAs(image.processedBlob, fileName);
    }
  };

  const getFileExtension = (mimeType: string): string => {
    const map: Record<string, string> = {
      "image/jpeg": ".jpg",
      "image/png": ".png",
      "image/webp": ".webp",
    };
    return map[mimeType] || ".jpg";
  };

  const formatFileSize = (bytes: number): string => {
    if (bytes < 1024) return bytes + " B";
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + " KB";
    return (bytes / (1024 * 1024)).toFixed(2) + " MB";
  };

  const hasPrivacyRisk = image.badges.some((b) => b.type === "danger");

  if (viewMode === "grid") {
    return (
      <div className="bg-white border-4 border-black shadow-brutal overflow-hidden hover-brutal">
        <div className="relative aspect-square bg-white border-b-4 border-black">
          <img
            src={image.thumbnailUrl}
            alt={image.fileName}
            className="w-full h-full object-cover"
          />
          {hasPrivacyRisk && (
            <div className="absolute top-2 right-2">
              <div className="bg-[#FFD93D] text-black text-xs font-black uppercase px-3 py-1 border-2 border-black shadow-brutal-sm flex items-center gap-1">
                <AlertTriangle className="w-3 h-3" />
                {t("badge_privacy_risk")}
              </div>
            </div>
          )}
        </div>
        <div className="p-4">
          <h3 className="font-black text-black truncate mb-2 uppercase text-sm">
            {image.fileName}
          </h3>
          <div className="flex items-center justify-between text-sm text-black mb-3 font-bold">
            <span>
              {formatFileSize(image.originalSize)} →{" "}
              {formatFileSize(image.processedSize || image.originalSize)}
            </span>
          </div>
          <button
            onClick={handleDownload}
            disabled={!image.processedBlob}
            className="w-full flex items-center justify-center gap-1.5 bg-[#A3E635] text-black border-2 border-black shadow-brutal hover-brutal btn-touch font-bold uppercase px-3 py-1.5 text-xs disabled:opacity-50 disabled:cursor-not-allowed disabled:shadow-none disabled:hover:transform-none"
          >
            <Download className="w-3.5 h-3.5" />
            <span>{t("download_single")}</span>
          </button>
        </div>
      </div>
    );
  }

  // List view
  return (
    <div className="bg-white border-4 border-black shadow-brutal p-4 hover-brutal">
      <div className="flex items-start gap-4">
        {/* 缩略图 */}
        <div className="relative w-24 h-24 flex-shrink-0 border-4 border-black bg-white overflow-hidden">
          <img
            src={image.thumbnailUrl}
            alt={image.fileName}
            className="w-full h-full object-cover"
          />
        </div>

        {/* 内容 */}
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-4 mb-2">
            <h3 className="font-black text-black truncate uppercase">
              {image.fileName}
            </h3>
            {hasPrivacyRisk ? (
              <div className="flex items-center gap-1 bg-[#FFD93D] text-black text-xs font-black uppercase px-3 py-1 border-2 border-black shadow-brutal-sm flex-shrink-0">
                <AlertTriangle className="w-3 h-3" />
                {t("badge_privacy_risk")}
              </div>
            ) : (
              <div className="flex items-center gap-1 bg-[#A3E635] text-black text-xs font-black uppercase px-3 py-1 border-2 border-black shadow-brutal-sm flex-shrink-0">
                <CheckCircle2 className="w-3 h-3" />
                {t("badge_clean")}
              </div>
            )}
          </div>

          {/* 文件大小 */}
          <div className="text-sm text-black mb-3 font-bold">
            <span>{t("file_size")}: </span>
            <span>
              {t("original")} {formatFileSize(image.originalSize)} →{" "}
              {t("processed")}{" "}
              {formatFileSize(image.processedSize || image.originalSize)}
            </span>
          </div>

          {/* 标签 */}
          {image.badges.length > 0 && (
            <div className="flex flex-wrap gap-2 mb-3">
              {image.badges.map((badge: Badge, index: number) => (
                <span
                  key={index}
                  className={cn(
                    "text-xs font-black uppercase px-3 py-1 border-2 border-black shadow-brutal-sm",
                    badge.type === "danger" &&
                      "bg-[#FFD93D] text-black",
                    badge.type === "warning" &&
                      "bg-[#FFD93D] text-black",
                    badge.type === "info" && "bg-[#00D9FF] text-black",
                    badge.type === "safe" &&
                      "bg-[#A3E635] text-black"
                  )}
                >
                  {getBadgeLabel(badge)}
                </span>
              ))}
            </div>
          )}

          {/* 下载按钮 */}
          <button
            onClick={handleDownload}
            disabled={!image.processedBlob}
            className="flex items-center gap-1.5 bg-[#A3E635] text-black border-2 border-black shadow-brutal hover-brutal btn-touch font-bold uppercase px-3 py-1.5 text-xs disabled:opacity-50 disabled:cursor-not-allowed disabled:shadow-none disabled:hover:transform-none"
          >
            <Download className="w-3.5 h-3.5" />
            <span>{t("download_single")}</span>
          </button>
        </div>
      </div>
    </div>
  );
}

export default memo(ImageListItem);

