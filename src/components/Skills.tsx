"use client";

import { motion } from "framer-motion";
import { Monitor, Search, Layers, Grid } from "./icons";

type Category = {
  title: string;
  icon: string;
  items: string[];
};

type Tool = {
  name: string;
  level: number;
};

type SkillsData = {
  categories: Category[];
  tools: Tool[];
};

const iconMap: Record<string, React.ElementType> = {
  monitor: Monitor,
  search: Search,
  layers: Layers,
  grid: Grid,
};

const toolColors = [
  "from-[#8B5CF6] to-[#A78BFA]",
  "from-[#14B8A6] to-[#2DD4BF]",
  "from-[#F59E0B] to-[#FBBF24]",
  "from-[#EF4444] to-[#F87171]",
  "from-[#3B82F6] to-[#60A5FA]",
  "from-[#EC4899] to-[#F472B6]",
];

export default function Skills({ skills }: { skills: SkillsData }) {
  return (
    <section id="skills" className="px-6 md:px-16 lg:px-24 py-32 md:py-40 bg-[#F9F9F7]">
      <div className="max-w-7xl mx-auto">
        <motion.p
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.5 }}
          className="text-xs tracking-[0.25em] uppercase text-[#8B5CF6] mb-6 text-center"
        >
          Expertise
        </motion.p>
        <motion.h2
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          className="text-3xl md:text-5xl font-serif text-center text-[#1A1A1A]"
        >
          Skills & Tools
        </motion.h2>

        {/* Categories Grid */}
        <div className="mt-16 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {skills.categories.map((cat, i) => {
            const Icon = iconMap[cat.icon] || Monitor;
            return (
              <motion.div
                key={cat.title}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
                whileHover={{ y: -6 }}
                className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100 hover:shadow-md hover:border-[#8B5CF6]/20 transition-all"
              >
                <div className="w-10 h-10 rounded-xl bg-[#8B5CF6]/10 flex items-center justify-center text-[#8B5CF6] mb-4">
                  <Icon className="w-5 h-5" />
                </div>
                <h3 className="text-base font-serif text-[#1A1A1A] mb-3">
                  {cat.title}
                </h3>
                <ul className="space-y-1.5">
                  {cat.items.map((item) => (
                    <li
                      key={item}
                      className="text-sm text-[#1A1A1A]/70 flex items-center gap-2"
                    >
                      <span className="w-1 h-1 rounded-full bg-[#8B5CF6]/40" />
                      {item}
                    </li>
                  ))}
                </ul>
              </motion.div>
            );
          })}
        </div>

        {/* Tool bars */}
        <div className="mt-20 max-w-3xl mx-auto space-y-5">
          {skills.tools.map((tool, i) => (
            <motion.div
              key={tool.name}
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.4, delay: i * 0.08 }}
            >
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm font-medium text-[#1A1A1A]">
                  {tool.name}
                </span>
                <span className="text-xs text-[#1A1A1A]/60">{tool.level}%</span>
              </div>
              <div className="h-2.5 bg-gray-100 rounded-full overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  whileInView={{ width: `${tool.level}%` }}
                  viewport={{ once: true }}
                  transition={{
                    duration: 1,
                    delay: 0.15 + i * 0.08,
                    ease: [0.16, 1, 0.3, 1],
                  }}
                  className={`h-full rounded-full bg-gradient-to-r ${toolColors[i % toolColors.length]}`}
                />
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
