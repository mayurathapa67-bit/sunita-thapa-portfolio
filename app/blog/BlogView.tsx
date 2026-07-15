"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import { Clock, ArrowUpRight } from "lucide-react";
import Link from "next/link";
import { useContent } from "@/components/ContentProvider";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import SectionHeading from "@/components/SectionHeading";
import SectionErrorBoundary from "@/components/SectionErrorBoundary";
import { orDefault, defaultPersonal, defaultNav, defaultContact } from "@/lib/contentFallbacks";
import { imageSrc, formatDate } from "@/lib/utils";
import type { PersonalInfo, Nav, BlogPost, ContactInfo } from "@/lib/types";

export default function BlogView() {
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
  const blog = Array.isArray(content.blog) ? content.blog : [];
  const contact = orDefault(content.contact, defaultContact);

  const [lead, ...rest] = blog;

  return (
    <main className="min-h-screen bg-cream pt-24">
      <Navbar personal={personal} links={nav.links} />

      <SectionErrorBoundary label="blog">
        <section className="section-pad bg-cream">
          <div className="container-px">
            <SectionHeading
              eyebrow="Journal"
              title={
                <>
                  Notes on the <span className="serif-accent">craft</span>
                </>
              }
              subtitle="Essays and observations on writing, SEO and the business of words."
            />

            {lead && (
              <motion.article
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                className="card relative mb-10 grid overflow-hidden p-0 md:grid-cols-2"
              >
                <div className="relative aspect-[16/10] md:aspect-auto">
                  {imageSrc(lead.featured_image) && (
                    <Image
                      src={imageSrc(lead.featured_image)}
                      alt={lead.title}
                      fill
                      sizes="(max-width: 768px) 100vw, 600px"
                      className="object-cover"
                    />
                  )}
                </div>
                <div className="flex flex-col justify-center p-8">
                  <span className="mb-3 inline-flex w-fit items-center gap-2 rounded-full border border-line bg-white/70 px-3 py-1 text-xs font-medium uppercase tracking-wider text-burgundy">
                    Featured · {lead.category}
                  </span>
                  <h2 className="font-serif text-2xl font-bold leading-snug text-ink sm:text-3xl">
                    <Link href={`/blog/${lead.id}`} className="after:absolute after:inset-0">
                      {lead.title}
                    </Link>
                  </h2>
                  <p className="mt-3 flex-1 text-muted">{lead.excerpt}</p>
                  <div className="mt-5 flex items-center gap-3 text-xs text-muted">
                    <span className="flex items-center gap-1.5">
                      <Clock size={13} className="text-primary" /> {lead.read_time} min read
                    </span>
                    <span>{formatDate(lead.published_date)}</span>
                  </div>
                </div>
              </motion.article>
            )}

            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {rest.map((post, idx) => {
                const src = imageSrc(post.featured_image);
                return (
                  <motion.article
                    key={post.id}
                    initial={{ opacity: 0, y: 24, filter: "blur(6px)" }}
                    whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                    viewport={{ once: true, margin: "-60px" }}
                    transition={{ duration: 0.6, delay: (idx % 3) * 0.08, ease: [0.22, 1, 0.36, 1] }}
                    className="card group relative flex flex-col overflow-hidden p-0 transition-all duration-300 hover:-translate-y-1.5 hover:border-line-strong hover:shadow-card-hover"
                  >
                    <div className="relative aspect-[16/10] w-full overflow-hidden bg-surface-strong">
                      {src && (
                        <Image
                          src={src}
                          alt={post.title}
                          fill
                          sizes="(max-width: 768px) 100vw, 360px"
                          className="object-cover transition-transform duration-500 group-hover:scale-105"
                        />
                      )}
                      <span className="absolute left-3 top-3 rounded-full border border-line bg-white/80 px-3 py-1 text-xs font-medium uppercase tracking-wider text-burgundy backdrop-blur">
                        {post.category}
                      </span>
                    </div>
                    <div className="flex flex-1 flex-col p-6">
                      <div className="mb-3 flex items-center gap-3 text-xs text-muted">
                        <span className="flex items-center gap-1.5">
                          <Clock size={13} className="text-primary" /> {post.read_time} min
                        </span>
                        <span>{formatDate(post.published_date)}</span>
                      </div>
                      <h3 className="font-serif text-xl font-semibold leading-snug text-ink transition-colors group-hover:text-primary">
                        <Link href={`/blog/${post.id}`} className="after:absolute after:inset-0">
                          {post.title}
                        </Link>
                      </h3>
                      <p className="mt-2 flex-1 text-sm leading-relaxed text-muted">{post.excerpt}</p>
                      <span className="mt-5 inline-flex items-center gap-1 text-sm font-semibold text-primary">
                        Read article <ArrowUpRight size={15} className="transition-transform group-hover:translate-x-0.5" />
                      </span>
                    </div>
                  </motion.article>
                );
              })}
            </div>
          </div>
        </section>
      </SectionErrorBoundary>

      <Footer contact={contact} />
    </main>
  );
}
