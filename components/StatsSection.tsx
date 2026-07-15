"use client";

import { useEffect, useRef, useState } from "react";
import { motion, useInView } from "framer-motion";
import {
  TrendingUp,
  Search,
  Target,
  Users,
  BarChart3,
  type LucideIcon,
} from "lucide-react";
import type { Stat } from "@/lib/types";
import SectionHeading from "./SectionHeading";

const ICONS: Record<string, LucideIcon> = {
  TrendingUp,
  Search,
  Target,
  Users,
  BarChart3,
};

function Counter({ value, suffix }: { value: number; suffix?: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: "-40px" });
  const [display, setDisplay] = useState(0);
  const isFloat = !Number.isInteger(value);

  useEffect(() => {
    if (!inView) return;
    let raf = 0;
    const start = performance.now();
    const duration = 1400;
    const tick = (now: number) => {
      const t = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - t, 3);
      setDisplay(value * eased);
      if (t < 1) raf = requestAnimationFrame(tick);
      else setDisplay(value);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [inView, value]);

  return (
    <span ref={ref} className="font-serif text-5xl font-bold text-ink sm:text-6xl">
      {isFloat ? display.toFixed(1) : Math.round(display)}
      {suffix && <span className="text-primary">{suffix}</span>}
    </span>
  );
}

export default function StatsSection({ stats }: { stats: Stat[] }) {
  const safeStats = Array.isArray(stats) ? stats : [];
  if (safeStats.length === 0) return null;

  return (
    <section className="section-pad bg-cream">
      <div className="container-px">
        <SectionHeading
          eyebrow="By the numbers"
          title={
            <>
              Results that <span className="serif-accent">speak</span>
            </>
          }
          subtitle="A snapshot of the impact of data-led SEO and digital marketing."
        />

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {safeStats.map((stat, i) => {
            const Icon = stat.icon ? ICONS[stat.icon] ?? BarChart3 : BarChart3;
            return (
              <motion.div
                key={stat.id}
                initial={{ opacity: 0, y: 24, filter: "blur(6px)" }}
                whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                viewport={{ once: true, margin: "-60px" }}
                transition={{ duration: 0.6, delay: i * 0.08, ease: [0.22, 1, 0.36, 1] }}
                className="card flex flex-col items-start gap-4"
              >
                <span className="flex h-11 w-11 items-center justify-center rounded-xl border border-line bg-white/70 text-primary">
                  <Icon size={20} />
                </span>
                <Counter value={stat.value} suffix={stat.suffix} />
                <p className="text-sm leading-relaxed text-muted">{stat.label}</p>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
