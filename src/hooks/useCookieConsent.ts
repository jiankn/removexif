"use client";

import { useState, useEffect } from "react";

export type CookieConsent = {
  accepted: boolean;
  timestamp: number;
  preferences?: {
    essential: boolean;
    analytics: boolean;
    advertising: boolean;
  };
};

const COOKIE_CONSENT_KEY = "cookie-consent";
const CONSENT_EXPIRY_DAYS = 365; // 12 months

/**
 * Hook to manage cookie consent state
 */
export function useCookieConsent() {
  const [consent, setConsent] = useState<CookieConsent | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Load consent from localStorage on mount
  useEffect(() => {
    if (typeof window === "undefined") return;

    try {
      const stored = localStorage.getItem(COOKIE_CONSENT_KEY);
      if (stored) {
        const parsed: CookieConsent = JSON.parse(stored);
        
        // Check if consent has expired
        const expiryTime = parsed.timestamp + CONSENT_EXPIRY_DAYS * 24 * 60 * 60 * 1000;
        if (Date.now() > expiryTime) {
          // Consent expired, remove it
          localStorage.removeItem(COOKIE_CONSENT_KEY);
          setConsent(null);
        } else {
          setConsent(parsed);
        }
      }
    } catch (error) {
      console.error("Error loading cookie consent:", error);
      localStorage.removeItem(COOKIE_CONSENT_KEY);
    } finally {
      setIsLoading(false);
    }
  }, []);

  /**
   * Accept all cookies (including advertising)
   */
  const acceptAll = () => {
    const newConsent: CookieConsent = {
      accepted: true,
      timestamp: Date.now(),
      preferences: {
        essential: true,
        analytics: true,
        advertising: true,
      },
    };
    saveConsent(newConsent);
  };

  /**
   * Reject all non-essential cookies
   */
  const rejectAll = () => {
    const newConsent: CookieConsent = {
      accepted: true,
      timestamp: Date.now(),
      preferences: {
        essential: true,
        analytics: false,
        advertising: false,
      },
    };
    saveConsent(newConsent);
  };

  /**
   * Save consent to localStorage
   */
  const saveConsent = (newConsent: CookieConsent) => {
    try {
      localStorage.setItem(COOKIE_CONSENT_KEY, JSON.stringify(newConsent));
      setConsent(newConsent);
      
      // Trigger custom event for AdSense loading
      if (typeof window !== "undefined") {
        window.dispatchEvent(new CustomEvent("cookieConsentUpdated", { detail: newConsent }));
      }
    } catch (error) {
      console.error("Error saving cookie consent:", error);
    }
  };

  /**
   * Clear consent (revoke)
   */
  const clearConsent = () => {
    try {
      localStorage.removeItem(COOKIE_CONSENT_KEY);
      setConsent(null);
      
      // Trigger custom event
      if (typeof window !== "undefined") {
        window.dispatchEvent(new CustomEvent("cookieConsentUpdated", { detail: null }));
      }
    } catch (error) {
      console.error("Error clearing cookie consent:", error);
    }
  };

  /**
   * Check if advertising cookies are allowed
   */
  const isAdvertisingAllowed = () => {
    return consent?.preferences?.advertising === true;
  };

  /**
   * Check if user has made a choice
   */
  const hasConsent = () => {
    return consent !== null;
  };

  return {
    consent,
    isLoading,
    acceptAll,
    rejectAll,
    clearConsent,
    isAdvertisingAllowed,
    hasConsent,
  };
}

