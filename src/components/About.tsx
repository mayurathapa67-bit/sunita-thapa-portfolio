"use client";

import { motion } from "framer-motion";
import { Mail, Phone, MapPin } from "./icons";

type AboutData = {
  headline: string;
  bio: string;
  philosophy: string;
  image: string;
  stats: { number: string; label: string }[];
  education: { degree: string; school: string; year: string }[];
  certifications: { title: string; issuer: string; year: string }[];
  interests: string[];
  email: string;
  phone: string;
  location: string;
};

export default function About({ about }: { about: AboutData }) {
  return (
    <section id="about" className="px-6 md:px-16 lg:px-24 py-32 md:py-40 bg-white">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24 items-start">
          {/* Left: Image placeholder or decorative */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.6 }}
            className="relative aspect-[4/5] rounded-3xl overflow-hidden bg-gradient-to-br from-[#8B5CF6]/10 via-[#14B8A6]/5 to-[#8B5CF6]/10"
          >
            {about.image ? (
              <img
                src={about.image}
                alt="Sunita Thapa"
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="text-center">
                  <div className="w-24 h-24 rounded-full bg-[#8B5CF6]/20 flex items-center justify-center mx-auto mb-4">
                    <span className="text-4xl font-serif text-[#8B5CF6]/60">ST</span>
                  </div>
                  <p className="text-sm text-[#1A1A1A]/30">Your photo here</p>
                </div>
              </div>
            )}
            {/* Decorative ring */}
            <div className="absolute -bottom-6 -right-6 w-32 h-32 border border-[#8B5CF6]/10 rounded-full" />
            <div className="absolute -top-4 -left-4 w-20 h-20 border border-[#14B8A6]/10 rounded-full" />
          </motion.div>

          {/* Right: Content */}
          <div>
            <motion.p
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.5 }}
              className="text-xs tracking-[0.25em] uppercase text-[#8B5CF6] mb-6"
            >
              About Me
            </motion.p>
            <motion.h2
              initial={{ opacity: 0, y: 32 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
              className="text-3xl md:text-4xl lg:text-5xl font-serif leading-[1.15] text-[#1A1A1A]"
            >
              {about.headline}
            </motion.h2>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="mt-8 text-base md:text-lg leading-[1.8] text-[#1A1A1A]/70"
            >
              {about.bio}
            </motion.p>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="mt-6 text-base md:text-lg leading-[1.8] text-[#1A1A1A]/50 italic border-l-4 border-[#8B5CF6]/30 pl-6"
            >
              {about.philosophy}
            </motion.p>

            {/* Contact details */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="mt-10 space-y-3"
            >
              <a href={`mailto:${about.email}`} className="flex items-center gap-3 text-sm text-[#1A1A1A]/60 hover:text-[#8B5CF6] transition-colors group">
                <span className="w-8 h-8 rounded-lg bg-[#8B5CF6]/10 flex items-center justify-center text-[#8B5CF6] group-hover:bg-[#8B5CF6] group-hover:text-white transition-all">
                  <Mail className="w-4 h-4" />
                </span>
                {about.email}
              </a>
              <a href={`tel:${about.phone.replace(/\s/g, "")}`} className="flex items-center gap-3 text-sm text-[#1A1A1A]/60 hover:text-[#8B5CF6] transition-colors group">
                <span className="w-8 h-8 rounded-lg bg-[#14B8A6]/10 flex items-center justify-center text-[#14B8A6] group-hover:bg-[#14B8A6] group-hover:text-white transition-all">
                  <Phone className="w-4 h-4" />
                </span>
                {about.phone}
              </a>
              <div className="flex items-center gap-3 text-sm text-[#1A1A1A]/60">
                <span className="w-8 h-8 rounded-lg bg-[#1A1A1A]/5 flex items-center justify-center text-[#1A1A1A]/40">
                  <MapPin className="w-4 h-4" />
                </span>
                {about.location}
              </div>
            </motion.div>
          </div>
        </div>

        {/* Stats */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="mt-24 grid grid-cols-2 md:grid-cols-4 gap-8 pt-16 border-t border-[#1A1A1A]/10"
        >
          {about.stats.map((stat) => (
            <motion.div
              key={stat.label}
              whileHover={{ y: -4 }}
              className="text-center"
            >
              <p className="text-4xl md:text-5xl font-serif text-[#8B5CF6] mb-2">
                {stat.number}
              </p>
              <p className="text-xs text-[#1A1A1A]/50 tracking-wide uppercase">
                {stat.label}
              </p>
            </motion.div>
          ))}
        </motion.div>

        {/* Education */}
        {about.education && about.education.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.6, delay: 0.35 }}
            className="mt-20 pt-16 border-t border-[#1A1A1A]/10"
          >
            <p className="text-xs tracking-[0.25em] uppercase text-[#8B5CF6] mb-8">
              Education
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {about.education.map((edu) => (
                <div key={edu.degree} className="flex gap-4">
                  <div className="w-10 h-10 rounded-xl bg-[#8B5CF6]/10 flex items-center justify-center text-[#8B5CF6] shrink-0">
                    <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                      <path d="M22 10v6M2 10l10-5 10 5-10 5z" />
                      <path d="M6 12v5c3 3 9 3 12 0v-5" />
                    </svg>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-[#1A1A1A]">{edu.degree}</p>
                    <p className="text-xs text-[#1A1A1A]/50 mt-1">{edu.school} &middot; {edu.year}</p>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        )}

        {/* Certifications */}
        {about.certifications && about.certifications.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="mt-12 pt-12 border-t border-[#1A1A1A]/10"
          >
            <p className="text-xs tracking-[0.25em] uppercase text-[#14B8A6] mb-8">
              Certifications
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {about.certifications.map((cert) => (
                <div key={cert.title} className="flex gap-4">
                  <div className="w-10 h-10 rounded-xl bg-[#14B8A6]/10 flex items-center justify-center text-[#14B8A6] shrink-0">
                    <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                      <path d="M12 15a3 3 0 1 0 0-6 3 3 0 0 0 0 6Z" />
                      <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1Z" />
                    </svg>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-[#1A1A1A]">{cert.title}</p>
                    <p className="text-xs text-[#1A1A1A]/50 mt-1">{cert.issuer} &middot; {cert.year}</p>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        )}

        {/* Interests */}
        {about.interests && about.interests.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.6, delay: 0.45 }}
            className="mt-12 pt-12 border-t border-[#1A1A1A]/10"
          >
            <p className="text-xs tracking-[0.25em] uppercase text-[#1A1A1A]/40 mb-6">
              Personal Interests
            </p>
            <div className="flex flex-wrap gap-3">
              {about.interests.map((interest) => (
                <span
                  key={interest}
                  className="px-4 py-2 bg-white rounded-full text-xs text-[#1A1A1A]/60 border border-gray-100 shadow-sm"
                >
                  {interest}
                </span>
              ))}
            </div>
          </motion.div>
        )}
      </div>
    </section>
  );
}
