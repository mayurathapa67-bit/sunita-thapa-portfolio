"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Quote, Star } from "./icons";

type Testimonial = {
  quote: string;
  name: string;
  role: string;
  company: string;
  avatar: string;
  rating: number;
};

export default function Testimonials({
  testimonials,
}: {
  testimonials: Testimonial[];
}) {
  const [active, setActive] = useState(0);

  return (
    <section className="px-6 md:px-16 lg:px-24 py-32 md:py-40 bg-[#F9F9F7]">
      <div className="max-w-7xl mx-auto">
        <motion.p
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.5 }}
          className="text-xs tracking-[0.25em] uppercase text-[#8B5CF6] mb-6 text-center"
        >
          Testimonials
        </motion.p>
        <motion.h2
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          className="text-3xl md:text-5xl font-serif text-center text-[#1A1A1A]"
        >
          What Clients Say
        </motion.h2>

        <div className="mt-16 max-w-4xl mx-auto">
          <div className="relative bg-white rounded-3xl p-8 md:p-12 lg:p-16 shadow-sm border border-gray-100">
            {/* Quote icon */}
            <div className="absolute top-6 md:top-10 left-6 md:left-10 text-[#8B5CF6]/10">
              <Quote className="w-10 h-10 md:w-14 md:h-14" />
            </div>

            <div className="relative">
              <AnimatePresence mode="wait">
                <motion.div
                  key={active}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.4 }}
                >
                  {/* Stars */}
                  <div className="flex gap-1 mb-6">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Star
                        key={i}
                        className={`w-4 h-4 ${
                          i < testimonials[active].rating
                            ? "text-[#F59E0B]"
                            : "text-gray-200"
                        }`}
                      />
                    ))}
                  </div>

                  <p className="text-base md:text-lg lg:text-xl text-[#1A1A1A]/75 leading-relaxed italic mb-8">
                    &ldquo;{testimonials[active].quote}&rdquo;
                  </p>

                  <div className="flex items-center gap-4">
                    {testimonials[active].avatar ? (
                      <img
                        src={testimonials[active].avatar}
                        alt={testimonials[active].name}
                        className="w-12 h-12 rounded-full object-cover"
                      />
                    ) : (
                      <div className="w-12 h-12 rounded-full bg-gradient-to-br from-[#8B5CF6] to-[#7C3AED] flex items-center justify-center text-white text-sm font-bold">
                        {testimonials[active].name
                          .split(" ")
                          .map((n) => n[0])
                          .join("")}
                      </div>
                    )}
                    <div>
                      <p className="text-sm font-semibold text-[#1A1A1A]">
                        {testimonials[active].name}
                      </p>
                      <p className="text-xs text-[#1A1A1A]/50">
                        {testimonials[active].role},{" "}
                        {testimonials[active].company}
                      </p>
                    </div>
                  </div>
                </motion.div>
              </AnimatePresence>
            </div>
          </div>

          {/* Navigation dots */}
          <div className="flex justify-center gap-3 mt-8">
            {testimonials.map((_, i) => (
              <button
                key={i}
                onClick={() => setActive(i)}
                className={`h-2.5 rounded-full transition-all duration-300 ${
                  i === active
                    ? "bg-[#8B5CF6] w-8"
                    : "bg-gray-200 w-2.5 hover:bg-gray-300"
                }`}
                aria-label={`Go to testimonial ${i + 1}`}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
