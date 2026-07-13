"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowRight } from "./icons";

type Project = {
  title: string;
  category: string;
  description: string;
  tools: string[];
  image: string;
  link: string;
  year: number;
  featured: boolean;
};

const categories = ["All", "Mobile", "Web", "Dashboard"];

const categoryAccents: Record<string, string> = {
  Mobile: "#8B5CF6",
  Web: "#14B8A6",
  Dashboard: "#F59E0B",
};

const bentoLayouts = [
  "md:col-span-2 md:row-span-2",
  "md:col-span-1 md:row-span-1",
  "md:col-span-1 md:row-span-2",
  "md:col-span-1 md:row-span-1",
  "md:col-span-1 md:row-span-1",
  "md:col-span-2 md:row-span-1",
];

export default function Projects({ projects }: { projects: Project[] }) {
  const [filter, setFilter] = useState("All");

  const filtered =
    filter === "All"
      ? projects
      : projects.filter((p) => p.category === filter);

  return (
    <section
      id="work"
      className="px-6 md:px-16 lg:px-24 py-32 md:py-40 bg-white"
    >
      <div className="max-w-7xl mx-auto">
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
          className="text-xs tracking-[0.25em] uppercase text-[#8B5CF6] mb-6"
        >
          Portfolio
        </motion.p>
        <motion.h2
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          className="text-3xl md:text-5xl lg:text-6xl font-serif text-[#1A1A1A]"
        >
          Selected Work
        </motion.h2>

        {/* Filter pills */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="mt-10 flex flex-wrap gap-2"
        >
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setFilter(cat)}
              className={`px-5 py-2.5 rounded-full text-xs font-medium tracking-wide transition-all ${
                filter === cat
                  ? "bg-[#1A1A1A] text-white"
                  : "bg-gray-50 text-[#1A1A1A]/50 hover:bg-gray-100"
              }`}
              aria-pressed={filter === cat}
            >
              {cat}
            </button>
          ))}
        </motion.div>

        {/* Bento Grid */}
        <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6 auto-rows-[300px]">
          <AnimatePresence mode="popLayout">
            {filtered.map((project, i) => {
              const layout = bentoLayouts[i % bentoLayouts.length];
              const accent = categoryAccents[project.category] || "#8B5CF6";

              return (
                <motion.a
                  key={project.title}
                  href={project.link}
                  layout
                  initial={{ opacity: 0, scale: 0.95, y: 20 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95, y: 20 }}
                  transition={{ duration: 0.5, delay: i * 0.05, ease: [0.16, 1, 0.3, 1] }}
                  className={`group relative ${layout} rounded-3xl overflow-hidden bg-gray-50`}
                >
                  {/* Thumbnail layer */}
                  {project.image ? (
                    <motion.img
                      src={project.image}
                      alt={project.title}
                      className="absolute inset-0 w-full h-full object-cover"
                      initial={{ scale: 1 }}
                      whileHover={{ scale: 1.05 }}
                      transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
                    />
                  ) : (
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div
                        className="absolute inset-0 opacity-[0.07]"
                        style={{
                          background: `radial-gradient(circle at 30% 40%, ${accent} 0%, transparent 70%)`,
                        }}
                      />
                      <motion.div
                        className="w-32 h-32 rounded-[2rem]"
                        style={{ backgroundColor: accent + "20" }}
                        initial={{ rotate: 0 }}
                        whileHover={{ rotate: 45, scale: 1.2 }}
                        transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
                      />
                    </div>
                  )}

                  {/* Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-[#1A1A1A] via-[#1A1A1A]/20 to-transparent opacity-0 group-hover:opacity-100 transition-all duration-500" />

                  {/* Content — always visible bottom, full on hover */}
                  <div className="absolute inset-0 p-6 md:p-8 flex flex-col justify-end">
                    {/* Hover-only content */}
                    <div className="translate-y-4 group-hover:translate-y-0 opacity-0 group-hover:opacity-100 transition-all duration-500 delay-75">
                      <p className="text-sm text-white/70 leading-relaxed line-clamp-3 mb-4">
                        {project.description}
                      </p>
                      <div className="flex flex-wrap gap-2 mb-4">
                        {project.tools.map((tool) => (
                          <span
                            key={tool}
                            className="px-3 py-1 bg-white/10 backdrop-blur-sm rounded-full text-xs text-white/80"
                          >
                            {tool}
                          </span>
                        ))}
                      </div>
                      <span className="inline-flex items-center gap-2 text-xs font-medium text-white/90 tracking-wide group-hover:gap-3 transition-all">
                        View Case Study <ArrowRight className="w-3.5 h-3.5" />
                      </span>
                    </div>

                    {/* Always-visible header */}
                    <div className="flex items-center gap-3 mb-2">
                      <span
                        className="px-3 py-1 rounded-full text-[10px] font-medium text-white tracking-wide"
                        style={{ backgroundColor: accent }}
                      >
                        {project.category}
                      </span>
                      <span className="text-[10px] text-white/50">{project.year}</span>
                    </div>
                    <h3 className="text-xl md:text-2xl font-serif text-white">
                      {project.title}
                    </h3>
                  </div>
                </motion.a>
              );
            })}
          </AnimatePresence>
        </div>
      </div>
    </section>
  );
}
