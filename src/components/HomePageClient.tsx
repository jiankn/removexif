"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import ImageUpload from "@/components/ImageUpload";
import FeaturesGrid from "@/components/FeaturesGrid";
import SEOTextBlock from "@/components/SEOTextBlock";
import ProcessingModal from "@/components/ProcessingModal";
import AdUnit from "@/components/ads/AdUnit";
import { adConfig } from "@/lib/ads-config";
import type { ProcessedImage } from "@/types/core";
import ExifPreviewPanel from "@/components/ExifPreviewPanel";

interface HomePageClientProps {
  locale: string;
}

export default function HomePageClient({ locale }: HomePageClientProps) {
  const router = useRouter();
  const [filesToProcess, setFilesToProcess] = useState<File[] | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [previewFiles, setPreviewFiles] = useState<File[] | null>(null);

  const handleFilesSelected = (files: File[]) => {
    if (files.length > 0) {
      setPreviewFiles(files);
    }
  };

  const handleProcessingComplete = (_images: ProcessedImage[]) => {
    setIsProcessing(false);
    setFilesToProcess(null);
    router.push(`/${locale}/result`);
  };

  const handleProcessingError = (error: Error) => {
    console.error("Processing error:", error);
    setIsProcessing(false);
    setFilesToProcess(null);
    alert("处理图片时出错，请重试。");
  };

  const handlePreviewConfirm = () => {
    if (!previewFiles || previewFiles.length === 0) return;
    setFilesToProcess(previewFiles);
    setPreviewFiles(null);
    setIsProcessing(true);
  };

  const handlePreviewClose = () => {
    setPreviewFiles(null);
  };

  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      <main>
        <Hero />
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <AdUnit
            slotId={adConfig.topBanner}
            format="display"
            style="horizontal"
            fixedHeight={90}
            fallback="privacy-trivia"
            lazy={true}
            className="mb-8"
          />
        </div>
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
          <ImageUpload onFilesSelected={handleFilesSelected} />
        </div>
        <FeaturesGrid />
        <SEOTextBlock />
      </main>

      {isProcessing && filesToProcess && (
        <ProcessingModal
          files={filesToProcess}
          onComplete={handleProcessingComplete}
          onError={handleProcessingError}
        />
      )}

      {previewFiles && (
        <ExifPreviewPanel
          files={previewFiles}
          onClose={handlePreviewClose}
          onConfirm={handlePreviewConfirm}
        />
      )}
    </div>
  );
}


