"use client";

import {
  createContext,
  useContext,
  type ReactNode,
} from "react";
import type { Locale } from "@/i18n";

export interface LanguageAvailabilityContextValue {
  availableLocales?: Locale[];
  message?: string | null;
}

const LanguageAvailabilityContext =
  createContext<LanguageAvailabilityContextValue | null>(null);

export function LanguageAvailabilityProvider({
  value,
  children,
}: {
  value: LanguageAvailabilityContextValue;
  children: ReactNode;
}) {
  return (
    <LanguageAvailabilityContext.Provider value={value}>
      {children}
    </LanguageAvailabilityContext.Provider>
  );
}

export function useLanguageAvailability() {
  return useContext(LanguageAvailabilityContext);
}

