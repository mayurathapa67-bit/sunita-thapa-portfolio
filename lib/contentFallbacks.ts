import type { PersonalInfo, Nav, Hero, About, ContactInfo } from "./types";

export const defaultPersonal: PersonalInfo = {
  name: "Sunita Thapa",
  profession: "SEO & Digital Marketing Specialist",
  email: "",
  phone: "",
  location: "",
  avatar: "",
};

export const defaultNav: Nav = { logo: "Sunita Thapa", links: [] };

export const defaultHero: Hero = {
  title: "Sunita Thapa",
  role: "SEO Specialist & Digital Marketing Strategist",
  tagline: "",
  cta_primary: { label: "Get in touch", href: "/contact" },
  cta_secondary: { label: "View work", href: "/portfolio" },
  image: "",
};

export const defaultAbout: About = {
  headline: "",
  bio: "",
  philosophy: "",
  expertise: [],
  experience: [],
  certifications: [],
  image: "",
};

export const defaultContact: ContactInfo = {
  heading: "Let's work together",
  email: "",
  phone: "",
  location: "",
  socials: { github: "", linkedin: "", twitter: "", instagram: "" },
};

export function orDefault<T>(value: T | undefined | null, fallback: T): T {
  if (value === undefined || value === null) return fallback;
  if (
    typeof value === "object" &&
    !Array.isArray(value) &&
    Object.keys(value as object).length === 0
  ) {
    return fallback;
  }
  return value;
}
