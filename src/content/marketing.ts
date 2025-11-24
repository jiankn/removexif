import { getTranslations } from "next-intl/server";
import type { Locale } from "@/i18n";

const featureSectionIds = ["instant", "remover", "automation"] as const;
const howToStepIds = ["upload", "preview", "clean", "distribute"] as const;

export interface ChameleonSidebarContent {
  badge?: string;
  title: string;
  description: string;
  bullets: string[];
  cta?: string;
}

export interface FeaturesPageSection {
  title: string;
  description: string;
  highlights: string[];
}

export interface FeaturesPageContent {
  heroBadge: string;
  heroTitle: string;
  heroDescription: string;
  sections: FeaturesPageSection[];
  cta: {
    title: string;
    description: string;
    buttonLabel: string;
  };
}

export interface HowToUsePageStep {
  title: string;
  description: string;
  metadata: string[];
}

export interface HowToUsePageContent {
  heroBadge: string;
  heroTitle: string;
  heroDescription: string;
  steps: HowToUsePageStep[];
  checklistTitle: string;
  checklistItems: string[];
  useCasesTitle: string;
  useCases: string[];
  cta: {
    title: string;
    description: string;
    buttonLabel: string;
  };
}

export interface FAQItem {
  question: string;
  answer: string;
}

export interface FAQPageContent {
  heroBadge: string;
  heroTitle: string;
  heroDescription: string;
  faqs: FAQItem[];
  cta: {
    title: string;
    description: string;
    buttonLabel: string;
  };
}

export async function getChameleonSidebarContent(locale: Locale): Promise<ChameleonSidebarContent> {
  const t = await getTranslations({ locale, namespace: "ChameleonSidebar" });
  const bullets = (t.raw("bullets") as string[]) ?? [];

  return {
    badge: t("badge"),
    title: t("title"),
    description: t("description"),
    bullets,
    cta: t("cta"),
  };
}

export async function getFeaturesPageContent(locale: Locale): Promise<FeaturesPageContent> {
  const t = await getTranslations({ locale, namespace: "FeaturesPage" });

  const sections = featureSectionIds.map((sectionId) => ({
    title: t(`sections.${sectionId}.title`),
    description: t(`sections.${sectionId}.description`),
    highlights: (t.raw(`sections.${sectionId}.highlights`) as string[]) ?? [],
  }));

  return {
    heroBadge: t("hero.badge"),
    heroTitle: t("hero.title"),
    heroDescription: t("hero.description"),
    sections,
    cta: {
      title: t("cta.title"),
      description: t("cta.description"),
      buttonLabel: t("cta.button"),
    },
  };
}

export async function getHowToUsePageContent(locale: Locale): Promise<HowToUsePageContent> {
  const t = await getTranslations({ locale, namespace: "HowToUsePage" });

  const steps = howToStepIds.map((stepId) => ({
    title: t(`steps.${stepId}.title`),
    description: t(`steps.${stepId}.description`),
    metadata: (t.raw(`steps.${stepId}.metadata`) as string[]) ?? [],
  }));

  return {
    heroBadge: t("hero.badge"),
    heroTitle: t("hero.title"),
    heroDescription: t("hero.description"),
    steps,
    checklistTitle: t("checklist.title"),
    checklistItems: (t.raw("checklist.items") as string[]) ?? [],
    useCasesTitle: t("use_cases.title"),
    useCases: (t.raw("use_cases.items") as string[]) ?? [],
    cta: {
      title: t("cta.title"),
      description: t("cta.description"),
      buttonLabel: t("cta.button"),
    },
  };
}

export async function getFaqPageContent(locale: Locale): Promise<FAQPageContent> {
  const t = await getTranslations({ locale, namespace: "FAQPage" });

  return {
    heroBadge: t("hero.badge"),
    heroTitle: t("hero.title"),
    heroDescription: t("hero.description"),
    faqs: (t.raw("faqs") as FAQItem[]) ?? [],
    cta: {
      title: t("cta.title"),
      description: t("cta.description"),
      buttonLabel: t("cta.button"),
    },
  };
}

