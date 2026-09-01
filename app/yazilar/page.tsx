import { getContent } from "@/lib/content";
import type { Metadata } from "next";
export const metadata: Metadata = { title: "Yazılar" };
export default function ArticlesPage() {
  const c = getContent();
  return (
    <div className="font-sans bg-bg text-fg">
      <section className="py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="space-y-12">
            <h1 className="font-display text-4xl font-light text-center tracking-tight text-fg">Yazilar</h1>
            <div className="mx-auto max-w-2xl divide-y divide-border/25">
              {c.articles.map((a, i) => (
                <div key={i} className="group py-6 flex items-start justify-between gap-4 cursor-pointer">
                  <div className="space-y-1">
                    <span className="text-[10px] tracking-[0.2em] uppercase text-primary/70">{a.category}</span>
                    <h2 className="font-display text-lg text-fg group-hover:text-primary transition-colors font-light">{a.title}</h2>
                  </div>
                  <div className="flex items-center gap-3 text-[11px] text-fg-muted flex-shrink-0 mt-4">
                    <span>{a.readTime}</span><span className="text-border/50">|</span><span>{a.date}</span>
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
