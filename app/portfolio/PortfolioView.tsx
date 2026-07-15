"use client";

import { useMemo, useState } from "react";
import { motion } from "framer-motion";
import { Search, X } from "lucide-react";
import { useContent } from "@/components/ContentProvider";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import WritingSampleCard from "@/components/WritingSampleCard";
import SectionHeading from "@/components/SectionHeading";
import SectionErrorBoundary from "@/components/SectionErrorBoundary";
import { orDefault, defaultPersonal, defaultNav, defaultContact } from "@/lib/contentFallbacks";
import { cn } from "@/lib/utils";
import type {
  PersonalInfo,
  Nav,
  WritingSample,
  WritingCategory,
  ContactInfo,
} from "@/lib/types";

const CATEGORIES: ("All" | WritingCategory)[] = [
  "All",
  "SEO Projects",
  "PPC Campaigns",
  "Content Marketing",
  "Social Media",
];

export default function PortfolioView() {
  const content = useContent();
  const [category, setCategory] = useState<"All" | WritingCategory>("All");
  const [query, setQuery] = useState("");

  const filtered = useMemo(() => {
    const items = Array.isArray(content?.portfolio) ? content.portfolio : [];
    const q = query.toLowerCase().trim();
    return items.filter((s) => {
      const matchCat = category === "All" || s.category === category;
      const matchQuery =
        !q ||
        s.title.toLowerCase().includes(q) ||
        s.excerpt.toLowerCase().includes(q) ||
        (s.client ?? "").toLowerCase().includes(q);
      return matchCat && matchQuery;
    });
  }, [content, category, query]);

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

      <section className="section-pad bg-cream">
        <div className="container-px">
          <SectionHeading
            eyebrow="Portfolio"
            title={
              <>
                The <span className="serif-accent">writing</span> portfolio
              </>
            }
            subtitle="Browse by category or search — every piece is built to inform, persuade or delight."
          />

          <div className="mb-8 flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <div className="flex flex-wrap gap-2">
              {CATEGORIES.map((c) => (
                <button
                  key={c}
                  onClick={() => setCategory(c)}
                  className={cn(
                    "rounded-full border px-4 py-2 text-sm font-medium transition-all",
                    category === c
                      ? "border-transparent bg-accent-gradient text-white shadow-glow"
                      : "border-line bg-white/60 text-ink hover:border-line-strong"
                  )}
                >
                  {c}
                </button>
              ))}
            </div>

            <div className="flex items-center gap-2 rounded-full border border-line bg-white/70 px-4 py-2.5">
              <Search size={16} className="text-muted" />
              <input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search samples..."
                className="w-44 bg-transparent text-sm text-ink outline-none placeholder:text-muted/60"
              />
              {query && (
                <button onClick={() => setQuery("")} aria-label="Clear search">
                  <X size={15} className="text-muted hover:text-ink" />
                </button>
              )}
            </div>
          </div>

          <SectionErrorBoundary label="portfolio">
            {filtered.length > 0 ? (
              <motion.div layout className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {filtered.map((sample, i) => (
                  <WritingSampleCard key={sample.id} sample={sample} idx={i} />
                ))}
              </motion.div>
            ) : (
              <p className="py-20 text-center text-muted">
                No writing samples match your filters.
              </p>
            )}
          </SectionErrorBoundary>
        </div>
      </section>

      <Footer contact={contact} />
    </main>
  );
}
