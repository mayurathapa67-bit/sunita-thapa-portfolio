import type { PortfolioData } from "./types";

export function readDB(): PortfolioData {
  return {
    personal: {} as PortfolioData["personal"],
    nav: {} as PortfolioData["nav"],
    hero: {} as PortfolioData["hero"],
    about: {} as PortfolioData["about"],
    services: [],
    portfolio: [],
    blog: [],
    stats: [],
    experience: [],
    testimonials: [],
    contact: {} as PortfolioData["contact"],
    socials: {} as PortfolioData["socials"],
  };
}

export function writeDB(_data: PortfolioData, _mode?: string): { github: boolean } {
  console.warn("writeDB called but not implemented for Vercel");
  return { github: false };
}

export function readDrafts(): Partial<PortfolioData> {
  return {};
}

export function writeDrafts(_data: Partial<PortfolioData>): void {
  console.warn("writeDrafts called but not implemented for Vercel");
}

export function clearDraft(_section: keyof PortfolioData): void {
  /* no-op */
}
