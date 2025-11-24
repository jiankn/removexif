"use client";

import { memo } from "react";
import { useTranslations } from "next-intl";
import { Download, RotateCcw } from "lucide-react";
import { useRouter } from "next/navigation";
import JSZip from "jszip";
import { saveAs } from "file-saver";
import type { ProcessedImage } from "@/types/core";

interface ActionBarProps {
  images: ProcessedImage[];
  onClear?: () => void;
}

function ActionBar({ images, onClear }: ActionBarProps) {
  const t = useTranslations("Dashboard");
  const router = useRouter();

  const handleDownloadAll = async () => {
    try {
      const zip = new JSZip();
      const validImages = images.filter((img) => img.processedBlob);

      for (const image of validImages) {
        if (image.processedBlob) {
          const fileName =
            image.fileName.replace(/\.[^/.]+$/, "") +
            "_cleaned" +
            getFileExtension(image.fileType);
          zip.file(fileName, image.processedBlob);
        }
      }

      const blob = await zip.generateAsync({ type: "blob" });
      saveAs(blob, "removed-exif-images.zip");
    } catch (error) {
      console.error("Failed to create ZIP file:", error);
      alert("Failed to create ZIP file. Please try again.");
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

  const handleStartOver = () => {
    if (onClear) {
      onClear();
    }
    router.push("/");
  };

  const hasProcessedImages = images.some((img) => img.processedBlob);

  return (
    <div className="sticky bottom-0 left-0 right-0 bg-white border-t-4 border-black shadow-brutal-sm z-10">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-2.5">
        <div className="flex items-center justify-between gap-3">
          <button
            onClick={handleStartOver}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-white text-black border-2 border-black shadow-brutal hover-brutal btn-touch font-bold uppercase text-sm"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>{t("start_over")}</span>
          </button>

          <button
            onClick={handleDownloadAll}
            disabled={!hasProcessedImages}
            className="flex items-center gap-1.5 bg-[#A3E635] text-black border-2 border-black shadow-brutal hover-brutal btn-touch font-bold uppercase px-4 py-1.5 text-sm disabled:opacity-50 disabled:cursor-not-allowed disabled:shadow-none disabled:hover:transform-none"
          >
            <Download className="w-4 h-4" />
            <span>{t("download_zip")}</span>
          </button>
        </div>
      </div>
    </div>
  );
}

export default memo(ActionBar);

