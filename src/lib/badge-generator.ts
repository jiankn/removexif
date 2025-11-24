/**
 * 智能标签生成功能
 * 根据图片的 EXIF 元数据生成智能标签
 */

import type { Badge, ImageMetadata } from "@/types/core";

type TranslationFunction = (key: string) => string;

/**
 * 根据 ISO 值生成标签
 */
function generateISOBadge(iso?: number, t?: TranslationFunction): Badge | null {
  if (!iso) return null;

  if (iso >= 3200) {
    return {
      text: t ? t("badge_low_light") : "Low Light / Grainy",
      key: "badge_low_light",
      type: "info",
    };
  } else if (iso >= 1600) {
    return {
      text: t ? t("badge_high_iso") : "High ISO",
      key: "badge_high_iso",
      type: "info",
    };
  }

  return null;
}

/**
 * 根据光圈值生成标签
 */
function generateApertureBadge(aperture?: string, t?: TranslationFunction): Badge | null {
  if (!aperture) return null;

  // 提取光圈数值（如 "f/2.8" -> 2.8）
  const match = aperture.match(/f\/(\d+\.?\d*)/);
  if (!match) return null;

  const fNumber = parseFloat(match[1]);

  // 大光圈（小 f 值）通常用于人像和背景虚化
  if (fNumber <= 2.8) {
    return {
      text: t ? t("badge_bokeh") : "Bokeh Effect",
      key: "badge_bokeh",
      type: "info",
    };
  }

  return null;
}

/**
 * 根据 GPS 数据生成隐私风险标签
 */
function generateGPSBadge(gps?: { latitude: number; longitude: number }, t?: TranslationFunction): Badge | null {
  if (gps) {
    return {
      text: t ? t("badge_privacy_risk") : "Privacy Risk Found",
      key: "badge_privacy_risk",
      type: "danger",
    };
  }
  return null;
}

/**
 * 根据是否有 EXIF 数据生成安全标签
 */
function generateSafetyBadge(hasExif: boolean, t?: TranslationFunction): Badge | null {
  if (!hasExif) {
    return {
      text: t ? t("badge_safe") : "Safe to Share",
      key: "badge_safe",
      type: "safe",
    };
  }
  return null;
}

/**
 * 根据相机信息生成标签
 */
function generateCameraBadge(camera?: { make?: string; model?: string }, t?: TranslationFunction): Badge | null {
  if (camera?.make || camera?.model) {
    return {
      text: t ? t("badge_professional_camera") : "Professional Camera",
      key: "badge_professional_camera",
      type: "info",
    };
  }
  return null;
}

/**
 * 根据拍摄参数生成标签
 */
function generateShootingBadge(shooting?: {
  iso?: number;
  aperture?: string;
  shutterSpeed?: string;
  focalLength?: number;
}, t?: TranslationFunction): Badge | null {
  if (!shooting) return null;

  // 长焦距通常用于远摄
  if (shooting.focalLength && shooting.focalLength >= 200) {
    return {
      text: t ? t("badge_telephoto") : "Telephoto Lens",
      key: "badge_telephoto",
      type: "info",
    };
  }

  // 超广角
  if (shooting.focalLength && shooting.focalLength <= 24) {
    return {
      text: t ? t("badge_wide_angle") : "Wide Angle",
      key: "badge_wide_angle",
      type: "info",
    };
  }

  return null;
}

/**
 * 根据图片元数据生成智能标签列表
 * @param metadata 图片元数据
 * @param t 翻译函数（可选）
 * @returns Badge[] 标签数组
 */
export function generateBadges(metadata: ImageMetadata, t?: TranslationFunction): Badge[] {
  const badges: Badge[] = [];

  // 检查是否有 EXIF 数据
  const hasExif =
    metadata.camera ||
    metadata.gps ||
    metadata.shooting ||
    metadata.dateTime ||
    (metadata.rawExif && Object.keys(metadata.rawExif).length > 0);

  // 1. GPS 隐私风险标签（优先级最高）
  const gpsBadge = generateGPSBadge(metadata.gps, t);
  if (gpsBadge) {
    badges.push(gpsBadge);
  }

  // 2. 安全标签（如果没有 EXIF 数据）
  const safetyBadge = generateSafetyBadge(!hasExif, t);
  if (safetyBadge) {
    badges.push(safetyBadge);
  }

  // 3. ISO 标签
  const isoBadge = generateISOBadge(metadata.shooting?.iso, t);
  if (isoBadge) {
    badges.push(isoBadge);
  }

  // 4. 光圈标签
  const apertureBadge = generateApertureBadge(metadata.shooting?.aperture, t);
  if (apertureBadge) {
    badges.push(apertureBadge);
  }

  // 5. 相机标签
  const cameraBadge = generateCameraBadge(metadata.camera, t);
  if (cameraBadge) {
    badges.push(cameraBadge);
  }

  // 6. 拍摄参数标签
  const shootingBadge = generateShootingBadge(metadata.shooting, t);
  if (shootingBadge) {
    badges.push(shootingBadge);
  }

  return badges;
}

