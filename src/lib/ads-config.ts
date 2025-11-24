/**
 * AdSense Configuration
 * 
 * This file manages AdSense ad unit slot IDs.
 * After AdSense approval (Chapter 21), update these values with real slot IDs
 * from your Google AdSense dashboard.
 */

export const adConfig = {
  // Top Banner Ad (Home Page)
  // Format: Horizontal banner (728x90 or responsive)
  topBanner: process.env.NEXT_PUBLIC_ADSENSE_SLOT_TOP_BANNER || "",

  // Sidebar Skyscraper Ad (Result Page)
  // Format: Vertical banner (300x600)
  sidebar: process.env.NEXT_PUBLIC_ADSENSE_SLOT_SIDEBAR || "",

  // Native Grid Ad (Result Page)
  // Format: Rectangle (300x250)
  nativeGrid: process.env.NEXT_PUBLIC_ADSENSE_SLOT_NATIVE_GRID || "",

  // EXIF Preview Drawer (Pre-processing step)
  // Format: Responsive rectangle inside modal
  previewDrawer: process.env.NEXT_PUBLIC_ADSENSE_SLOT_PREVIEW_DRAWER || "",

  // In-Article Ad (Blog Posts - to be implemented in Chapter 11)
  // Format: In-article (responsive)
  inArticle: process.env.NEXT_PUBLIC_ADSENSE_SLOT_IN_ARTICLE || "",
} as const;

/**
 * Check if ads are enabled
 */
export const isAdsEnabled = () => {
  return process.env.NEXT_PUBLIC_ENABLE_ADS === "true";
};

/**
 * Get AdSense Publisher ID
 */
export const getPublisherId = () => {
  return process.env.NEXT_PUBLIC_ADSENSE_ID || null;
};

