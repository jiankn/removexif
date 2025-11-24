"use client";

import { useEffect, useRef, useState } from "react";
import { usePathname } from "next/navigation";
import { isAdsEnabled, getPublisherId } from "@/lib/ads-config";
import PrivacyTriviaWidget from "../PrivacyTriviaWidget";
import FeaturedGuidesWidget from "../FeaturedGuidesWidget";
import TransparencyWidget from "../TransparencyWidget";

interface AdUnitProps {
  /**
   * AdSense slot ID (format: 1234567890)
   * Get this from Google AdSense dashboard after creating an ad unit
   */
  slotId?: string;
  
  /**
   * Ad format: "display" | "in-article" | "in-feed"
   * Default: "display"
   */
  format?: "display" | "in-article" | "in-feed";
  
  /**
   * Ad size: "auto" | "rectangle" | "vertical" | "horizontal"
   * Default: "auto"
   */
  style?: "auto" | "rectangle" | "vertical" | "horizontal";
  
  /**
   * Fixed height to prevent CLS (Cumulative Layout Shift)
   * If not provided, will use default heights based on style
   */
  fixedHeight?: number;
  
  /**
   * Fallback component to show when ads are disabled
   * Options: "privacy-trivia" | "featured-guides" | "transparency"
   */
  fallback?: "privacy-trivia" | "featured-guides" | "transparency";
  
  /**
   * Whether to use lazy loading with IntersectionObserver
   * Default: true
   */
  lazy?: boolean;
  
  /**
   * Additional className for the container
   */
  className?: string;
}

export default function AdUnit({
  slotId,
  format = "display",
  style = "auto",
  fixedHeight,
  fallback = "privacy-trivia",
  lazy = true,
  className = "",
}: AdUnitProps) {
  const pathname = usePathname();
  const adRef = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(!lazy);
  
  // Check if ads are enabled (client-side check)
  const adsEnabled = isAdsEnabled();
  const publisherId = getPublisherId();

  // Lazy loading with IntersectionObserver
  useEffect(() => {
    if (!lazy || !adRef.current) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setIsVisible(true);
            observer.disconnect();
          }
        });
      },
      { rootMargin: "100px" } // Start loading 100px before visible
    );

    observer.observe(adRef.current);

    return () => observer.disconnect();
  }, [lazy]);

  // Refresh ads on route change (AdSense requirement)
  useEffect(() => {
    if (!adsEnabled || !isVisible || !window.adsbygoogle) return;

    try {
      // Push new ad request
      (window.adsbygoogle = window.adsbygoogle || []).push({});
    } catch (err) {
      console.error("AdSense error:", err);
    }
  }, [pathname, adsEnabled, isVisible]);

  // Get default height based on style
  const getDefaultHeight = () => {
    if (fixedHeight) return fixedHeight;
    
    switch (style) {
      case "rectangle":
        return 250; // 300x250
      case "vertical":
        return 600; // 300x600 (skyscraper)
      case "horizontal":
        return 100; // 728x90 (leaderboard)
      default:
        return 250; // auto
    }
  };

  // Render fallback component
  const renderFallback = () => {
    switch (fallback) {
      case "privacy-trivia":
        return <PrivacyTriviaWidget />;
      case "featured-guides":
        return <FeaturedGuidesWidget />;
      case "transparency":
        return <TransparencyWidget />;
      default:
        return <PrivacyTriviaWidget />;
    }
  };

  // If ads are disabled or no publisher ID, show fallback (tips placeholder)
  // This is controlled by NEXT_PUBLIC_ENABLE_ADS in .env.local
  // When NEXT_PUBLIC_ENABLE_ADS=false, tips will be shown instead of ads
  // This does not affect AdSense application approval
  if (!adsEnabled || !publisherId || !slotId) {
    return (
      <div ref={adRef} className={className}>
        {renderFallback()}
      </div>
    );
  }

  // If lazy loading and not visible yet, show placeholder
  if (lazy && !isVisible) {
    return (
      <div
        ref={adRef}
        className={className}
        style={{ minHeight: getDefaultHeight() }}
      >
        {/* Placeholder to prevent layout shift */}
      </div>
    );
  }

  // Render AdSense ad
  return (
    <div ref={adRef} className={className}>
      <div
        className="ad-container"
        style={{
          minHeight: getDefaultHeight(),
          display: "flex",
          flexDirection: "column",
        }}
      >
        {/* Advertisement label (AdSense Policy requirement) */}
        <div className="text-xs text-black mb-1 text-center font-bold uppercase">
          Advertisement
        </div>
        
        {/* AdSense ad unit */}
        <ins
          className="adsbygoogle"
          style={{
            display: "block",
            minHeight: getDefaultHeight(),
          }}
          data-ad-client={publisherId}
          data-ad-slot={slotId}
          data-ad-format={format}
          data-full-width-responsive={style === "auto" ? "true" : "false"}
        />
      </div>
    </div>
  );
}

// Extend Window interface for TypeScript
declare global {
  interface Window {
    adsbygoogle?: any[];
  }
}

