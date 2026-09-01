import { getContent } from "@/lib/content";
import type { Metadata } from "next";
export const metadata: Metadata = { title: "Yaklaşım" };
export default function ApproachPage() {
  const c = getContent();
  return (
    <div className="font-sans bg-bg text-fg">
      <section className="py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-2xl space-y-16">
            <h1 className="font-display text-4xl font-light text-center tracking-tight text-fg">{c.approach.title}</h1>
            <p className="text-center text-lg text-fg-muted font-light leading-relaxed max-w-xl mx-auto">{c.approach.intro}</p>
            <div className="space-y-8">
              {c.approach.principles.map((p, i) => (
                <div key={i} className="border-l-2 border-primary/30 pl-8 space-y-3">
                  <h3 className="font-display text-xl font-light text-fg">{p.title}</h3>
                  <p className="text-sm text-fg-muted leading-relaxed">{p.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
