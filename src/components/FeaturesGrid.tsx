"use client";
import { useTranslations } from "next-intl";
import { Shield, Zap, Sparkles } from "lucide-react";

export default function FeaturesGrid() {
  const t = useTranslations("Home");

  const features = [
    {
      icon: Shield,
      title: t("feature_privacy_title"),
      description: t("feature_privacy_desc"),
      bgColor: "bg-[#FFD93D]",
      borderColor: "border-[#FF6B9D]",
    },
    {
      icon: Zap,
      title: t("feature_batch_title"),
      description: t("feature_batch_desc"),
      bgColor: "bg-[#A3E635]",
      borderColor: "border-[#FF6B9D]",
    },
    {
      icon: Sparkles,
      title: t("feature_lossless_title"),
      description: t("feature_lossless_desc"),
      bgColor: "bg-[#FF6B9D]",
      borderColor: "border-black",
    },
  ];

  return (
    <section className="py-16 px-4 sm:px-6 lg:px-8 bg-white">
      <div className="max-w-6xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {features.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <div
                key={index}
                className={`${feature.bgColor} border-4 ${feature.borderColor} p-8 shadow-brutal-lg hover-brutal transition-all`}
              >
                <div className="w-16 h-16 bg-black border-4 border-black flex items-center justify-center mb-6 shadow-brutal-sm">
                  <Icon className="w-8 h-8 text-white" strokeWidth={2.5} />
                </div>
                <h3 className="text-2xl font-black text-black mb-4 uppercase tracking-tight leading-tight">
                  {feature.title}
                </h3>
                <p className="text-black leading-relaxed font-bold text-base">
                  {feature.description}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

