/* eslint-disable @next/next/no-img-element */
"use client";

import { useEffect, useMemo, useState } from "react";
import { useTranslations } from "next-intl";
import { X, Eye, ShieldAlert, ShieldCheck, Loader2, MapPin } from "lucide-react";
import { readExifData } from "@/lib/exif-reader";
import type { ImageMetadata } from "@/types/core";
import { cn } from "@/lib/utils";
import AdUnit from "@/components/ads/AdUnit";
import { adConfig } from "@/lib/ads-config";

interface ExifPreviewPanelProps {
  files: File[];
  onClose: () => void;
  onConfirm: (files: File[]) => void;
}

interface PreviewItem {
  id: string;
  file: File;
  thumbnailUrl?: string;
  metadata?: ImageMetadata;
  loading: boolean;
  error?: string;
}

const createThumbnailUrl = (file: File): Promise<string> =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const url = e.target?.result as string;
      if (url) {
        resolve(url);
      } else {
        reject(new Error("Failed to create thumbnail"));
      }
    };
    reader.onerror = () => reject(new Error("Failed to read file"));
    reader.readAsDataURL(file);
  });

export default function ExifPreviewPanel({
  files,
  onClose,
  onConfirm,
}: ExifPreviewPanelProps) {
  const t = useTranslations("Home");
  const [items, setItems] = useState<PreviewItem[]>([]);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [isMounting, setIsMounting] = useState(true);

  useEffect(() => {
    let isMounted = true;
    setIsMounting(true);

    const bootstrap = async () => {
      const initialItems: PreviewItem[] = files.map((file, index) => ({
        id: `${file.name}-${file.size}-${index}-${Date.now()}`,
        file,
        loading: true,
      }));
      if (isMounted) {
        setItems(initialItems);
        setSelectedId(initialItems[0]?.id ?? null);
      }

      await Promise.all(
        initialItems.map(async (item, idx) => {
          try {
            const [thumbnailUrl, metadata] = await Promise.all([
              createThumbnailUrl(files[idx]),
              readExifData(files[idx]),
            ]);

            if (!isMounted) return;
            setItems((prev) =>
              prev.map((entry) =>
                entry.id === item.id
                  ? {
                      ...entry,
                      thumbnailUrl,
                      metadata,
                      loading: false,
                    }
                  : entry
              )
            );
          } catch (error) {
            if (!isMounted) return;
            setItems((prev) =>
              prev.map((entry) =>
                entry.id === item.id
                  ? {
                      ...entry,
                      loading: false,
                      error:
                        error instanceof Error
                          ? error.message
                          : t("preview_error_generic"),
                    }
                  : entry
              )
            );
          }
        })
      );

      if (isMounted) {
        setIsMounting(false);
      }
    };

    bootstrap();

    return () => {
      isMounted = false;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [files]);

  const selectedItem = useMemo(
    () => items.find((item) => item.id === selectedId) ?? items[0],
    [items, selectedId]
  );

  const hasExifData = (meta?: ImageMetadata) =>
    Boolean(meta?.rawExif && Object.keys(meta.rawExif).length > 0);

  const formatDateTime = (value?: string) => {
    if (!value) return "";
    const normalized = value.replace(
      /^(\d{4}):(\d{2}):(\d{2})/,
      "$1-$2-$3"
    );
    const parsed = new Date(normalized);
    if (Number.isNaN(parsed.getTime())) {
      return normalized;
    }
    return parsed.toLocaleString();
  };

  const formatResolution = (meta?: ImageMetadata) => {
    if (!meta?.width || !meta?.height) return "";
    return `${meta.width} × ${meta.height}px`;
  };

  const formatExposure = (meta?: ImageMetadata) => {
    if (!meta?.shooting) return "";
    const chunks: string[] = [];
    if (meta.shooting.iso) {
      chunks.push(`ISO ${meta.shooting.iso}`);
    }
    if (meta.shooting.aperture) {
      chunks.push(meta.shooting.aperture);
    }
    if (meta.shooting.shutterSpeed) {
      chunks.push(meta.shooting.shutterSpeed);
    }
    if (meta.shooting.focalLength) {
      chunks.push(`${meta.shooting.focalLength}mm`);
    }
    return chunks.join(" • ");
  };

  const formatGPS = (meta?: ImageMetadata) => {
    if (!meta?.gps) return "";
    const { latitude, longitude } = meta.gps;
    return `${latitude.toFixed(4)}°, ${longitude.toFixed(4)}°`;
  };

  const hasGps = Boolean(selectedItem?.metadata?.gps);

  const handleConfirm = () => {
    if (isMounting) return;
    onConfirm(files);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/30 backdrop-blur-sm flex items-center justify-center px-4 py-8">
      <div className="relative w-full max-w-6xl bg-[#F7F2EC] border-4 border-black shadow-brutal-xl flex flex-col lg:flex-row h-full max-h-[90vh] overflow-hidden">
        <button
          aria-label={t("preview_close")}
          className="absolute top-4 right-4 bg-white border-2 border-black w-10 h-10 flex items-center justify-center shadow-brutal-sm hover-brutal"
          onClick={onClose}
        >
          <X className="w-5 h-5 text-black" />
        </button>

        {/* File list */}
        <div className="flex-1 flex flex-col h-full">
          <div className="px-6 lg:px-8 pt-6 pb-4 border-b-4 border-black bg-[#F7F2EC]/80 backdrop-blur-sm">
            <div className="flex flex-col gap-1">
              <p className="text-sm font-black uppercase text-black">
                {t("preview_list_title")}
              </p>
              <h2 className="text-3xl font-black text-black uppercase">
                {t("preview_drawer_title")}
              </h2>
              <p className="text-sm text-black font-bold max-w-2xl">
                {t("preview_drawer_subtitle")}
              </p>
            </div>
          </div>

          <div className="flex-1 overflow-y-auto px-6 lg:px-8 py-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {items.map((item) => {
                const gpsDetected = Boolean(item.metadata?.gps);
                const missingExif = !item.loading && !hasExifData(item.metadata);

                return (
                  <div
                    key={item.id}
                    className={cn(
                      "border-4 border-black bg-white shadow-brutal p-4 flex flex-col gap-3 transition-transform",
                      selectedId === item.id ? "bg-[#A3E635]/30" : "hover:-translate-y-1"
                    )}
                  >
                    <div className="relative border-4 border-black bg-white h-40 overflow-hidden">
                      {item.thumbnailUrl ? (
                        <img
                          src={item.thumbnailUrl}
                          alt={item.file.name}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="flex items-center justify-center h-full text-black font-bold">
                          {t("preview_loading")}
                        </div>
                      )}
                      {gpsDetected && (
                        <div className="absolute top-2 left-2 bg-[#FFD93D] text-black text-xs font-black uppercase px-3 py-1 border-2 border-black shadow-brutal-sm flex items-center gap-1">
                          <MapPin className="w-3 h-3" />
                          {t("preview_meta_gps_flag")}
                        </div>
                      )}
                      {missingExif && (
                        <div className="absolute top-2 left-2 bg-[#00D9FF] text-black text-xs font-black uppercase px-3 py-1 border-2 border-black shadow-brutal-sm">
                          {t("preview_meta_none_short")}
                        </div>
                      )}
                    </div>

                    <div>
                      <p className="text-sm font-black uppercase text-black truncate">
                        {item.file.name}
                      </p>
                      <p className="text-xs text-black font-bold">
                        {(item.file.size / (1024 * 1024)).toFixed(2)} MB
                      </p>
                    </div>

                    <div className="mt-auto flex flex-col gap-2">
                      <button
                        onClick={() => setSelectedId(item.id)}
                        className={cn(
                          "w-full flex items-center justify-center gap-2 border-2 border-black px-3 py-2 text-xs font-black uppercase shadow-brutal-sm",
                          selectedId === item.id
                            ? "bg-black text-white"
                            : "bg-[#FFE8A3] text-black hover-brutal"
                        )}
                      >
                        <Eye className="w-4 h-4" />
                        {t("preview_card_preview")}
                      </button>

                      <button
                        onClick={handleConfirm}
                        className="w-full flex items-center justify-center gap-2 bg-[#A3E635] border-2 border-black text-black px-3 py-2 text-xs font-black uppercase shadow-brutal-sm hover-brutal"
                      >
                        <ShieldCheck className="w-4 h-4" />
                        {t("preview_card_clean")}
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Detail side panel */}
        <div className="w-full lg:w-[420px] xl:w-[520px] border-t-4 lg:border-t-0 lg:border-l-4 border-black bg-white flex flex-col h-full max-w-full">
          <div className="border-b-4 border-black px-5 py-4 space-y-2">
            <p className="text-xs font-black uppercase text-black">
              {t("preview_selected_label")}
            </p>
            <h3 className="text-xl font-black text-black uppercase">
              {selectedItem?.file.name}
            </h3>
            <p className="text-xs font-bold text-black">
              {((selectedItem?.file.size ?? 0) / (1024 * 1024)).toFixed(2)} MB
            </p>
          </div>

          <div className="flex-1 overflow-hidden flex flex-col">
            <div className="flex-1 overflow-y-auto px-5 py-6 space-y-5">
            {selectedItem?.loading && (
              <div className="flex items-center gap-2 text-black font-bold">
                <Loader2 className="w-4 h-4 animate-spin" />
                {t("preview_loading")}
              </div>
            )}

              {!selectedItem?.loading && !hasExifData(selectedItem?.metadata) && (
                <div className="bg-[#00D9FF]/30 border-2 border-black text-black text-xs font-black uppercase px-3 py-2 shadow-brutal-sm">
                  {t("preview_meta_none")}
                </div>
              )}

              {selectedItem?.error && (
                <div className="bg-[#FF6B9D]/30 border-2 border-black text-black text-xs font-black uppercase px-3 py-2 shadow-brutal-sm">
                  {selectedItem.error}
                </div>
              )}

              {selectedItem?.metadata && (
                <div className="grid gap-4 lg:grid-cols-2">
                  {selectedItem.metadata.dateTime && (
                    <div className="border-2 border-black p-3 bg-[#F7F2EC] shadow-brutal-sm lg:col-span-2">
                      <p className="text-xs font-black uppercase text-black">
                        {t("preview_meta_timestamp")}
                      </p>
                      <p className="text-sm font-bold text-black">
                        {formatDateTime(selectedItem.metadata.dateTime)}
                      </p>
                    </div>
                  )}

                  {selectedItem.metadata.camera && (
                    <div className="border-2 border-black p-3 bg-white shadow-brutal-sm">
                      <p className="text-xs font-black uppercase text-black">
                        {t("preview_meta_camera")}
                      </p>
                      <p className="text-sm font-bold text-black">
                        {[selectedItem.metadata.camera.make, selectedItem.metadata.camera.model]
                          .filter(Boolean)
                          .join(" • ")}
                      </p>
                    </div>
                  )}

                  {formatExposure(selectedItem.metadata) && (
                    <div className="border-2 border-black p-3 bg-white shadow-brutal-sm">
                      <p className="text-xs font-black uppercase text-black">
                        {t("preview_meta_exposure")}
                      </p>
                      <p className="text-sm font-bold text-black">
                        {formatExposure(selectedItem.metadata)}
                      </p>
                    </div>
                  )}

                  {formatResolution(selectedItem.metadata) && (
                    <div className="border-2 border-black p-3 bg-white shadow-brutal-sm">
                      <p className="text-xs font-black uppercase text-black">
                        {t("preview_meta_resolution")}
                      </p>
                      <p className="text-sm font-bold text-black">
                        {formatResolution(selectedItem.metadata)}
                      </p>
                    </div>
                  )}

                  {hasGps && (
                    <div className="border-2 border-black p-3 bg-[#FFD93D]/40 shadow-brutal-sm lg:col-span-2">
                      <p className="text-xs font-black uppercase text-black flex items-center gap-2">
                        <ShieldAlert className="w-4 h-4" />
                        {t("preview_meta_gps")}
                      </p>
                      <p className="text-sm font-bold text-black">{formatGPS(selectedItem.metadata)}</p>
                      <p className="text-xs text-black font-bold mt-1">
                        {t("preview_meta_gps_warning")}
                      </p>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>

          <div className="border-t-4 border-black p-4 space-y-3">
            <button
              onClick={handleConfirm}
              disabled={isMounting}
              className="w-full flex items-center justify-center gap-2 bg-[#A3E635] border-4 border-black text-black font-black uppercase py-3 shadow-brutal hover-brutal disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <ShieldCheck className="w-5 h-5" />
              {t("preview_primary_cta")}
            </button>
            <button
              onClick={onClose}
              className="w-full text-xs font-black uppercase text-black border-2 border-black py-2 hover-brutal"
            >
              {t("preview_secondary_cta")}
            </button>
          </div>

          <div className="border-t-4 border-black p-4">
            <AdUnit
              slotId={adConfig.previewDrawer}
              format="display"
              style="rectangle"
              fixedHeight={180}
              fallback="privacy-trivia"
              lazy={false}
            />
          </div>
        </div>
      </div>
    </div>
  );
}


