"use client";

import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { BeaconHeader } from "./beacon-header";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

/* -- Color palette --------------------------------------------------------- */
export const BEACON = {
  night: "#0b1626",
  deep: "#101f33",
  panel: "#13233a",
  beam: "#ffd98a",
  glass: "#79c7b1",
  text: "#e9eef4",
  muted: "#8fa1b3",
} as const;

/* -- Reveal hook ----------------------------------------------------------- */
export function useBeaconReveal() {
  const scopeRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    window.scrollTo(0, 0);
    const scope = scopeRef.current;
    if (!scope) return;
    const ctx = gsap.context(() => {
      gsap.utils.toArray<HTMLElement>("[data-reveal]").forEach((el) => {
        gsap.from(el, {
          opacity: 0,
          y: 30,
          duration: 1,
          ease: "power3.out",
          scrollTrigger: { trigger: el, start: "top 88%" },
        });
      });
    }, scope);
    return () => ctx.revert();
  }, []);
  return scopeRef;
}

/* -- Beam Divider ---------------------------------------------------------- */
export function BeamDivider({ w = 220 }: { w?: number }) {
  return (
    <svg width={w} height="12" viewBox="0 0 220 12" fill="none" className="mx-auto" aria-hidden="true">
      <defs>
        <linearGradient id="bm-hline" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor={BEACON.beam} stopOpacity="0" />
          <stop offset="50%" stopColor={BEACON.beam} stopOpacity="0.15" />
          <stop offset="100%" stopColor={BEACON.beam} stopOpacity="0" />
        </linearGradient>
        <radialGradient id="bm-sparkle" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor={BEACON.beam} stopOpacity="0.7" />
          <stop offset="100%" stopColor={BEACON.beam} stopOpacity="0" />
        </radialGradient>
      </defs>
      <line x1="4" y1="6" x2="216" y2="6" stroke="url(#bm-hline)" strokeWidth="1" />
      <circle cx="110" cy="6" r="6" fill="url(#bm-sparkle)" />
      <circle cx="110" cy="6" r="3.4" fill={BEACON.beam} />
      <circle cx="110" cy="6" r="3.4" fill={BEACON.beam} opacity="0.35">
        <animate attributeName="r" values="3.4;8;3.4" dur="3s" repeatCount="indefinite" />
        <animate attributeName="opacity" values="0.35;0;0.35" dur="3s" repeatCount="indefinite" />
      </circle>
    </svg>
  );
}

/* -- BeaconCard ------------------------------------------------------------ */
export function BeaconCard({
  children,
  className = "",
  style,
  ...rest
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={`relative rounded-xl border ring-1 ring-inset ring-white/[0.04] transition-shadow transition-transform duration-300 hover:-translate-y-0.5 hover:shadow-[0_0_20px_rgba(255,217,138,0.08)] ${className}`}
      style={{
        background: `${BEACON.panel}cc`,
        borderColor: `${BEACON.beam}1f`,
        ...style,
      }}
      {...rest}
    >
      <span
        className="pointer-events-none absolute right-3 top-3 h-1.5 w-1.5 rounded-full opacity-20"
        style={{
          background: `radial-gradient(circle, ${BEACON.beam}, transparent 70%)`,
          boxShadow: `0 0 6px ${BEACON.beam}`,
        }}
        aria-hidden="true"
      />
      {children}
    </div>
  );
}

