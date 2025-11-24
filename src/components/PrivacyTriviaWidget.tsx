"use client";

import { useEffect, useState } from "react";
import { useTranslations } from "next-intl";
import { Lightbulb } from "lucide-react";

export default function PrivacyTriviaWidget() {
  const t = useTranslations("Widgets.PrivacyTrivia");
  const [currentIndex, setCurrentIndex] = useState(0);

  // 获取所有提示文本
  const tips = [
    t("tip_1"),
    t("tip_2"),
    t("tip_3"),
    t("tip_4"),
    t("tip_5"),
  ];

  useEffect(() => {
    // 每 5 秒切换一次提示
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % tips.length);
    }, 5000);

    return () => clearInterval(interval);
  }, [tips.length]);

  return (
    <div className="bg-[#FFD93D] border-4 border-black shadow-brutal p-4 md:p-6 mb-8">
      <div className="flex items-start gap-4">
        <div className="flex-shrink-0 mt-1">
          <div className="w-8 h-8 bg-white border-4 border-black shadow-brutal flex items-center justify-center">
            <Lightbulb className="w-5 h-5 text-black" />
          </div>
        </div>
        <div className="flex-1 min-h-[3rem] flex items-center">
          <p className="text-black text-sm md:text-base leading-relaxed font-bold">
            {tips[currentIndex]}
          </p>
        </div>
      </div>
    </div>
  );
}

