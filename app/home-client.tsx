"use client";

/**
 * BEACON - Ana sayfa: gece denizinden fenere yolculuk.
 * Pinned 3D sahne: sisli deniz, dönen fener ışığı, yaklaştıkça açılan sis,
 * finalde ufukta gün doğumu. Ardından: pusula ritüeli, fenerin üç vaadi,
 * hizmet özeti, alıntı ve kapanış.
 */

import Link from "next/link";
import { useEffect, useRef, useState, useCallback } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { LazyBeaconScene } from "@/components/three/lazy-beacon-scene";
import { BeaconHeader } from "@/components/beacon-header";
import {
  BEACON,
  BeaconCard,
  BeamDivider,
  useBeaconReveal,
} from "@/components/beacon-shared";
import type { SiteContent } from "@/lib/content";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

const journeyPhases = [
  {
    title: "Deniz bazen",
    accent: "kararır",
    body: "Depresyon böyledir: kıyı kaybolur, yönler birbirine karışır. Bu sizin suçunuz değildir.",
  },
  {
    title: "Fener denizi aydınlatmaz,",
    accent: "yön verir",
    body: "Terapi bütün karanlığı silmez; tutunacak sabit bir nokta ve bir rota verir.",
  },
  {
    title: "Işık düzenli yanar -",
    accent: "siz yorulduğunuzda bile",
    body: "Haftalık seanslar fenerin çakışı gibidir: fırtınada da, durgun denizde de aynı ritimde.",
  },
  {
    title: "Kıyı düşündüğünüzden",
    accent: "yakın",
    body: "Sis dağılmaya başladığında çoğu insan kıyıya sandığından daha yakın olduğunu görür.",
  },
  {
    title: "Işığı açık",
    accent: "tutuyoruz",
    body: "",
  },
] as const;

const PHASE_THRESHOLDS = [0.2, 0.45, 0.65, 0.87];

function phaseFor(p: number) {
  for (let i = 0; i < PHASE_THRESHOLDS.length; i++) {
    if (p < PHASE_THRESHOLDS[i]) return i;
  }
  return journeyPhases.length - 1;
}

