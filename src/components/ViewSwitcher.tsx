"use client";

import { memo } from "react";
import { useTranslations } from "next-intl";
import { List, Grid } from "lucide-react";
import { cn } from "@/lib/utils";

type ViewMode = "list" | "grid";

interface ViewSwitcherProps {
  viewMode: ViewMode;
  onViewModeChange: (mode: ViewMode) => void;
}

function ViewSwitcher({
  viewMode,
  onViewModeChange,
}: ViewSwitcherProps) {
  const t = useTranslations("Dashboard");

  return (
    <div className="flex items-center gap-2 bg-white border-4 border-black shadow-brutal p-1">
      <button
        onClick={() => onViewModeChange("list")}
        className={cn(
          "flex items-center gap-2 px-4 py-2 border-2 border-black font-bold uppercase transition-all btn-touch",
          viewMode === "list"
            ? "bg-[#A3E635] text-black shadow-brutal-sm"
            : "bg-white text-black hover-brutal"
        )}
        aria-label={t("list_view")}
      >
        <List className="w-4 h-4" />
        <span className="text-sm">{t("list_view")}</span>
      </button>
      <button
        onClick={() => onViewModeChange("grid")}
        className={cn(
          "flex items-center gap-2 px-4 py-2 border-2 border-black font-bold uppercase transition-all btn-touch",
          viewMode === "grid"
            ? "bg-[#A3E635] text-black shadow-brutal-sm"
            : "bg-white text-black hover-brutal"
        )}
        aria-label={t("grid_view")}
      >
        <Grid className="w-4 h-4" />
        <span className="text-sm">{t("grid_view")}</span>
      </button>
    </div>
  );
}

export default memo(ViewSwitcher);

