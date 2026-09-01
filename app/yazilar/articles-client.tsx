"use client";

import { useState } from "react";
import {
  BEACON,
  BeaconCard,
  BeaconShell,
  useBeaconReveal,
} from "@/components/beacon-shared";
import type { SiteContent } from "@/lib/content";

export function ArticlesClient({ content: c }: { content: SiteContent }) {
  const scopeRef = useBeaconReveal();

  /* Build category list from content */
  const categories = ["Tümü", ...Array.from(new Set(c.articles.map((a) => a.category).filter(Boolean)))];
  const [cat, setCat] = useState("Tümü");
  const filtered = c.articles.filter((a) => cat === "Tümü" || a.category === cat);

  return (
    <BeaconShell
      kicker="Yazılar"
      title="Seyir"
      accent="notları"
      scopeRef={scopeRef}
      siteName={c.site.name}
    >
      <section className="relative z-[1] pb-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div data-reveal className="mb-12 flex flex-wrap justify-center gap-2">
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => setCat(category)}
                className="rounded-full border px-4 py-1.5 text-xs tracking-[0.12em] transition-colors duration-300"
                style={{
                  borderColor: cat === category ? BEACON.beam : `${BEACON.text}22`,
                  background: cat === category ? `${BEACON.beam}1a` : "transparent",
                  color: cat === category ? BEACON.beam : BEACON.muted,
                }}
              >
                {category.toUpperCase()}
              </button>
            ))}
          </div>

          <div className="mx-auto grid max-w-5xl gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {filtered.map((a, i) => (
              <BeaconCard key={i} data-reveal className="group flex flex-col p-7">
                <p className="text-[10px] tracking-[0.3em]" style={{ color: BEACON.glass }}>
                  {a.category.toUpperCase()} &middot; {a.readTime}
                </p>
                <h3 className="mt-3 text-xl leading-snug transition-colors duration-300 group-hover:text-[#ffd98a]">
                  {a.title}
                </h3>
                {a.date && (
                  <p className="mt-2 text-xs" style={{ color: `${BEACON.muted}88` }}>{a.date}</p>
                )}
                <span
                  className="mt-5 inline-flex items-center gap-2 text-xs tracking-[0.16em]"
                  style={{ color: BEACON.beam }}
                >
                  <span
                    className="h-1.5 w-1.5 rounded-full"
                    style={{ background: BEACON.beam, boxShadow: `0 0 8px ${BEACON.beam}` }}
                    aria-hidden="true"
                  />
                  OKU
                </span>
              </BeaconCard>
            ))}
          </div>
        </div>
      </section>
    </BeaconShell>
  );
}
