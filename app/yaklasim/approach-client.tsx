"use client";

import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import {
  BEACON,
  BeaconCard,
  BeaconShell,
  BeamDivider,
  useBeaconReveal,
} from "@/components/beacon-shared";
import type { SiteContent } from "@/lib/content";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

export function ApproachClient({ content: c }: { content: SiteContent }) {
  const scopeRef = useBeaconReveal();
  const stepsRef = useRef<HTMLDivElement>(null);
  const routeRef = useRef<SVGPathElement>(null);
  const markRefs = useRef<(SVGCircleElement | null)[]>([]);

  useEffect(() => {
    const steps = stepsRef.current;
    const path = routeRef.current;
    if (!steps || !path) return;
    const len = path.getTotalLength();
    path.style.strokeDasharray = `${len}`;
    path.style.strokeDashoffset = `${len}`;
    const total = c.approach.principles.length;
    const st = ScrollTrigger.create({
      trigger: steps,
      start: "top 70%",
      end: "bottom 55%",
      scrub: true,
      onUpdate: (self) => {
        const p = self.progress;
        path.style.strokeDashoffset = `${len * (1 - p)}`;
        markRefs.current.forEach((m, i) => {
          if (!m) return;
          const on = p > (i + 0.5) / total;
          m.setAttribute("fill", on ? BEACON.beam : `${BEACON.muted}55`);
          m.setAttribute("r", on ? "5" : "3.5");
        });
      },
    });
    return () => st.kill();
  }, [c.approach.principles.length]);

  const marks = [
    { x: 30, y: 128 },
    { x: 78, y: 96 },
    { x: 120, y: 62 },
    { x: 164, y: 30 },
  ];

  return (
    <BeaconShell
      kicker="Yaklaşım"
      title="Rota dört seyirde"
      accent="çizilir"
      scopeRef={scopeRef}
      siteName={c.site.name}
    >
      <section className="relative z-[1] py-32 sm:py-40">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mx-auto grid max-w-5xl gap-14 lg:grid-cols-2">
            {/* Sol: sabit harita */}
            <div className="lg:sticky lg:top-28 lg:self-start">
              <BeaconCard className="p-8">
                <svg viewBox="0 0 200 150" fill="none" className="w-full" aria-hidden="true">
                  {[20, 45, 70, 95, 120].map((y) => (
                    <path
                      key={y}
                      d={`M0 ${y + 18} C 50 ${y + 8}, 120 ${y + 26}, 200 ${y + 10}`}
                      stroke={`${BEACON.muted}22`}
                      strokeWidth="1"
                    />
                  ))}
                  <path d="M176 22 L182 10 L188 22 Z" fill={BEACON.beam} />
                  <circle cx="182" cy="8" r="3" fill={BEACON.beam}>
                    <animate attributeName="opacity" values="1;0.2;1" dur="3s" repeatCount="indefinite" />
                  </circle>
                  <path
                    ref={routeRef}
                    d="M14 140 C 40 132, 52 110, 78 96 S 108 74, 120 62 S 152 40, 170 26"
                    stroke={BEACON.glass}
                    strokeWidth="2.4"
                    strokeLinecap="round"
                    strokeDasharray="1"
                  />
                  {marks.map((m, i) => (
                    <circle
                      key={i}
                      ref={(el) => { markRefs.current[i] = el; }}
                      cx={m.x}
                      cy={m.y}
                      r="3.5"
                      fill={`${BEACON.muted}55`}
                    />
                  ))}
                </svg>
                <p className="mt-6 text-center text-xs tracking-[0.2em]" style={{ color: BEACON.muted }}>
                  KAYDIRDIKÇA ROTA ÇİZİLİR
                </p>
              </BeaconCard>
            </div>

            {/* Sağ: seyirler */}
            <div ref={stepsRef} className="space-y-20 lg:py-10">
              {c.approach.principles.map((p, i) => (
                <div key={i}>
                  {i > 0 && <div className="mb-10"><BeamDivider w={120} /></div>}
                  <div data-reveal>
                    <p className="text-[11px] tracking-[0.3em]" style={{ color: BEACON.glass }}>
                      {`${String(i + 1).padStart(2, "0")} \u00B7 SEYİR`}
                    </p>
                    <h3 className="mt-2 text-3xl sm:text-4xl">{p.title}</h3>
                    <p className="mt-4 text-base leading-relaxed" style={{ color: BEACON.muted }}>
                      {p.desc}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    </BeaconShell>
  );
}
