"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Mail, Phone, MapPin } from "./icons";

type ContactData = {
  email: string;
  phone: string;
  location: string;
  socials: { platform: string; url: string; icon: string }[];
  cta: string;
};

const socialColors: Record<string, string> = {
  LinkedIn: "hover:bg-[#0A66C2] hover:border-[#0A66C2] hover:text-white",
  Dribbble: "hover:bg-[#EA4C89] hover:border-[#EA4C89] hover:text-white",
  Behance: "hover:bg-[#1769FF] hover:border-[#1769FF] hover:text-white",
};

export default function Contact({ contact }: { contact: ContactData }) {
  const [form, setForm] = useState({ name: "", email: "", message: "" });
  const [status, setStatus] = useState<"idle" | "sending" | "sent" | "error">(
    "idle"
  );

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus("sending");
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      if (res.ok) {
        setStatus("sent");
        setForm({ name: "", email: "", message: "" });
      } else {
        setStatus("error");
      }
    } catch {
      setStatus("error");
    }
  };

  return (
    <section
      id="contact"
      className="px-6 md:px-16 lg:px-24 py-32 md:py-40 bg-white"
    >
      <div className="max-w-7xl mx-auto">
        <motion.p
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.5 }}
          className="text-xs tracking-[0.25em] uppercase text-[#8B5CF6] mb-6"
        >
          Get in Touch
        </motion.p>
        <motion.h2
          initial={{ opacity: 0, y: 32 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          className="text-3xl md:text-5xl lg:text-6xl font-serif leading-[1.1] text-[#1A1A1A]"
        >
          {contact.cta}
        </motion.h2>

        <div className="mt-16 grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24">
          {/* Contact Info */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.6, delay: 0.15 }}
            className="space-y-6"
          >
            <div className="flex items-center gap-4 group">
              <span className="w-12 h-12 rounded-xl bg-[#8B5CF6]/10 flex items-center justify-center text-[#8B5CF6] group-hover:bg-[#8B5CF6] group-hover:text-white transition-all">
                <Mail className="w-5 h-5" />
              </span>
              <div>
                <p className="text-xs text-[#1A1A1A]/60 uppercase tracking-wider">
                  Email
                </p>
                <a
                  href={`mailto:${contact.email}`}
                  className="text-sm md:text-base text-[#1A1A1A] hover:text-[#8B5CF6] transition-colors"
                >
                  {contact.email}
                </a>
              </div>
            </div>
            <div className="flex items-center gap-4 group">
              <span className="w-12 h-12 rounded-xl bg-[#14B8A6]/10 flex items-center justify-center text-[#14B8A6] group-hover:bg-[#14B8A6] group-hover:text-white transition-all">
                <Phone className="w-5 h-5" />
              </span>
              <div>
                <p className="text-xs text-[#1A1A1A]/60 uppercase tracking-wider">
                  Phone
                </p>
                <a
                  href={`tel:${contact.phone.replace(/\s/g, "")}`}
                  className="text-sm md:text-base text-[#1A1A1A] hover:text-[#8B5CF6] transition-colors"
                >
                  {contact.phone}
                </a>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <span className="w-12 h-12 rounded-xl bg-gray-100 flex items-center justify-center text-gray-600">
                <MapPin className="w-5 h-5" />
              </span>
              <div>
                <p className="text-xs text-[#1A1A1A]/60 uppercase tracking-wider">
                  Location
                </p>
                <p className="text-sm md:text-base text-[#1A1A1A]">
                  {contact.location}
                </p>
              </div>
            </div>

            {/* Social links */}
            <div className="flex flex-wrap gap-3 pt-4">
              {contact.socials.map((s) => (
                <a
                  key={s.platform}
                  href={s.url}
                  className={`px-5 py-2.5 rounded-full border border-gray-200 text-sm text-[#1A1A1A]/80 transition-all ${socialColors[s.platform] || "hover:bg-[#1A1A1A] hover:text-white hover:border-[#1A1A1A]"}`}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {s.platform}
                </a>
              ))}
            </div>
          </motion.div>

          {/* Contact Form */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="bg-[#F9F9F7] rounded-3xl p-8 md:p-12 border border-gray-100"
          >
            {status === "sent" ? (
              <div className="text-center py-12">
                <div className="w-16 h-16 rounded-full bg-[#10B981]/10 flex items-center justify-center mx-auto mb-4">
                  <svg className="w-8 h-8 text-[#10B981]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <polyline points="20 6 9 17 4 12" />
                  </svg>
                </div>
                <p className="text-lg font-serif text-[#1A1A1A] mb-2">
                  Message sent!
                </p>
                <p className="text-sm text-[#1A1A1A]/70">
                  Thank you for reaching out. I&apos;ll get back to you soon.
                </p>
                <button
                  onClick={() => setStatus("idle")}
                  className="mt-6 text-sm text-[#8B5CF6] hover:underline"
                >
                  Send another message
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-5">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <div>
                    <label
                      htmlFor="contact-name"
                      className="block text-xs font-medium text-[#1A1A1A]/70 uppercase tracking-wider mb-2"
                    >
                      Name
                    </label>
                    <input
                      id="contact-name"
                      type="text"
                      required
                      value={form.name}
                      onChange={(e) =>
                        setForm({ ...form, name: e.target.value })
                      }
                      placeholder="Your name"
                      className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-white text-sm text-[#1A1A1A] placeholder:text-[#1A1A1A]/50 focus:outline-none focus:ring-2 focus:ring-[#8B5CF6]/30 focus:border-[#8B5CF6] transition-all"
                    />
                  </div>
                  <div>
                    <label
                      htmlFor="contact-email"
                      className="block text-xs font-medium text-[#1A1A1A]/70 uppercase tracking-wider mb-2"
                    >
                      Email
                    </label>
                    <input
                      id="contact-email"
                      type="email"
                      required
                      value={form.email}
                      onChange={(e) =>
                        setForm({ ...form, email: e.target.value })
                      }
                      placeholder="your@email.com"
                      className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-white text-sm text-[#1A1A1A] placeholder:text-[#1A1A1A]/50 focus:outline-none focus:ring-2 focus:ring-[#8B5CF6]/30 focus:border-[#8B5CF6] transition-all"
                    />
                  </div>
                </div>
                <div>
                  <label
                    htmlFor="contact-message"
                      className="block text-xs font-medium text-[#1A1A1A]/70 uppercase tracking-wider mb-2"
                    >
                      Message
                  </label>
                  <textarea
                    id="contact-message"
                    rows={5}
                    required
                    value={form.message}
                    onChange={(e) =>
                      setForm({ ...form, message: e.target.value })
                    }
                    placeholder="Tell me about your project..."
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-white text-sm text-[#1A1A1A] placeholder:text-[#1A1A1A]/50 focus:outline-none focus:ring-2 focus:ring-[#8B5CF6]/30 focus:border-[#8B5CF6] transition-all resize-none"
                  />
                </div>
                <button
                  type="submit"
                  disabled={status === "sending"}
                  className="w-full px-8 py-4 bg-[#8B5CF6] text-white rounded-full text-sm font-medium tracking-wide hover:bg-[#7C3AED] disabled:opacity-50 transition-all"
                >
                  {status === "sending" ? "Sending..." : "Send Message"}
                </button>
                {status === "error" && (
                  <p className="text-sm text-red-500 text-center">
                    Something went wrong. Please try again.
                  </p>
                )}
              </form>
            )}
          </motion.div>
        </div>
      </div>
    </section>
  );
}
