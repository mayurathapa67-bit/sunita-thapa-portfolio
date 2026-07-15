"use client";

import Link from "next/link";
import Image from "next/image";
import { useParams } from "next/navigation";
import { Clock } from "lucide-react";
import { useContent } from "@/components/ContentProvider";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { orDefault, defaultPersonal, defaultNav, defaultContact } from "@/lib/contentFallbacks";
import { imageSrc, formatDate } from "@/lib/utils";
import type { BlogPost } from "@/lib/types";

export const dynamic = "force-dynamic";

export default function BlogPostPage() {
  const params = useParams();
  const id = Number(params.id);
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
  const blog = Array.isArray(content.blog) ? content.blog : [];
  const post = blog.find((p) => p.id === id) as BlogPost | undefined;

  if (!post) {
    return (
      <main className="min-h-screen bg-cream pt-24">
        <Navbar personal={personal} links={nav.links} />
        <div className="container-px py-24 text-center text-muted">
          That article could not be found.
        </div>
        <Footer contact={contact} />
      </main>
    );
  }

  const paragraphs = (post.content ?? "")
    .split(/\n{2,}/)
    .map((p) => p.trim())
    .filter(Boolean);
  const src = imageSrc(post.featured_image);

  return (
    <main className="min-h-screen bg-cream pt-24">
      <Navbar personal={personal} links={nav.links} />

      <article className="container-px mx-auto max-w-3xl py-12">
        <span className="text-xs font-semibold uppercase tracking-[0.18em] text-burgundy">
          {post.category}
        </span>
        <h1 className="mt-3 font-serif text-4xl font-bold leading-tight text-ink sm:text-5xl">
          {post.title}
        </h1>
        <div className="mt-4 flex items-center gap-3 text-sm text-muted">
          <span className="flex items-center gap-1.5">
            <Clock size={14} /> {post.read_time} min read
          </span>
          <span>{formatDate(post.published_date)}</span>
        </div>

        {src && (
          <div className="relative mt-8 aspect-[16/9] w-full overflow-hidden rounded-3xl border border-line shadow-soft-lg">
            <Image
              src={src}
              alt={post.title}
              fill
              sizes="(max-width: 768px) 100vw, 768px"
              className="object-cover"
            />
          </div>
        )}

        <div className="mt-10 space-y-5 text-lg leading-relaxed text-ink/90">
          {paragraphs.length > 0 ? (
            paragraphs.map((p, i) => <p key={i}>{p}</p>)
          ) : (
            <p>{post.excerpt}</p>
          )}
        </div>

        <div className="mt-12 border-t border-line pt-6">
          <Link
            href="/blog"
            className="inline-flex items-center gap-1.5 text-sm font-semibold text-primary hover:gap-2.5"
          >
            ← Back to Journal
          </Link>
        </div>
      </article>

      <Footer contact={contact} />
    </main>
  );
}
