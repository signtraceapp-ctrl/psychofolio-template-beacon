"use client";

import { useState, useRef } from "react";
import { gsap } from "gsap";
import {
  BEACON,
  BeaconCard,
  BeaconShell,
  useBeaconReveal,
} from "@/components/beacon-shared";
import type { SiteContent } from "@/lib/content";

export function ContactClient({ content: c }: { content: SiteContent }) {
  const scopeRef = useBeaconReveal();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [note, setNote] = useState("");
  const [sent, setSent] = useState(false);
  const lightRef = useRef<HTMLDivElement>(null);

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    setSent(true);
    requestAnimationFrame(() => {
      if (lightRef.current) {
        gsap.fromTo(
          lightRef.current,
          { scale: 0.4, opacity: 0 },
          { scale: 1, opacity: 1, duration: 0.9, ease: "power2.out" },
        );
      }
    });
  };

  const inputStyle: React.CSSProperties = {
    background: BEACON.night,
    border: `1px solid ${BEACON.beam}26`,
    borderRadius: 10,
    color: BEACON.text,
  };

  return (
    <BeaconShell
      kicker="İletişim"
      title="Kıyıya haber"
      accent="verin"
      scopeRef={scopeRef}
      siteName={c.site.name}
    >
      <section className="relative z-[1] pb-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mx-auto grid max-w-4xl gap-10 lg:grid-cols-[1.2fr_0.8fr]">
            {/* Form */}
            <BeaconCard
              data-reveal
              className="p-8 sm:p-10"
              style={{ boxShadow: `0 24px 60px rgba(0,0,0,0.4)` }}
            >
              {!sent ? (
                <form onSubmit={submit} className="space-y-5">
                  <p className="text-sm leading-relaxed" style={{ color: BEACON.muted }}>
                    {c.contact.intro}
                  </p>
                  <div>
                    <label htmlFor="bc-name" className="mb-1.5 block text-[11px] tracking-[0.2em]" style={{ color: BEACON.glass }}>
                      {c.contact.formName?.toUpperCase() || "ADINIZ"}
                    </label>
                    <input
                      id="bc-name"
                      required
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="w-full px-4 py-3 text-sm outline-none transition-shadow focus:shadow-[0_0_0_2px_rgba(255,217,138,0.3)]"
                      style={inputStyle}
                    />
                  </div>
                  <div>
                    <label htmlFor="bc-email" className="mb-1.5 block text-[11px] tracking-[0.2em]" style={{ color: BEACON.glass }}>
                      {c.contact.formEmail?.toUpperCase() || "E-POSTA"}
                    </label>
                    <input
                      id="bc-email"
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full px-4 py-3 text-sm outline-none transition-shadow focus:shadow-[0_0_0_2px_rgba(255,217,138,0.3)]"
                      style={inputStyle}
                    />
                  </div>
                  <div>
                    <label htmlFor="bc-note" className="mb-1.5 block text-[11px] tracking-[0.2em]" style={{ color: BEACON.glass }}>
                      {c.contact.formMessage?.toUpperCase() || "MESAJINIZ"} (İSTEĞE BAĞLI)
                    </label>
                    <textarea
                      id="bc-note"
                      rows={4}
                      value={note}
                      onChange={(e) => setNote(e.target.value)}
                      className="w-full resize-none px-4 py-3 text-sm outline-none transition-shadow focus:shadow-[0_0_0_2px_rgba(255,217,138,0.3)]"
                      style={inputStyle}
                    />
                  </div>
                  <button
                    type="submit"
                    className="w-full rounded-full py-3.5 text-sm font-bold tracking-[0.2em] transition-transform hover:scale-[1.01]"
                    style={{ background: BEACON.beam, color: BEACON.night }}
                  >
                    IŞIĞI YAK
                  </button>
                </form>
              ) : (
                <div className="flex min-h-[300px] flex-col items-center justify-center text-center">
                  <div
                    ref={lightRef}
                    className="flex h-20 w-20 items-center justify-center rounded-full"
                    style={{
                      background: `radial-gradient(circle, ${BEACON.beam}, #d9a94f 75%)`,
                      boxShadow: `0 0 50px ${BEACON.beam}aa, 0 0 110px ${BEACON.beam}44`,
                    }}
                    aria-hidden="true"
                  />
                  <h3 className="mt-7 text-3xl">
                    Işık yandı{name ? `, ${name.split(" ")[0]}` : ""}
                  </h3>
                  <p className="mt-3 max-w-sm text-sm leading-relaxed" style={{ color: BEACON.muted }}>
                    Mesajınız kıyıya ulaştı. En geç bir iş günü içinde{" "}
                    {email ? <span style={{ color: BEACON.beam }}>{email}</span> : "e-postanıza"}{" "}
                    adresinden dönüş yapılır.
                  </p>
                </div>
              )}
            </BeaconCard>

            {/* Bilgiler */}
            <div data-reveal className="space-y-8 lg:pt-4">
              {[
                { k: "SEANS", v: "Hafta içi 10:00-19:00 \u00B7 Cmt 10:00-14:00" },
                { k: "KONUM", v: c.site.address },
                { k: "E-POSTA", v: c.site.email },
              ].map((row) => (
                <div key={row.k} className="border-b pb-5" style={{ borderColor: `${BEACON.text}12` }}>
                  <p className="text-[11px] tracking-[0.3em]" style={{ color: BEACON.glass }}>
                    {row.k}
                  </p>
                  <p className="mt-2 text-sm leading-relaxed">{row.v}</p>
                </div>
              ))}
              <p className="text-xs leading-relaxed" style={{ color: BEACON.muted }}>
                Acil bir durumdaysanız ya da kendinize zarar verme düşünceleriniz
                şu anda yoğunsa lütfen 112&apos;yi arayın ya da en yakın acil servise
                başvurun - bu form acil destek kanalı değildir.
              </p>
            </div>
          </div>
        </div>
      </section>
    </BeaconShell>
  );
}
