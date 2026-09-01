import { getContent } from "@/lib/content";
import type { Metadata } from "next";
export const metadata: Metadata = { title: "Hakkımda" };
export default function AboutPage() {
  const c = getContent();
  return (
    <div className="font-sans bg-bg text-fg">
      <section className="py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-2xl space-y-16">
            <h1 className="font-display text-4xl font-light text-center tracking-tight text-fg">{c.about.title}</h1>
            <p className="text-center text-lg text-fg-muted font-light leading-relaxed max-w-xl mx-auto">{c.about.intro}</p>
            <div className="space-y-6">
              {c.about.credentials.map((cred, i) => (
                <div key={i} className="rounded-[10px] border border-border/30 bg-bg-secondary/30 p-6 flex items-start gap-5">
                  <span className="text-xs text-primary/60 font-display mt-1 flex-shrink-0">{String(i + 1).padStart(2, "0")}</span>
                  <div className="space-y-1">
                    <h3 className="font-display text-lg font-light text-fg">{cred.title}</h3>
                    <p className="text-sm text-fg-muted">{cred.detail}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
