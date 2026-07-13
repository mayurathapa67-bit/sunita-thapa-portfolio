import type { Metadata } from "next";
import { Inter, Playfair_Display } from "next/font/google";
import Link from "next/link";
import fs from "fs";
import path from "path";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const playfair = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-playfair",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Sunita Thapa — UI/UX Designer & Design Strategist",
  description:
    "Portfolio of Sunita Thapa, a UI/UX Designer crafting intuitive digital experiences through research-driven design.",
};

type NavData = {
  logo: string;
  links: { label: string; href: string }[];
};

function getNavData(): NavData {
  const filePath = path.join(process.cwd(), "content.json");
  const raw = fs.readFileSync(filePath, "utf-8");
  const content = JSON.parse(raw);
  return content.nav;
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const nav = getNavData();

  return (
    <html lang="en" className={`${inter.variable} ${playfair.variable}`}>
      <body className="bg-[#F9F9F7] text-[#1A1A1A] font-sans antialiased">
        <header className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-lg border-b border-gray-100">
          <nav className="flex items-center justify-between px-6 md:px-16 lg:px-24 h-16 max-w-7xl mx-auto">
            <Link
              href="/"
              className="text-sm font-bold tracking-[0.08em] uppercase text-[#1A1A1A]"
            >
              {nav.logo}
            </Link>
            <div className="hidden md:flex items-center gap-8">
              {nav.links.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="text-xs tracking-[0.1em] uppercase text-[#1A1A1A]/50 hover:text-[#8B5CF6] transition-colors"
                >
                  {link.label}
                </Link>
              ))}
            </div>
          </nav>
        </header>
        <main>{children}</main>
        <footer className="px-6 md:px-16 lg:px-24 py-12 border-t border-gray-100">
          <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
            <p className="text-sm text-[#1A1A1A]/40">
              &copy; {new Date().getFullYear()} Sunita Thapa. All rights reserved.
            </p>
            <div className="flex items-center gap-6">
              <a
                href="https://linkedin.com/in/sunita-thapa"
                target="_blank"
                rel="noopener noreferrer"
                className="text-xs text-[#1A1A1A]/40 hover:text-[#8B5CF6] transition-colors"
              >
                LinkedIn
              </a>
              <a
                href="https://dribbble.com/sunita-thapa"
                target="_blank"
                rel="noopener noreferrer"
                className="text-xs text-[#1A1A1A]/40 hover:text-[#8B5CF6] transition-colors"
              >
                Dribbble
              </a>
              <a
                href="https://behance.net/sunita-thapa"
                target="_blank"
                rel="noopener noreferrer"
                className="text-xs text-[#1A1A1A]/40 hover:text-[#8B5CF6] transition-colors"
              >
                Behance
              </a>
            </div>
          </div>
        </footer>
      </body>
    </html>
  );
}
