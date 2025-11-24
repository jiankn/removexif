"use client";

import { useCallback, useEffect, useState } from "react";
import { useTranslations } from "next-intl";
import Navbar from "@/components/Navbar";
import StatusOverview from "@/components/StatusOverview";
import ViewSwitcher from "@/components/ViewSwitcher";
import ImageListItem from "@/components/ImageListItem";
import ActionBar from "@/components/ActionBar";
import AdUnit from "@/components/ads/AdUnit";
import { adConfig } from "@/lib/ads-config";
import {
  loadProcessedImages,
  clearProcessedImages,
  isIndexedDBAvailable,
} from "@/lib/indexeddb";
import { generateBadges } from "@/lib/badge-generator";
import type { ProcessedImage } from "@/types/core";

type ViewMode = "list" | "grid";

interface ResultPageClientProps {
  locale: string;
}

type ProcessedImagesWindow = Window & {
  __processedImagesData?: ProcessedImage[];
};

type StoredProcessedImage = Omit<ProcessedImage, "originalFile" | "processedBlob">;

export default function ResultPageClient({ locale }: ResultPageClientProps) {
  const t = useTranslations("Dashboard");
  const tCommon = useTranslations("Common");
  const [images, setImages] = useState<ProcessedImage[]>([]);
  const [viewMode, setViewMode] = useState<ViewMode>("list");
  const [loading, setLoading] = useState(true);

  const localizeImages = useCallback(
    (items: ProcessedImage[]): ProcessedImage[] =>
      items.map((img) => {
        const regeneratedBadges = generateBadges(img.meta, (key: string) => t(key));
        const fallbackBadges = (img.badges ?? []).map((badge) =>
          badge.key
            ? {
                ...badge,
                text: t(badge.key),
              }
            : badge
        );

        return {
          ...img,
          badges: regeneratedBadges.length > 0 ? regeneratedBadges : fallbackBadges,
        };
      }),
    [t]
  );

  useEffect(() => {
    const loadImagesData = async () => {
      const memoryData = (window as ProcessedImagesWindow).__processedImagesData;

      if (memoryData && Array.isArray(memoryData)) {
        setImages(localizeImages(memoryData));
        delete (window as ProcessedImagesWindow).__processedImagesData;
        setLoading(false);
        return;
      }

      if (isIndexedDBAvailable()) {
        try {
          const indexedDBData = await loadProcessedImages();
          if (indexedDBData && indexedDBData.length > 0) {
            const processedImages: ProcessedImage[] = indexedDBData.map((img) => {
              const placeholderFile = new File([img.processedBlob], img.fileName, {
                type: img.fileType,
              });

              return {
                ...img,
                originalFile: placeholderFile,
              };
            });
            setImages(localizeImages(processedImages));
            setLoading(false);
            return;
          }
        } catch (error) {
          console.error("Failed to load images from IndexedDB:", error);
        }
      }

      const storedData = sessionStorage.getItem("processedImages");
      if (storedData) {
        try {
          const parsed = JSON.parse(storedData) as StoredProcessedImage[];
          const processedImages: ProcessedImage[] = parsed.map((img) => {
            const placeholderFile = new File([], img.fileName, {
              type: img.fileType,
            });

            return {
              ...img,
              processedBlob: undefined,
              originalFile: placeholderFile,
            };
          });
          setImages(localizeImages(processedImages));
        } catch (error) {
          console.error("Failed to parse stored images:", error);
        }
      }
      setLoading(false);
    };

    loadImagesData();
  }, [localizeImages]);

  const handleClear = async () => {
    sessionStorage.removeItem("processedImages");

    if (isIndexedDBAvailable()) {
      try {
        await clearProcessedImages();
      } catch (error) {
        console.error("Failed to clear IndexedDB:", error);
      }
    }

    setImages([]);
  };

  const redirectToHome = () => {
    window.location.href = `/${locale}`;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-white">
        <Navbar />
        <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center text-black font-bold">{tCommon("loading")}</div>
        </main>
      </div>
    );
  }

  const hasImagesWithoutData = images.length > 0 && images.every((img) => !img.processedBlob);

  if (images.length === 0) {
    return (
      <div className="min-h-screen bg-white">
        <Navbar />
        <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center text-black py-16">
            <p className="text-lg mb-4 font-bold">{t("no_images")}</p>
            <button
              onClick={redirectToHome}
              className="bg-white text-black border-4 border-black shadow-brutal hover-brutal font-bold uppercase px-6 py-3"
            >
              {t("start_over")}
            </button>
          </div>
        </main>
      </div>
    );
  }

  if (hasImagesWithoutData) {
    return (
      <div className="min-h-screen bg-white">
        <Navbar />
        <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center text-black py-16">
            <p className="text-lg mb-2 font-bold">
              {t("images_data_lost") || "Image data has been lost after page refresh."}
            </p>
            <p className="text-sm mb-4 text-black font-bold">
              {t("please_reupload") || "Please upload and process your images again to download them."}
            </p>
            <button
              onClick={redirectToHome}
              className="bg-white text-black border-4 border-black shadow-brutal hover-brutal font-bold uppercase px-6 py-3"
            >
              {t("start_over")}
            </button>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white pb-24">
      <Navbar />
      <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-8">
        <div className="mb-8">
          <StatusOverview images={images} />
        </div>

        <div className="flex flex-col lg:flex-row gap-8">
          <div className="flex-1">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-black text-black uppercase">
                {t("images_processed")}
              </h2>
              <ViewSwitcher viewMode={viewMode} onViewModeChange={setViewMode} />
            </div>

            <div
              className={
                viewMode === "grid"
                  ? "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
                  : "flex flex-col gap-4"
              }
            >
              {images.map((image) => (
                <ImageListItem key={image.id} image={image} viewMode={viewMode} />
              ))}
            </div>

            <div className="mt-8">
              <AdUnit
                slotId={adConfig.nativeGrid}
                format="display"
                style="rectangle"
                fixedHeight={250}
                fallback="transparency"
                lazy={true}
              />
            </div>
          </div>

          <aside className="w-full lg:w-sidebar flex-shrink-0">
            <div className="sticky top-8">
              <AdUnit
                slotId={adConfig.sidebar}
                format="display"
                style="vertical"
                fixedHeight={600}
                fallback="featured-guides"
                lazy={true}
              />
            </div>
          </aside>
        </div>
      </main>

      <ActionBar images={images} onClear={handleClear} />
    </div>
  );
}


