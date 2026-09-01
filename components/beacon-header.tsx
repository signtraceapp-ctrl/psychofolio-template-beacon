"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { BEACON } from "./beacon-shared";

const navLinks = [
  { label: "Hakkimda", path: "/hakkimda" },
  { label: "Hizmetler", path: "/hizmetler" },
  { label: "Yaklasim", path: "/yaklasim" },
  { label: "Yazilar", path: "/yazilar" },
  { label: "SSS", path: "/sss" },
  { label: "Iletisim", path: "/iletisim" },
] as const;

interface BeaconHeaderProps {
  siteName?: string;
}

export function BeaconHeader({ siteName = "BEACON" }: BeaconHeaderProps) {
  const pathname = usePathname();
  const [menuOpen, setMenuOpen] = useState(false);
  const isActive = (path: string) => pathname === path;

  const items = [{ label: "Ana Sayfa", path: "/" }, ...navLinks];
  const R = 168;

  return (
    <>
      {/* Ufuk cizgisi */}
      <header className="fixed inset-x-0 top-0 z-40">
        <div
          className="flex items-center justify-between px-6 py-4 lg:px-10"
          style={{
            background: `linear-gradient(to bottom, ${BEACON.night}e6, transparent)`,
          }}
        >
          <Link
            href="/"
            className="text-sm font-bold tracking-[0.4em]"
            style={{ fontFamily: "var(--font-beacon), serif", color: BEACON.text }}
          >
            {siteName.toUpperCase()}
          </Link>
          <span className="hidden text-[10px] tracking-[0.3em] sm:block" style={{ color: BEACON.muted }}>
            41&deg;01&apos;N - 29&deg;00&apos;E
          </span>
        </div>
        <span
          className="block h-px w-full"
          style={{ background: `linear-gradient(90deg, transparent, ${BEACON.beam}66, transparent)` }}
          aria-hidden="true"
        />
      </header>

      {/* Karartma */}
      <div
        className={`fixed inset-0 z-30 transition-opacity duration-300 ${
          menuOpen ? "pointer-events-auto opacity-100" : "pointer-events-none opacity-0"
        }`}
        style={{ background: `${BEACON.night}cc`, backdropFilter: "blur(4px)" }}
        onClick={() => setMenuOpen(false)}
        aria-hidden="true"
      />

      {/* Mercek + radyal menu */}
      <div className="fixed bottom-7 right-7 z-40 lg:bottom-9 lg:right-9">
        {items.map((l, i) => {
          const a = ((95 + (i * 90) / (items.length - 1)) * Math.PI) / 180;
          const x = -Math.cos(a - Math.PI / 2) * R;
          const y = -Math.sin(a - Math.PI / 2) * R;
          return (
            <Link
              key={l.path}
              href={l.path}
              onClick={() => setMenuOpen(false)}
              className={`absolute right-2 bottom-2 hidden whitespace-nowrap rounded-full border px-4 py-2 text-xs tracking-[0.14em] transition-[transform,opacity] duration-300 lg:block ${
                menuOpen ? "opacity-100" : "pointer-events-none opacity-0"
              }`}
              style={{
                transform: menuOpen ? `translate(${x}px, ${y}px)` : "translate(0px, 0px)",
                transitionDelay: menuOpen ? `${i * 45}ms` : "0ms",
                background: isActive(l.path) ? BEACON.beam : `${BEACON.panel}f2`,
                borderColor: isActive(l.path) ? BEACON.beam : `${BEACON.beam}33`,
                color: isActive(l.path) ? BEACON.night : BEACON.text,
              }}
            >
              {l.label}
            </Link>
          );
        })}

        {/* Mobil: dikey liste */}
        <nav
          className={`absolute bottom-20 right-0 flex w-48 flex-col gap-1.5 transition-[transform,opacity] duration-300 lg:hidden ${
            menuOpen ? "pointer-events-auto translate-y-0 opacity-100" : "pointer-events-none translate-y-3 opacity-0"
          }`}
          aria-label="Mobil menu"
        >
          {items.map((l) => (
            <Link
              key={l.path}
              href={l.path}
              onClick={() => setMenuOpen(false)}
              className="rounded-full border px-4 py-2.5 text-right text-xs tracking-[0.14em]"
              style={{
                background: isActive(l.path) ? BEACON.beam : `${BEACON.panel}f2`,
                borderColor: `${BEACON.beam}33`,
                color: isActive(l.path) ? BEACON.night : BEACON.text,
              }}
            >
              {l.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-3">
          <Link
            href="/iletisim"
            className="hidden rounded-full px-5 py-2.5 text-[11px] font-bold tracking-[0.18em] sm:block"
            style={{ background: BEACON.beam, color: BEACON.night }}
          >
            RANDEVU
          </Link>
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label={menuOpen ? "Menuyu kapat" : "Menuyu ac"}
            aria-expanded={menuOpen}
            className="relative flex h-14 w-14 items-center justify-center rounded-full border-2 transition-transform duration-300 hover:scale-105"
            style={{
              borderColor: `${BEACON.beam}88`,
              background: `radial-gradient(circle at 40% 35%, ${BEACON.beam}, #d9a94f 70%)`,
              boxShadow: `0 0 24px ${BEACON.beam}55`,
            }}
          >
            <span
              className="absolute inset-2 rounded-full border"
              style={{ borderColor: `${BEACON.night}44` }}
              aria-hidden="true"
            />
            <span
              className={`absolute inset-[18px] rounded-full transition-transform duration-300 ${menuOpen ? "scale-75" : ""}`}
              style={{ background: BEACON.night }}
              aria-hidden="true"
            />
          </button>
        </div>
      </div>
    </>
  );
}