/* -- Overlay styles -------------------------------------------------------- */
const BEACON_OVERLAY_STYLES = `
  .beacon-root{position:relative}
  .beacon-root::before,.beacon-root::after{content:'';position:fixed;inset:0;pointer-events:none;z-index:0}
  .beacon-root::before{
    background-image:
      radial-gradient(1px 1px at 12% 8%,rgba(255,255,255,0.14),transparent),
      radial-gradient(1px 1px at 47% 3%,rgba(255,255,255,0.10),transparent),
      radial-gradient(1px 1px at 83% 11%,rgba(255,255,255,0.12),transparent),
      radial-gradient(1px 1px at 7% 22%,rgba(255,255,255,0.08),transparent),
      radial-gradient(1px 1px at 62% 17%,rgba(255,255,255,0.11),transparent),
      radial-gradient(1px 1px at 93% 28%,rgba(255,255,255,0.09),transparent),
      radial-gradient(1px 1px at 28% 33%,rgba(255,255,255,0.13),transparent),
      radial-gradient(1px 1px at 71% 29%,rgba(255,255,255,0.07),transparent),
      radial-gradient(1px 1px at 4% 41%,rgba(255,255,255,0.10),transparent),
      radial-gradient(1px 1px at 55% 38%,rgba(255,255,255,0.12),transparent),
      radial-gradient(2px 2px at 18% 14%,rgba(255,255,255,0.08),transparent),
      radial-gradient(2px 2px at 38% 7%,rgba(255,255,255,0.07),transparent),
      radial-gradient(2px 2px at 76% 21%,rgba(255,255,255,0.09),transparent),
      radial-gradient(2px 2px at 52% 44%,rgba(255,255,255,0.06),transparent),
      radial-gradient(2px 2px at 89% 36%,rgba(255,255,255,0.08),transparent),
      radial-gradient(1px 1px at 33% 52%,rgba(255,255,255,0.10),transparent),
      radial-gradient(1px 1px at 66% 48%,rgba(255,255,255,0.09),transparent),
      radial-gradient(1px 1px at 15% 57%,rgba(255,255,255,0.12),transparent),
      radial-gradient(1px 1px at 81% 53%,rgba(255,255,255,0.08),transparent),
      radial-gradient(1px 1px at 44% 61%,rgba(255,255,255,0.11),transparent),
      radial-gradient(2px 2px at 22% 66%,rgba(255,255,255,0.07),transparent),
      radial-gradient(1px 1px at 58% 72%,rgba(255,255,255,0.10),transparent),
      radial-gradient(1px 1px at 91% 64%,rgba(255,255,255,0.09),transparent),
      radial-gradient(1px 1px at 35% 78%,rgba(255,255,255,0.13),transparent),
      radial-gradient(2px 2px at 74% 82%,rgba(255,255,255,0.06),transparent),
      radial-gradient(1px 1px at 9% 84%,rgba(255,255,255,0.11),transparent),
      radial-gradient(1px 1px at 50% 88%,rgba(255,255,255,0.08),transparent),
      radial-gradient(1px 1px at 68% 92%,rgba(255,255,255,0.10),transparent),
      radial-gradient(2px 2px at 26% 95%,rgba(255,255,255,0.07),transparent),
      radial-gradient(1px 1px at 85% 97%,rgba(255,255,255,0.12),transparent),
      radial-gradient(ellipse 600px 300px at 50% 5%,oklch(0.7 0.1 140/0.04),transparent 70%),
      radial-gradient(ellipse 400px 200px at 60% 3%,rgba(255,217,138,0.025),transparent 60%);
    background-size:100% 100%;
  }
  .beacon-root::after{
    background:repeating-conic-gradient(rgba(255,255,255,0.015) 0% 25%,transparent 0% 50%) 0 0/4px 4px;
    opacity:0.5;
  }
` as const;

