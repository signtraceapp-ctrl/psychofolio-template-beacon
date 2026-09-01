"use client";

import {
  BEACON,
  BeaconCard,
  BeaconShell,
  useBeaconReveal,
} from "@/components/beacon-shared";
import type { SiteContent } from "@/lib/content";

/* Fener karakterleri animasyonlari */
const CHAR_ANIMS = [
  { char: "Fl 6s", charDesc: "yavas ve derin", anim: "beaconFl0", dur: "6s" },
  { char: "Iso 8s", charDesc: "esit aralikli", anim: "beaconFl1", dur: "8s" },
  { char: "Fl(2) 6s", charDesc: "cift cakis", anim: "beaconFl2", dur: "6s" },
  { char: "Q 3s", charDesc: "sik ritim", anim: "beaconFl3", dur: "3s" },
  { char: "LFl 10s", charDesc: "uzun cakis", anim: "beaconFl4", dur: "10s" },
  { char: "Al 5s", charDesc: "donusumlu", anim: "beaconFl5", dur: "5s" },
];

export function ServicesClient({ content: c }: { content: SiteContent }) {
  const scopeRef = useBeaconReveal();

  return (
    <BeaconShell
      kicker="Hizmetler"
      title="Her fenerin kendi"
      accent="ritmi vardir"
      scopeRef={scopeRef}
      siteName={c.site.name}
    >
      <style>{`
        @keyframes beaconFl0 {0%,4%{opacity:1}8%,100%{opacity:0.15}}
        @keyframes beaconFl1 {0%,45%{opacity:1}50%,95%{opacity:0.15}100%{opacity:1}}
        @keyframes beaconFl2 {0%,4%{opacity:1}8%,12%{opacity:0.15}16%,20%{opacity:1}24%,100%{opacity:0.15}}
        @keyframes beaconFl3 {0%,30%{opacity:1}50%,80%{opacity:0.15}100%{opacity:1}}
        @keyframes beaconFl4 {0%,22%{opacity:1}30%,100%{opacity:0.15}}
        @keyframes beaconFl5 {0%,40%{opacity:1}50%,90%{opacity:0.3}100%{opacity:1}}
      `}</style>
      <section className="relative z-[1] pb-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <p
            data-reveal
            className="mx-auto mb-12 max-w-xl text-center text-sm leading-relaxed"
            style={{ color: BEACON.muted }}
          >
            Denizcilikte her fener, karakteri denen kendine ozgu bir ritimle
            yanar - gemiler onu bu ritimden tanir. Her calisma alaninin da
            kendi ritmi vardir.
          </p>
          <div className="mx-auto grid max-w-5xl gap-6 md:grid-cols-2 lg:grid-cols-3">
            {c.services.map((s, i) => {
              const ch = CHAR_ANIMS[i % CHAR_ANIMS.length];
              return (
                <BeaconCard key={i} data-reveal className="flex flex-col p-7">
                  <div className="flex items-center gap-3">
                    <span
                      className="h-3.5 w-3.5 rounded-full"
                      style={{
                        background: BEACON.beam,
                        boxShadow: `0 0 12px ${BEACON.beam}`,
                        animation: `${ch.anim} ${ch.dur} infinite`,
                      }}
                      aria-hidden="true"
                    />
                    <span className="text-[11px] tracking-[0.2em]" style={{ color: BEACON.glass }}>
                      KARAKTER: {ch.char}
                    </span>
                  </div>
                  <h3 className="mt-4 text-2xl">{s.title}</h3>
                  <p className="mt-1 text-[11px] italic" style={{ color: BEACON.muted }}>
                    {ch.charDesc} - {s.duration}
                  </p>
                  <p className="mt-3 flex-1 text-sm leading-relaxed" style={{ color: BEACON.muted }}>
                    {s.desc}
                  </p>
                  <p className="mt-3 text-[10px] tracking-[0.2em]" style={{ color: `${BEACON.text}40` }}>
                    {s.method}
                  </p>
                </BeaconCard>
              );
            })}
          </div>
        </div>
      </section>
    </BeaconShell>
  );
}
