"use client";

import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Hero from "@/components/Hero";
import TypographyShowcase from "@/components/TypographyShowcase";
import AboutSection from "@/components/AboutSection";
import ServicesGrid from "@/components/ServicesGrid";
import WritingSampleCard from "@/components/WritingSampleCard";
import TestimonialsCarousel from "@/components/TestimonialsCarousel";
import BlogPreview from "@/components/BlogPreview";
import StatsSection from "@/components/StatsSection";
import SectionHeading from "@/components/SectionHeading";
import SectionErrorBoundary from "@/components/SectionErrorBoundary";
import { useContent } from "@/components/ContentProvider";
import type {
  PersonalInfo,
  Nav,
  Hero as HeroType,
  About,
  Service,
  WritingSample,
  BlogPost,
  Testimonial,
  ContactInfo,
  Stat,
} from "@/lib/types";

const defaultPersonal: PersonalInfo = {
  name: "Sunita Thapa",
  profession: "SEO & Digital Marketing Specialist",
  email: "",
  phone: "",
  location: "",
  avatar: "",
};

const defaultNav: Nav = { logo: "Sunita Thapa", links: [] };

const defaultHero: HeroType = {
  title: "Sunita Thapa",
  role: "SEO Specialist & Digital Marketing Strategist",
  tagline: "",
  cta_primary: { label: "Get in touch", href: "/contact" },
  cta_secondary: { label: "View work", href: "/portfolio" },
  image: "",
};

const defaultAbout: About = {
  headline: "",
  bio: "",
  philosophy: "",
  expertise: [],
  experience: [],
  certifications: [],
  image: "",
};

const defaultContact: ContactInfo = {
  heading: "Let's work together",
  email: "",
  phone: "",
  location: "",
  socials: { github: "", linkedin: "", twitter: "", instagram: "" },
};

function orDefault<T>(value: T | undefined | null, fallback: T): T {
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

export default function HomeView() {
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
  const hero = orDefault(content.hero, defaultHero);
  const about = orDefault(content.about, defaultAbout);
  const services = Array.isArray(content.services) ? content.services : [];
  const portfolio = Array.isArray(content.portfolio) ? content.portfolio : [];
  const blog = Array.isArray(content.blog) ? content.blog : [];
  const stats = Array.isArray(content.stats) ? content.stats : [];
  const testimonials = Array.isArray(content.testimonials)
    ? content.testimonials
    : [];
  const contact = orDefault(content.contact, defaultContact);

  const featured = portfolio
    .filter((p) => p.featured)
    .concat(portfolio.filter((p) => !p.featured))
    .slice(0, 4);

  return (
    <main className="min-h-screen bg-cream">
      <Navbar personal={personal} links={nav.links} />
      <SectionErrorBoundary label="hero">
        <Hero hero={hero} personal={personal} />
      </SectionErrorBoundary>
      <SectionErrorBoundary label="typography">
        <TypographyShowcase />
      </SectionErrorBoundary>
      <SectionErrorBoundary label="about">
        <AboutSection about={about} personal={personal} />
      </SectionErrorBoundary>
      <SectionErrorBoundary label="stats">
        <StatsSection stats={stats} />
      </SectionErrorBoundary>

      <SectionErrorBoundary label="writing">
        <section id="writing" className="section-pad bg-surface-strong">
          <div className="container-px">
            <div className="mb-12 flex flex-wrap items-end justify-between gap-4">
              <SectionHeading
                align="left"
                eyebrow="Selected Writing"
                title={
                  <>
                    Words that do the <span className="serif-accent">work</span>
                  </>
                }
              />
              <a
                href="/portfolio"
                className="inline-flex items-center gap-1.5 text-sm font-semibold text-primary hover:gap-2.5"
              >
                View all samples <span aria-hidden>→</span>
              </a>
            </div>
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {featured.map((sample, i) => (
                <WritingSampleCard key={sample.id} sample={sample} idx={i} />
              ))}
            </div>
          </div>
        </section>
      </SectionErrorBoundary>

      <SectionErrorBoundary label="services">
        <ServicesGrid services={services} />
      </SectionErrorBoundary>
      <SectionErrorBoundary label="testimonials">
        <TestimonialsCarousel testimonials={testimonials} />
      </SectionErrorBoundary>
      <SectionErrorBoundary label="blog">
        <BlogPreview posts={blog} />
      </SectionErrorBoundary>

      <section className="section-pad bg-cream">
        <div className="container-px">
          <div className="relative overflow-hidden rounded-[2rem] border border-line bg-charcoal px-8 py-16 text-center text-cream shadow-soft-lg sm:px-16">
            <h2 className="mx-auto max-w-2xl font-serif text-3xl font-bold leading-tight text-cream sm:text-4xl">
              Have a story that deserves to be told well?
            </h2>
            <p className="mx-auto mt-4 max-w-xl text-cream/70">
              I&apos;m currently taking on new writing and content strategy projects.
            </p>
            <a
              href="/contact"
              className="btn-primary mt-8 inline-flex bg-white text-charcoal hover:scale-[1.03]"
            >
              Start a conversation
            </a>
          </div>
        </div>
      </section>

      <Footer contact={contact} />
    </main>
  );
}
