import type { Metadata } from "next";
import { Inter, Bitter } from "next/font/google";
import { getContent } from "@/lib/content";
import "./globals.css";

const inter = Inter({
  subsets: ["latin", "latin-ext"],
  display: "swap",
  variable: "--font-sans",
});

const bitter = Bitter({
  subsets: ["latin", "latin-ext"],
  display: "swap",
  variable: "--font-display",
  weight: ["300", "400", "500", "600", "700"],
});

export function generateMetadata(): Metadata {
  const c = getContent();
  return {
    title: { default: `${c.site.name} - ${c.site.title}`, template: `%s | ${c.site.name}` },
    description: c.home.description,
    robots: { index: false, follow: false },
  };
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="tr" className={`${inter.variable} ${bitter.variable}`}>
      <body className="min-h-screen bg-[#0b1626] text-[#e9eef4] antialiased selection:bg-[#ffd98a]/25">
        {children}
      </body>
    </html>
  );
}
