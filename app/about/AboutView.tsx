"use client";

import { useContent } from "@/components/ContentProvider";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import AboutSection from "@/components/AboutSection";
import Experience from "@/components/Experience";
import SectionErrorBoundary from "@/components/SectionErrorBoundary";
import { orDefault, defaultPersonal, defaultNav, defaultAbout, defaultContact } from "@/lib/contentFallbacks";
import type { PersonalInfo, Nav, About, ExperienceItem, ContactInfo } from "@/lib/types";

export default function AboutView() {
  const content = useContent();

  if (!content) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-cream">
        <span className="h-8 w-8 animate-pulse rounded-full bg-primary/30" />
      </div>
    );
  }

  const personal = orDefault(content.personal, defaultPersonal);
  const nav = orDefault(content.nav, defaultNav);
  const about = orDefault(content.about, defaultAbout);
  const experience = Array.isArray(content.experience) ? content.experience : [];
  const contact = orDefault(content.contact, defaultContact);

  return (
    <main className="min-h-screen bg-cream pt-24">
      <Navbar personal={personal} links={nav.links} />
      <SectionErrorBoundary label="about">
        <AboutSection about={about} personal={personal} />
      </SectionErrorBoundary>
      <SectionErrorBoundary label="experience">
        <Experience experience={experience} />
      </SectionErrorBoundary>
      <Footer contact={contact} />
    </main>
  );
}