/* -- Page shell ------------------------------------------------------------ */
export function BeaconShell({
  kicker,
  title,
  accent,
  children,
  scopeRef,
  siteName,
}: {
  kicker: string;
  title: string;
  accent?: string;
  children: React.ReactNode;
  scopeRef: React.RefObject<HTMLDivElement | null>;
  siteName?: string;
}) {
  return (
    <div
      ref={scopeRef}
      className="beacon-root min-h-screen font-sans"
      style={{
        colorScheme: "dark",
        color: BEACON.text,
        background:
          `radial-gradient(1100px 540px at 78% -5%, ${BEACON.beam}10, transparent 55%), ` +
          `radial-gradient(900px 520px at 8% 105%, ${BEACON.glass}0d, transparent 55%), ` +
          `linear-gradient(to bottom, ${BEACON.night}, ${BEACON.deep})`,
      }}
    >
      <style>{`
        .beacon-root :is(h1,h2,h3){font-family:var(--font-beacon),var(--font-display),serif;font-weight:600;letter-spacing:-0.01em}
        .beacon-root ::selection{background:${BEACON.beam}45}
        ${BEACON_OVERLAY_STYLES}
      `}</style>
      <BeaconHeader siteName={siteName} />

      <header className="relative z-[1] pb-12 pt-32 text-center">
        <div
          className="pointer-events-none absolute inset-x-0 top-1/2 -translate-y-1/2"
          aria-hidden="true"
          style={{ opacity: 0.08 }}
        >
          <svg viewBox="0 0 1200 200" className="mx-auto w-full max-w-5xl" fill="none" xmlns="http://www.w3.org/2000/svg">
            <line x1="0" y1="150" x2="1200" y2="150" stroke={BEACON.beam} strokeWidth="1.5" />
            <g transform="translate(600, 150)">
              <polygon points="-8,0 -6,-60 6,-60 8,0" fill={BEACON.beam} />
              <rect x="-9" y="-72" width="18" height="12" rx="2" fill={BEACON.beam} />
              <rect x="-7" y="-70" width="14" height="8" rx="1" fill={BEACON.beam} className="beacon-lamp-shimmer" />
              <polygon points="-10,-72 0,-82 10,-72" fill={BEACON.beam} />
              <rect x="-12" y="-2" width="24" height="4" rx="1" fill={BEACON.beam} />
            </g>
            <path d="M0,152 Q100,148 200,152 T400,152 T600,152 T800,152 T1000,152 T1200,152" stroke={BEACON.beam} strokeWidth="0.8" opacity="0.5" />
          </svg>
        </div>
        <style>{`
          @keyframes beaconLampShimmer {
            0%, 100% { opacity: 0.4; }
            50% { opacity: 1; }
          }
          .beacon-lamp-shimmer {
            animation: beaconLampShimmer 3s ease-in-out infinite;
          }
        `}</style>
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <p
            data-reveal
            className="mx-auto flex items-center justify-center gap-3 text-[11px] tracking-[0.3em]"
            style={{ color: BEACON.muted }}
          >
            <span className="h-px w-8" style={{ background: `${BEACON.beam}88` }} aria-hidden="true" />
            {kicker.toUpperCase()}
            <span className="h-px w-8" style={{ background: `${BEACON.beam}88` }} aria-hidden="true" />
          </p>
          <h1
            data-reveal
            className="mx-auto mt-6 max-w-3xl text-6xl font-light leading-[0.95] sm:text-7xl md:text-8xl"
          >
            {title}{" "}
            {accent && (
              <span
                className="font-semibold italic"
                style={{
                  color: BEACON.beam,
                  textShadow: `0 0 40px rgba(255,217,138,0.3)`,
                }}
              >
                {accent}
              </span>
            )}
          </h1>
          <div
            data-reveal
            className="mx-auto mt-5 h-px w-48 sm:w-64"
            style={{
              background: `linear-gradient(90deg, transparent, ${BEACON.beam}40, transparent)`,
            }}
            aria-hidden="true"
          />
          <div data-reveal className="mt-6">
            <BeamDivider />
          </div>
        </div>
      </header>

      {children}

      <footer
        className="relative z-[1] border-t py-10 text-center"
        style={{ borderColor: `${BEACON.text}12` }}
      >
        <p className="text-xs tracking-[0.14em]" style={{ color: BEACON.muted }}>
          {siteName?.toUpperCase() || "BEACON"} - fener denizi aydinlatmaz, yon verir
        </p>
      </footer>
    </div>
  );
}