/* -- Pusula ritüeli -------------------------------------------------------- */
function CompassRitual() {
  const [word, setWord] = useState("");
  const [lit, setLit] = useState(false);
  const sweepRef = useRef<HTMLDivElement>(null);
  const wordRef = useRef<HTMLParagraphElement>(null);

  const light = (e: React.FormEvent) => {
    e.preventDefault();
    if (!word.trim() || lit) return;
    setLit(true);
    requestAnimationFrame(() => {
      if (sweepRef.current) {
        gsap.fromTo(sweepRef.current, { x: "-120%" }, { x: "120%", duration: 1.6, ease: "power2.inOut" });
      }
      if (wordRef.current) {
        gsap.fromTo(
          wordRef.current,
          { opacity: 0.15, textShadow: "0 0 0px rgba(255,217,138,0)" },
          { opacity: 1, textShadow: "0 0 26px rgba(255,217,138,0.8)", duration: 1.4, delay: 0.5, ease: "power2.out" },
        );
      }
    });
  };

  return (
    <section className="relative z-[1] py-28">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <p data-reveal className="text-[11px] tracking-[0.3em]" style={{ color: BEACON.glass }}>
            KÜÇÜK BİR RİTÜEL
          </p>
          <h2 data-reveal className="mt-4 text-4xl sm:text-5xl">
            Pusulanız hangi{" "}
            <span className="italic" style={{ color: BEACON.beam }}>yönü</span>{" "}
            gösteriyor?
          </h2>
          <p data-reveal className="mx-auto mt-4 max-w-md text-sm leading-relaxed" style={{ color: BEACON.muted }}>
            Sizin için yön gösteren bir değeri yazın - aile, dürüstlük, üretmek,
            şefkat... Fener ışığı onu karanlıkta bulsun.
          </p>
          <BeaconCard
            data-reveal
            className="relative mt-10 overflow-hidden p-8 sm:p-12"
            style={{ boxShadow: `0 24px 60px rgba(0,0,0,0.4)` }}
          >
            <div
              ref={sweepRef}
              className="pointer-events-none absolute inset-y-0 w-1/2"
              style={{
                left: "25%",
                transform: "translateX(-120%)",
                background: `linear-gradient(90deg, transparent, ${BEACON.beam}22, transparent)`,
              }}
              aria-hidden="true"
            />
            <p
              ref={wordRef}
              className="min-h-[3rem] text-4xl italic tracking-wide"
              style={{
                fontFamily: "var(--font-beacon), serif",
                color: BEACON.beam,
                opacity: lit ? undefined : 0.15,
              }}
            >
              {word || "\u2026"}
            </p>

            {!lit ? (
              <form onSubmit={light} className="mt-8 flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
                <label htmlFor="bc-ritual" className="sr-only">Yön gösteren değeriniz</label>
                <input
                  id="bc-ritual"
                  value={word}
                  onChange={(e) => setWord(e.target.value)}
                  maxLength={24}
                  placeholder="tek kelime yeter\u2026"
                  className="w-full max-w-xs rounded-lg px-4 py-3 text-center text-sm outline-none transition-shadow focus:shadow-[0_0_0_2px_rgba(255,217,138,0.3)]"
                  style={{
                    background: BEACON.night,
                    border: `1px solid ${BEACON.beam}26`,
                    color: BEACON.text,
                  }}
                />
                <button
                  type="submit"
                  className="whitespace-nowrap rounded-full px-6 py-3 text-xs font-bold tracking-[0.2em] transition-transform hover:scale-[1.02]"
                  style={{ background: BEACON.beam, color: BEACON.night }}
                >
                  IŞIKLA BUL
                </button>
              </form>
            ) : (
              <div className="mt-8">
                <p className="text-sm leading-relaxed" style={{ color: BEACON.muted }}>
                  Deniz h&acirc;l&acirc; karanlık olabilir - ama artık bir yönünüz var.
                  Terapide bu pusulayı birlikte kalibre ederiz.
                </p>
                <Link
                  href="/iletisim"
                  className="mt-5 inline-block text-xs tracking-[0.2em] underline decoration-2 underline-offset-4"
                  style={{ color: BEACON.beam, textDecorationColor: `${BEACON.glass}88` }}
                >
                  İLK GÖRÜŞMEYİ PLANLAYIN
                </Link>
              </div>
            )}
            <p className="relative mt-6 text-[11px]" style={{ color: `${BEACON.muted}cc` }}>
              Yazdıklarınız hiçbir yere gönderilmez, kaydedilmez.
            </p>
          </BeaconCard>
        </div>
      </div>
    </section>
  );
}

