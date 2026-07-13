"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";

const NAV_LINKS = [
  { label: "Home", href: "/" },
  { label: "About", href: "/about" },
  { label: "Services", href: "/services" },
  { label: "Projects", href: "/projects" },
  { label: "Contact", href: "/contact" },
];

export default function Navbar({ logo }: { logo: string }) {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();

  const isActive = (href: string) => {
    if (href === "/") return pathname === "/";
    return pathname.startsWith(href);
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-md border-b border-gray-100/50">
      <nav className="flex items-center justify-between px-6 md:px-16 lg:px-24 h-16 max-w-7xl mx-auto">
        <Link
          href="/"
          className="text-sm font-bold tracking-[0.08em] uppercase text-[#1A1A1A] hover:text-[#8B5CF6] transition-colors"
        >
          {logo}
        </Link>

        {/* Desktop links */}
        <div className="hidden md:flex items-center gap-1">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={`relative px-4 py-2 text-xs tracking-[0.1em] uppercase rounded-lg transition-all ${
                isActive(link.href)
                  ? "text-[#8B5CF6]"
                  : "text-[#1A1A1A]/60 hover:text-[#1A1A1A] hover:bg-gray-50"
              }`}
            >
              {link.label}
              {isActive(link.href) && (
                <motion.span
                  layoutId="nav-active"
                  className="absolute inset-0 bg-[#8B5CF6]/5 rounded-lg border border-[#8B5CF6]/10"
                />
              )}
            </Link>
          ))}
        </div>

        {/* Mobile hamburger */}
        <button
          onClick={() => setOpen(true)}
          className="md:hidden relative w-10 h-10 flex flex-col items-center justify-center gap-1 rounded-lg hover:bg-gray-50 transition-colors"
          aria-label="Open menu"
        >
          <motion.span
            animate={open ? { rotate: 45, y: 4.5 } : { rotate: 0, y: 0 }}
            className="block w-5 h-0.5 bg-[#1A1A1A] origin-center"
          />
          <motion.span
            animate={open ? { opacity: 0 } : { opacity: 1 }}
            className="block w-5 h-0.5 bg-[#1A1A1A]"
          />
          <motion.span
            animate={open ? { rotate: -45, y: -4.5 } : { rotate: 0, y: 0 }}
            className="block w-5 h-0.5 bg-[#1A1A1A] origin-center"
          />
        </button>
      </nav>

      {/* Mobile slide-out menu */}
      <AnimatePresence>
        {open && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              onClick={() => setOpen(false)}
              className="fixed inset-0 bg-black/40 backdrop-blur-sm z-40 md:hidden"
            />
            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", damping: 28, stiffness: 250 }}
              className="fixed top-0 right-0 bottom-0 w-72 bg-white z-50 md:hidden shadow-2xl"
            >
              <div className="flex items-center justify-between px-6 h-16 border-b border-gray-100">
                <span className="text-sm font-bold tracking-[0.08em] uppercase text-[#1A1A1A]">
                  {logo}
                </span>
                <button
                  onClick={() => setOpen(false)}
                  className="w-10 h-10 flex items-center justify-center rounded-lg hover:bg-gray-100 transition-colors"
                  aria-label="Close menu"
                >
                  <svg className="w-5 h-5 text-[#1A1A1A]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                    <path d="M18 6 6 18M6 6l12 12" />
                  </svg>
                </button>
              </div>
              <nav className="p-6 space-y-2">
                {NAV_LINKS.map((link, i) => (
                  <motion.div
                    key={link.href}
                    initial={{ opacity: 0, x: 24 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.06, ease: [0.16, 1, 0.3, 1] }}
                  >
                    <Link
                      href={link.href}
                      onClick={() => setOpen(false)}
                      className={`block px-5 py-4 rounded-xl text-base font-medium transition-all ${
                        isActive(link.href)
                          ? "bg-[#8B5CF6]/10 text-[#8B5CF6]"
                          : "text-[#1A1A1A]/70 hover:bg-gray-50 hover:text-[#1A1A1A]"
                      }`}
                    >
                      {link.label}
                    </Link>
                  </motion.div>
                ))}
              </nav>

              <div className="absolute bottom-0 left-0 right-0 p-6 border-t border-gray-100">
                <p className="text-xs text-[#1A1A1A]/40 text-center">
                  &copy; {new Date().getFullYear()} Sunita Thapa
                </p>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </header>
  );
}
