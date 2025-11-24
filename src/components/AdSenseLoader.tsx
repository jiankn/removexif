"use client";

import { useEffect } from "react";
import Script from "next/script";
import { useCookieConsent } from "@/hooks/useCookieConsent";
import { isAdsEnabled, getPublisherId } from "@/lib/ads-config";

/**
 * Client component to conditionally load AdSense script
 * based on cookie consent
 */
export default function AdSenseLoader() {
  const { isAdvertisingAllowed, isLoading } = useCookieConsent();
  const adsEnabled = isAdsEnabled();
  const publisherId = getPublisherId();

  // Listen for consent changes
  useEffect(() => {
    const handleConsentUpdate = () => {
      // Reload page to apply consent changes
      // This ensures AdSense script is loaded/unloaded properly
      if (typeof window !== "undefined") {
        window.location.reload();
      }
    };

    window.addEventListener("cookieConsentUpdated", handleConsentUpdate);
    return () => {
      window.removeEventListener("cookieConsentUpdated", handleConsentUpdate);
    };
  }, []);

  // Only load AdSense if:
  // 1. Ads are enabled in config
  // 2. Publisher ID is set
  // 3. User has consented to advertising cookies
  // 4. Consent state has been loaded
  const shouldLoadAdSense =
    adsEnabled &&
    publisherId &&
    !isLoading &&
    isAdvertisingAllowed();

  if (!shouldLoadAdSense) {
    return null;
  }

  return (
    <Script
      id="adsbygoogle-init"
      strategy="afterInteractive"
      crossOrigin="anonymous"
      src={`https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${publisherId}`}
    />
  );
}

