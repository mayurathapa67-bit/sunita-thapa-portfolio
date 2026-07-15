"use client";

import { createContext, useContext } from "react";
import { useJson } from "@/lib/hooks";
import type { PortfolioData } from "@/lib/types";

const ContentContext = createContext<PortfolioData | null>(null);

export function ContentProvider({ children }: { children: React.ReactNode }) {
  const { data } = useJson<PortfolioData>("/api/content");
  return (
    <ContentContext.Provider value={data ?? null}>
      {children}
    </ContentContext.Provider>
  );
}

export function useContent() {
  return useContext(ContentContext);
}
