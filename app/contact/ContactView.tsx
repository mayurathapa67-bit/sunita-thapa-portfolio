"use client";

import { useContent } from "@/components/ContentProvider";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import ContactSection from "@/components/ContactSection";
import SectionErrorBoundary from "@/components/SectionErrorBoundary";
import { orDefault, defaultPersonal, defaultNav, defaultContact } from "@/lib/contentFallbacks";
import type { PersonalInfo, Nav, ContactInfo } from "@/lib/types";

export default function ContactView() {
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
  const contact = orDefault(content.contact, defaultContact);

  return (
    <main className="min-h-screen bg-cream pt-24">
      <Navbar personal={personal} links={nav.links} />
      <SectionErrorBoundary label="contact">
        <ContactSection contact={contact} />
      </SectionErrorBoundary>
      <Footer contact={contact} />
    </main>
  );
}
