"use client";

import { motion } from "framer-motion";
import { Monitor, Search, Layout, Layers, Grid, Palette, Smartphone } from "./icons";

type Service = {
  title: string;
  description: string;
  icon: string;
};

const iconMap: Record<string, React.ElementType> = {
  monitor: Monitor,
  search: Search,
  layout: Layout,
  layers: Layers,
  grid: Grid,
  palette: Palette,
  smartphone: Smartphone,
};

export default function Services({ services }: { services: Service[] }) {
  return (
    <section id="services" className="px-6 md:px-16 lg:px-24 py-32 md:py-40 bg-white">
      <div className="max-w-7xl mx-auto">
        <motion.p
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.5 }}
          className="text-xs tracking-[0.25em] uppercase text-[#8B5CF6] mb-6 text-center"
        >
          What I Do
        </motion.p>
        <motion.h2
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          className="text-3xl md:text-5xl font-serif text-center text-[#1A1A1A]"
        >
          Services
        </motion.h2>
        <div className="mt-16 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
          {services.map((service, i) => {
            const Icon = iconMap[service.icon] || Monitor;
            return (
              <motion.div
                key={service.title}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ duration: 0.5, delay: i * 0.08 }}
                whileHover={{ y: -6 }}
                className="group p-8 bg-[#F9F9F7] rounded-3xl border border-gray-100 hover:border-[#8B5CF6]/20 hover:shadow-lg transition-all duration-500"
              >
                <div className="w-12 h-12 rounded-xl bg-[#8B5CF6]/10 flex items-center justify-center text-[#8B5CF6] mb-6 group-hover:bg-[#8B5CF6] group-hover:text-white transition-all duration-500">
                  <Icon />
                </div>
                <h3 className="text-xl font-serif text-[#1A1A1A] mb-3">
                  {service.title}
                </h3>
                <p className="text-sm text-[#1A1A1A]/60 leading-relaxed">
                  {service.description}
                </p>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
