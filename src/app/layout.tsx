export const dynamic = 'force-dynamic';

import type { Metadata } from "next";
import { Inter, Playfair_Display } from "next/font/google";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
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

function getNavLogo(): string {
  const filePath = path.join(process.cwd(), "content.json");
  const raw = fs.readFileSync(filePath, "utf-8");
  const content = JSON.parse(raw);
  return content.nav.logo;
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const logo = getNavLogo();

  return (
    <html lang="en" className={`${inter.variable} ${playfair.variable}`}>
      <body className="bg-[#F9F9F7] text-[#1A1A1A] font-sans antialiased">
        <Navbar logo={logo} />
        <main className="pt-16">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
