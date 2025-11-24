"use client";

import { memo } from "react";
import { useTranslations } from "next-intl";
import { CheckCircle2, AlertTriangle } from "lucide-react";
import type { ProcessedImage } from "@/types/core";

interface StatusOverviewProps {
  images: ProcessedImage[];
}

function StatusOverview({ images }: StatusOverviewProps) {
  const t = useTranslations("Dashboard");

  // 统计信息
  const totalImages = images.length;
  const gpsCount = images.filter(
    (img) => img.meta.gps && img.badges.some((b) => b.type === "danger")
  ).length;
  const totalOriginalSize = images.reduce(
    (sum, img) => sum + img.originalSize,
    0
  );
  const totalProcessedSize = images.reduce(
    (sum, img) => sum + (img.processedSize || img.originalSize),
    0
  );
  const sizeSaved = Math.max(0, totalOriginalSize - totalProcessedSize);
  const sizeSavedMB = (sizeSaved / (1024 * 1024)).toFixed(2);

  return (
    <div className="bg-white border-4 border-black shadow-brutal-lg p-6">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-8 h-8 bg-[#A3E635] border-4 border-black shadow-brutal flex items-center justify-center">
          <CheckCircle2 className="w-5 h-5 text-black" />
        </div>
        <h2 className="text-xl font-black text-black uppercase">
          {t("analysis_complete")}
        </h2>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {/* 处理图片数量 */}
        <div className="flex flex-col bg-white border-4 border-black shadow-brutal p-4">
          <span className="text-3xl font-black text-black">
            {totalImages}
          </span>
          <span className="text-sm text-black mt-1 font-bold">
            {t("images_processed")}
          </span>
        </div>

        {/* GPS 位置数量 */}
        <div className="flex flex-col bg-[#FFD93D] border-4 border-black shadow-brutal p-4">
          <div className="flex items-center gap-2">
            <AlertTriangle className="w-5 h-5 text-black" />
            <span className="text-3xl font-black text-black">{gpsCount}</span>
          </div>
          <span className="text-sm text-black mt-1 font-bold">
            {t("gps_found")}
          </span>
        </div>

        {/* 节省空间 */}
        <div className="flex flex-col bg-[#A3E635] border-4 border-black shadow-brutal p-4">
          <span className="text-3xl font-black text-black">
            {sizeSavedMB} MB
          </span>
          <span className="text-sm text-black mt-1 font-bold">{t("size_saved")}</span>
        </div>
      </div>
    </div>
  );
}

export default memo(StatusOverview);

