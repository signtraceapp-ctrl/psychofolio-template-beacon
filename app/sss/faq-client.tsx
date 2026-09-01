"use client";

import { useState } from "react";
import {
  BEACON,
  BeaconShell,
  useBeaconReveal,
} from "@/components/beacon-shared";
import type { SiteContent } from "@/lib/content";

export function FaqClient({ content: c }: { content: SiteContent }) {
  const scopeRef = useBeaconReveal();
  const [open, setOpen] = useState<number | null>(0);

  return (
    <BeaconShell
      kicker="SSS"
      title="İşaret"
      accent="sancakları"
      scopeRef={scopeRef}
      siteName={c.site.name}
    >
      <section className="relative z-[1] pb-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-2xl space-y-4">
            {c.faq.map((f, i) => (
              <div
                key={i}
                data-reveal
                className="overflow-hidden rounded-xl border ring-1 ring-inset ring-white/[0.04] transition-shadow duration-300 hover:shadow-[0_0_20px_rgba(255,217,138,0.08)]"
                style={{
                  background: `${BEACON.panel}cc`,
                  borderColor: open === i ? `${BEACON.beam}55` : `${BEACON.beam}1f`,
                }}
              >
                <button
                  className="flex w-full items-center gap-4 px-6 py-5 text-left"
                  onClick={() => setOpen(open === i ? null : i)}
                  aria-expanded={open === i}
                >
                  <svg width="18" height="22" viewBox="0 0 18 22" fill="none" className="shrink-0" aria-hidden="true">
                    <line x1="3" y1="2" x2="3" y2="20" stroke={BEACON.muted} strokeWidth="1.6" />
                    <path
                      d={open === i ? "M3 3 L16 6.5 L3 10 Z" : "M3 8 L12 10.5 L3 13 Z"}
                      fill={open === i ? BEACON.beam : `${BEACON.muted}88`}
                      className="transition-[fill] duration-300"
                    />
                  </svg>
                  <span className="flex-1 text-lg leading-snug" style={{ fontFamily: "var(--font-beacon), serif" }}>
                    {f.q}
                  </span>
                </button>
                <div
                  className={`grid transition-[grid-template-rows,opacity] duration-300 ${
                    open === i ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"
                  }`}
                >
                  <div className="overflow-hidden">
                    <p className="px-6 pb-5 pl-[58px] text-sm leading-relaxed" style={{ color: BEACON.muted }}>
                      {f.a}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </BeaconShell>
  );
}
