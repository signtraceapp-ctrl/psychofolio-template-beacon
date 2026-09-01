"use client";

import {
  BEACON,
  BeaconCard,
  BeaconShell,
  useBeaconReveal,
} from "@/components/beacon-shared";
import type { SiteContent } from "@/lib/content";

export function AboutClient({ content: c }: { content: SiteContent }) {
  const scopeRef = useBeaconReveal();

  return (
    <BeaconShell
      kicker="Hakkinda"
      title="Fenerin"
      accent="bekcisi"
      scopeRef={scopeRef}
      siteName={c.site.name}
    >
      <section className="relative z-[1] pb-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          {/* Tanitim karti */}
          <BeaconCard
            data-reveal
            className="mx-auto max-w-2xl p-10"
            style={{ boxShadow: `0 24px 60px rgba(0,0,0,0.4)` }}
          >
            <h2 className="text-3xl">{c.site.name}</h2>
            <p className="mt-1 text-sm tracking-[0.12em]" style={{ color: BEACON.beam }}>
              {c.site.title}
            </p>
            <p className="mt-5 leading-relaxed" style={{ color: BEACON.muted }}>
              {c.about.intro}
            </p>
          </BeaconCard>

          {/* Seyir defteri */}
          <div className="mx-auto mt-20 max-w-2xl space-y-10">
            {c.about.credentials.map((cred, i) => (
              <div
                key={i}
                data-reveal
                className="border-l-2 pl-8"
                style={{ borderColor: `${BEACON.beam}44` }}
              >
                <p className="text-[11px] tracking-[0.3em]" style={{ color: BEACON.glass }}>
                  KAYIT {String(i + 1).padStart(2, "0")}
                </p>
                <h3 className="mt-2 text-2xl">{cred.title}</h3>
                <p className="mt-2 text-sm leading-relaxed" style={{ color: BEACON.muted }}>
                  {cred.detail}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </BeaconShell>
  );
}
