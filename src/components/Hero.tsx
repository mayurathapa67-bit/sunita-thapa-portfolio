"use client";

import { useRef, useState } from "react";
import { motion, useMotionValue, useSpring } from "framer-motion";
import { ArrowRight } from "./icons";

type HeroData = {
  title: string;
  role: string;
  subtitle: string;
  location: string;
  cta_primary: string;
  cta_secondary: string;
  image: string;
};

function MagneticButton({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const springX = useSpring(x, { stiffness: 300, damping: 15 });
  const springY = useSpring(y, { stiffness: 300, damping: 15 });

  const handleMouse = (e: React.MouseEvent) => {
    const rect = ref.current?.getBoundingClientRect();
    if (!rect) return;
    const cx = rect.left + rect.width / 2;
    const cy = rect.top + rect.height / 2;
    x.set((e.clientX - cx) * 0.15);
    y.set((e.clientY - cy) * 0.15);
  };

  const reset = () => { x.set(0); y.set(0); };

  return (
    <motion.div
      ref={ref}
      onMouseMove={handleMouse}
      onMouseLeave={reset}
      style={{ x: springX, y: springY }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

const titleLetters = "Sunita Thapa".split("");

export default function Hero({ hero }: { hero: HeroData }) {
  const [cursorPos, setCursorPos] = useState({ x: 0.5, y: 0.5 });

  return (
    <section
      id="home"
      className="relative min-h-screen flex items-center px-6 md:px-16 lg:px-24 overflow-hidden bg-[#F9F9F7]"
      onMouseMove={(e) => {
        const rect = e.currentTarget.getBoundingClientRect();
        setCursorPos({ x: (e.clientX - rect.left) / rect.width, y: (e.clientY - rect.top) / rect.height });
      }}
    >
      {/* Mesh gradient background */}
      <div className="absolute inset-0 pointer-events-none">
        <motion.div
          animate={{ x: [0, 40, -20, 0], y: [0, -30, 20, 0] }}
          transition={{ duration: 20, repeat: Infinity, ease: "easeInOut" }}
          className="absolute top-[10%] right-[5%] w-[40rem] h-[40rem] rounded-full bg-[#8B5CF6]/10 blur-[120px]"
        />
        <motion.div
          animate={{ x: [0, -30, 20, 0], y: [0, 40, -20, 0] }}
          transition={{ duration: 25, repeat: Infinity, ease: "easeInOut" }}
          className="absolute bottom-[5%] left-[5%] w-[35rem] h-[35rem] rounded-full bg-[#14B8A6]/10 blur-[120px]"
        />
        <motion.div
          animate={{ x: [0, 20, -40, 0], y: [0, -20, 30, 0] }}
          transition={{ duration: 18, repeat: Infinity, ease: "easeInOut" }}
          className="absolute top-[40%] left-[50%] w-[25rem] h-[25rem] rounded-full bg-[#F59E0B]/8 blur-[100px]"
        />
      </div>

      {/* Glassmorphism floating shapes */}
      <motion.div
        animate={{ y: [0, -16, 0], rotate: [0, 3, 0] }}
        transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
        className="absolute top-[15%] right-[8%] w-32 h-32 rounded-2xl bg-white/40 backdrop-blur-xl border border-white/30 shadow-xl pointer-events-none hidden md:block"
        style={{ transform: `translate(${(cursorPos.x - 0.5) * 20}px, ${(cursorPos.y - 0.5) * 20}px)` }}
      />
      <motion.div
        animate={{ y: [0, 12, 0], rotate: [0, -2, 0] }}
        transition={{ duration: 10, repeat: Infinity, ease: "easeInOut", delay: 1 }}
        className="absolute bottom-[20%] left-[6%] w-24 h-24 rounded-2xl bg-white/30 backdrop-blur-xl border border-white/20 shadow-lg pointer-events-none hidden md:block"
        style={{ transform: `translate(${(cursorPos.x - 0.5) * -15}px, ${(cursorPos.y - 0.5) * -15}px)` }}
      />
      <motion.div
        animate={{ y: [0, -20, 0], rotate: [0, 5, 0] }}
        transition={{ duration: 12, repeat: Infinity, ease: "easeInOut", delay: 2 }}
        className="absolute top-[50%] right-[12%] w-20 h-20 rounded-full bg-white/20 backdrop-blur-xl border border-white/10 shadow-lg pointer-events-none hidden md:block"
        style={{ transform: `translate(${(cursorPos.x - 0.5) * 25}px, ${(cursorPos.y - 0.5) * -25}px)` }}
      />

      <div className="relative max-w-7xl mx-auto w-full">
        <div className="max-w-4xl">
          {/* Role label */}
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
            className="mb-6"
          >
            <span className="inline-block px-4 py-2 text-xs font-medium tracking-[0.15em] uppercase text-[#8B5CF6] bg-[#8B5CF6]/8 rounded-full border border-[#8B5CF6]/15">
              {hero.role}
            </span>
          </motion.div>

          {/* Kinetic typography — staggered letters */}
          <h1 className="overflow-hidden">
            <span className="flex flex-wrap">
              {titleLetters.map((letter, i) => (
                <motion.span
                  key={i}
                  initial={{ opacity: 0, y: 80, rotateX: -30 }}
                  animate={{ opacity: 1, y: 0, rotateX: 0 }}
                  transition={{
                    duration: 0.7,
                    delay: 0.1 + i * 0.04,
                    ease: [0.16, 1, 0.3, 1],
                  }}
                  className="inline-block text-[clamp(3rem,12vw,9rem)] font-serif leading-[0.88] tracking-tight text-[#1A1A1A]"
                  style={{
                    ...(letter === " " ? { width: "0.3em" } : {}),
                  }}
                >
                  {letter === " " ? "\u00A0" : letter}
                </motion.span>
              ))}
            </span>
          </h1>

          {/* Subtitle */}
          <motion.p
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.6, ease: [0.16, 1, 0.3, 1] }}
            className="mt-6 md:mt-8 text-base md:text-lg lg:text-xl text-[#1A1A1A]/50 max-w-xl leading-relaxed"
          >
            {hero.subtitle}
          </motion.p>

          {/* CTA buttons with magnetic hover */}
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.8 }}
            className="mt-10 flex flex-wrap items-center gap-5"
          >
            <MagneticButton>
              <a
                href="#work"
                className="group relative inline-flex items-center gap-2 px-8 py-4 bg-[#1A1A1A] text-white rounded-full text-sm font-medium tracking-wide overflow-hidden transition-all"
              >
                <span className="absolute inset-0 bg-[#8B5CF6] scale-x-0 group-hover:scale-x-100 origin-left transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)]" />
                <span className="relative z-10 flex items-center gap-2">
                  {hero.cta_primary}
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </span>
              </a>
            </MagneticButton>
            <MagneticButton>
              <a
                href="#contact"
                className="group inline-flex items-center gap-2 px-8 py-4 border border-[#1A1A1A]/15 text-[#1A1A1A]/60 rounded-full text-sm font-medium tracking-wide hover:bg-[#1A1A1A]/5 hover:border-[#1A1A1A]/30 transition-all"
              >
                {hero.cta_secondary}
              </a>
            </MagneticButton>
          </motion.div>

          {/* Location */}
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 1 }}
            className="mt-8 text-xs text-[#1A1A1A]/30 tracking-[0.15em] uppercase"
          >
            Based in {hero.location}
          </motion.p>
        </div>
      </div>
    </section>
  );
}