/* -- Main Component -------------------------------------------------------- */
export function HomeClient({ content: c }: { content: SiteContent }) {
  const scopeRef = useBeaconReveal();
  const wrapperRef = useRef<HTMLDivElement>(null);
  const pinRef = useRef<HTMLDivElement>(null);
  const progressRef = useRef(0);
  const [phaseIdx, setPhaseIdx] = useState(0);
  const phaseIdxRef = useRef(0);

  const handleUpdate = useCallback((self: ScrollTrigger) => {
    progressRef.current = self.progress;
    const next = phaseFor(self.progress);
    if (next !== phaseIdxRef.current) {
      phaseIdxRef.current = next;
      setPhaseIdx(next);
    }
  }, []);

  useEffect(() => {
    const wrapper = wrapperRef.current;
    const pin = pinRef.current;
    if (!wrapper || !pin) return;

    const st = ScrollTrigger.create({
      trigger: wrapper,
      start: "top top",
      end: "bottom bottom",
      pin,
      scrub: true,
      onUpdate: handleUpdate,
    });
    return () => st.kill();
  }, [handleUpdate]);

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
        .beacon-root{position:relative}
        .beacon-starfield{position:fixed;inset:0;pointer-events:none;z-index:0;
          background-image:
            radial-gradient(1px 1px at 12% 8%,rgba(255,255,255,0.14),transparent),
            radial-gradient(1px 1px at 47% 3%,rgba(255,255,255,0.10),transparent),
            radial-gradient(1px 1px at 83% 11%,rgba(255,255,255,0.12),transparent),
            radial-gradient(1px 1px at 7% 22%,rgba(255,255,255,0.08),transparent),
            radial-gradient(1px 1px at 62% 17%,rgba(255,255,255,0.11),transparent),
            radial-gradient(1px 1px at 93% 28%,rgba(255,255,255,0.09),transparent),
            radial-gradient(1px 1px at 28% 33%,rgba(255,255,255,0.13),transparent),
            radial-gradient(2px 2px at 18% 14%,rgba(255,255,255,0.08),transparent),
            radial-gradient(2px 2px at 76% 21%,rgba(255,255,255,0.09),transparent),
            radial-gradient(1px 1px at 33% 52%,rgba(255,255,255,0.10),transparent),
            radial-gradient(1px 1px at 66% 48%,rgba(255,255,255,0.09),transparent),
            radial-gradient(1px 1px at 15% 57%,rgba(255,255,255,0.12),transparent),
            radial-gradient(1px 1px at 81% 53%,rgba(255,255,255,0.08),transparent),
            radial-gradient(1px 1px at 44% 61%,rgba(255,255,255,0.11),transparent),
            radial-gradient(2px 2px at 22% 66%,rgba(255,255,255,0.07),transparent),
            radial-gradient(1px 1px at 58% 72%,rgba(255,255,255,0.10),transparent);
          background-size:100% 100%;
        }
      `}</style>
      <div className="beacon-starfield" aria-hidden="true" />
      <BeaconHeader siteName={c.site.name} />

      {/* Pinned fener yolculuğu */}
      <section ref={wrapperRef} className="relative" style={{ height: "420vh" }} aria-label="Fener yolculuğu">
        <div ref={pinRef} className="relative h-screen w-full overflow-hidden">
          <LazyBeaconScene progressRef={progressRef} />

          {/* Marka çipi */}
          <div className="pointer-events-none absolute left-6 top-20 z-10 lg:left-10">
            <p
              className="rounded-full border px-4 py-2 text-[11px] tracking-[0.24em]"
              style={{
                background: `${BEACON.panel}bb`,
                borderColor: `${BEACON.beam}22`,
                color: BEACON.muted,
                backdropFilter: "blur(6px)",
              }}
            >
              {c.site.name.toUpperCase()} &middot; {c.home.cardTitle?.toUpperCase() || "UMUT VE YÖN"}
            </p>
          </div>

          {/* Faz metinleri */}
          {journeyPhases.map((ph, i) => (
            <div
              key={i}
              className={`absolute inset-x-0 bottom-16 z-10 transition-[transform,opacity] duration-300 sm:bottom-20 ${
                phaseIdx === i ? "translate-y-0 opacity-100" : "pointer-events-none translate-y-5 opacity-0"
              }`}
              aria-hidden={phaseIdx !== i}
            >
              <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                <div
                  className="max-w-xl rounded-xl border p-7 sm:p-9"
                  style={{
                    background: `${BEACON.night}b8`,
                    borderColor: `${BEACON.beam}1f`,
                    backdropFilter: "blur(10px)",
                  }}
                >
                  <h2 className="text-3xl font-light leading-[1.08] sm:text-5xl md:text-6xl">
                    {ph.title}{" "}
                    <span
                      className="font-semibold italic"
                      style={{
                        color: BEACON.beam,
                        textShadow: `0 0 40px rgba(255,217,138,0.3)`,
                      }}
                    >
                      {ph.accent}
                    </span>
                  </h2>
                  {ph.body && (
                    <p className="mt-4 max-w-md text-sm leading-relaxed sm:text-base" style={{ color: BEACON.muted }}>
                      {ph.body}
                    </p>
                  )}
                  {i === journeyPhases.length - 1 && (
                    <div className="mt-6 flex flex-wrap gap-3">
                      <Link
                        href="/iletisim"
                        className="rounded-full px-6 py-3 text-xs font-bold tracking-[0.2em] transition-transform hover:scale-[1.02]"
                        style={{ background: BEACON.beam, color: BEACON.night }}
                      >
                        RANDEVU AL
                      </Link>
                      <Link
                        href="/yaklasim"
                        className="rounded-full border px-6 py-3 text-xs tracking-[0.2em] transition-colors"
                        style={{ borderColor: `${BEACON.beam}55`, color: BEACON.beam }}
                      >
                        ROTAYI TANIYIN
                      </Link>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}

          {/* Faz göstergesi */}
          <div className="absolute right-6 top-1/2 z-10 hidden -translate-y-1/2 flex-col items-center gap-3 lg:right-14 lg:flex">
            {journeyPhases.map((_, i) => (
              <span
                key={i}
                className="block rounded-full transition-[width,height,background-color,box-shadow] duration-300"
                style={{
                  width: phaseIdx === i ? 10 : 6,
                  height: phaseIdx === i ? 10 : 6,
                  background: phaseIdx === i ? BEACON.beam : `${BEACON.text}30`,
                  boxShadow: phaseIdx === i ? `0 0 14px ${BEACON.beam}` : "none",
                }}
                aria-hidden="true"
              />
            ))}
          </div>

          {/* Kaydır ipucu */}
          <div
            className={`absolute bottom-5 left-1/2 z-10 -translate-x-1/2 transition-opacity duration-300 ${
              phaseIdx === 0 ? "opacity-70" : "opacity-0"
            }`}
          >
            <div className="flex flex-col items-center gap-1.5">
              <span className="text-[10px] tracking-[0.24em]" style={{ color: BEACON.beam }}>KAYDIR</span>
              <span
                className="h-6 w-px animate-pulse"
                style={{ background: `linear-gradient(to bottom, ${BEACON.beam}, transparent)` }}
                aria-hidden="true"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Pusula ritüeli */}
      <CompassRitual />

      {/* Fenerin üç vaadi */}
      <section className="relative z-[1] py-24" style={{ background: `${BEACON.panel}66` }}>
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-2xl text-center">
            <p data-reveal className="text-[11px] tracking-[0.3em]" style={{ color: BEACON.glass }}>FELSEFE</p>
            <h2 data-reveal className="mt-4 text-4xl sm:text-5xl">
              Fenerin üç{" "}
              <span className="italic" style={{ color: BEACON.beam }}>vaadi</span>
            </h2>
          </div>
          <div className="mx-auto mt-16 grid max-w-4xl gap-10 sm:grid-cols-3">
            {[
              { t: "Yerinde durur", d: "Siz uzaklaşsanız da, geciktirseniz de fener yer değiştirmez. Terapötik ilişki sabittir." },
              { t: "Düzenli yanar", d: "Motivasyonunuz olmadığı hafta da seans oradadır. Ritim, iyileşmenin kendisidir." },
              { t: "Yolu dayatmaz", d: "Fener rotanızı çizmez; kayalıkları gösterir. Dümen her zaman sizde kalır." },
            ].map((p, i) => (
              <div key={p.t} data-reveal className="text-center">
                <span
                  className="mx-auto block h-3 w-3 rounded-full"
                  style={{
                    background: BEACON.beam,
                    boxShadow: `0 0 16px ${BEACON.beam}`,
                    animationDelay: `${i * 0.8}s`,
                  }}
                  aria-hidden="true"
                />
                <h3 className="mt-4 text-2xl">{p.t}</h3>
                <div className="mt-3"><BeamDivider w={90} /></div>
                <p className="mt-3 text-sm leading-relaxed" style={{ color: BEACON.muted }}>{p.d}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Hizmet özeti */}
      <section className="relative z-[1] py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-3xl">
            <p data-reveal className="text-center text-[11px] tracking-[0.3em]" style={{ color: BEACON.glass }}>
              ÇALIŞMA ALANLARI
            </p>
            <h2 data-reveal className="mt-4 text-center text-4xl sm:text-5xl">
              Işık nerelere{" "}
              <span className="italic" style={{ color: BEACON.beam }}>düşer</span>
            </h2>
            <div className="mt-12">
              {c.services.map((s) => (
                <Link
                  key={s.title}
                  href="/hizmetler"
                  data-reveal
                  className="group flex items-baseline justify-between gap-4 border-b py-6 transition-colors"
                  style={{ borderColor: `${BEACON.text}14` }}
                >
                  <span
                    className="text-2xl transition-colors group-hover:text-[#ffd98a] sm:text-3xl"
                    style={{ fontFamily: "var(--font-beacon), serif" }}
                  >
                    {s.title}
                  </span>
                  <span className="hidden text-sm sm:block" style={{ color: BEACON.muted }}>
                    {s.desc.length > 50 ? s.desc.substring(0, 50) + "..." : s.desc}
                  </span>
                  <span className="text-lg transition-transform group-hover:translate-x-1" style={{ color: BEACON.beam }} aria-hidden="true">
                    &rarr;
                  </span>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Alıntı */}
      <section className="relative z-[1] py-24" style={{ background: `${BEACON.panel}66` }}>
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <blockquote data-reveal className="mx-auto max-w-2xl text-center">
            <p className="text-3xl italic leading-snug sm:text-4xl" style={{ fontFamily: "var(--font-beacon), serif" }}>
              &ldquo;{c.home.quote}&rdquo;
            </p>
            <footer className="mt-5 text-xs tracking-[0.3em]" style={{ color: BEACON.muted }}>
              {c.home.quoteAuthor.toUpperCase()}
            </footer>
          </blockquote>
        </div>
      </section>

      {/* Kapanış CTA */}
      <section className="relative z-[1] py-28">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <BeaconCard
            data-reveal
            className="relative mx-auto max-w-2xl overflow-hidden p-10 text-center sm:p-14"
            style={{ boxShadow: `0 24px 60px rgba(0,0,0,0.4)` }}
          >
            <div
              className="pointer-events-none absolute left-1/2 top-0 h-40 w-[420px] -translate-x-1/2 -translate-y-1/2"
              style={{ background: `radial-gradient(ellipse, ${BEACON.beam}22, transparent 65%)` }}
              aria-hidden="true"
            />
            <h2 className="text-4xl sm:text-5xl">
              İlk görüşme, ilk{" "}
              <span className="italic" style={{ color: BEACON.beam }}>çakış</span>
            </h2>
            <p className="mx-auto mt-4 max-w-md text-sm leading-relaxed" style={{ color: BEACON.muted }}>
              Tanışma görüşmesinde konumunuzu birlikte alırız: neredesiniz,
              deniz nasıl, hangi kıyıya gitmek istiyorsunuz.
            </p>
            <div className="mt-8 flex flex-wrap justify-center gap-3">
              <Link
                href="/iletisim"
                className="rounded-full px-7 py-3.5 text-xs font-bold tracking-[0.2em] transition-transform hover:scale-[1.02]"
                style={{ background: BEACON.beam, color: BEACON.night }}
              >
                RANDEVU AL
              </Link>
              <Link
                href="/sss"
                className="rounded-full border px-7 py-3.5 text-xs tracking-[0.2em] transition-colors"
                style={{ borderColor: `${BEACON.beam}55`, color: BEACON.beam }}
              >
                SORULARINIZ MI VAR?
              </Link>
            </div>
          </BeaconCard>
        </div>
      </section>

      <footer className="relative z-[1] border-t py-10 text-center" style={{ borderColor: `${BEACON.text}12` }}>
        <p className="text-xs tracking-[0.14em]" style={{ color: BEACON.muted }}>
          {c.site.name.toUpperCase()} &middot; fener denizi aydınlatmaz, yön verir
        </p>
      </footer>
    </div>
  );
}
