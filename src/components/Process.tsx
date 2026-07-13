"use client";

import { motion } from "framer-motion";

type Phase = {
  phase: string;
  number: string;
  title: string;
  description: string;
  color: string;
};

export default function Process({ process }: { process: Phase[] }) {
  return (
    <section id="process" className="px-6 md:px-16 lg:px-24 py-32 md:py-40 bg-white">
      <div className="max-w-7xl mx-auto">
        <motion.p
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.5 }}
          className="text-xs tracking-[0.25em] uppercase text-[#8B5CF6] mb-6"
        >
          Methodology
        </motion.p>
        <motion.h2
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          className="text-3xl md:text-5xl lg:text-6xl font-serif text-[#1A1A1A]"
        >
          Design Process
        </motion.h2>

        <div className="mt-20 relative">
          {/* Timeline line (desktop) */}
          <div className="hidden lg:block absolute left-[52px] top-0 bottom-0 w-0.5 bg-gradient-to-b from-[#8B5CF6] via-[#14B8A6] via-[#F59E0B] via-[#EF4444] to-[#10B981] opacity-30" />

          {/* Connected horizontal line (mobile) */}
          <div className="lg:hidden absolute left-[18px] top-0 bottom-0 w-0.5 bg-gradient-to-b from-[#8B5CF6] via-[#14B8A6] via-[#F59E0B] via-[#EF4444] to-[#10B981] opacity-30" />

          <div className="space-y-12 md:space-y-16">
            {process.map((phase, i) => (
              <motion.div
                key={phase.phase}
                initial={{ opacity: 0, x: -30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ duration: 0.5, delay: i * 0.12 }}
                className="relative flex gap-6 lg:gap-10"
              >
                {/* Number circle */}
                <div className="relative z-10 shrink-0">
                  <div
                    className="w-9 h-9 lg:w-[52px] lg:h-[52px] rounded-full flex items-center justify-center shadow-md"
                    style={{ backgroundColor: phase.color }}
                  >
                    <span className="text-xs lg:text-sm font-bold text-white">
                      {phase.number}
                    </span>
                  </div>
                </div>

                {/* Content card */}
                <div className="flex-1 bg-[#F9F9F7] rounded-3xl p-6 lg:p-10 border border-gray-100 hover:shadow-md transition-shadow">
                  <span
                    className="text-[10px] lg:text-xs tracking-[0.2em] uppercase font-medium"
                    style={{ color: phase.color }}
                  >
                    {phase.phase}
                  </span>
                  <h3 className="text-xl lg:text-2xl font-serif text-[#1A1A1A] mt-2 mb-4">
                    {phase.title}
                  </h3>
                  <p className="text-sm lg:text-base text-[#1A1A1A]/60 leading-relaxed max-w-3xl">
                    {phase.description}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
