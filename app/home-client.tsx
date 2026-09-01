"use client";

import { motion } from "framer-motion";
import { Compass, Quote, ArrowRight } from "lucide-react";
import type { SiteContent } from "@/lib/content";

const fadeUp = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.8, ease: [0.22, 1, 0.36, 1] },
};

const stagger = { animate: { transition: { staggerChildren: 0.12 } } };

export function HomeClient({ content: c }: { content: SiteContent }) {
  return (
    <div className="font-sans selection:bg-primary/20 bg-bg text-fg">
      {/* Hero - centered, beacon-like glow */}
      <section className="relative overflow-hidden py-24 md:py-36">
        <div className="absolute inset-0 -z-10 bg-gradient-to-b from-primary/8 via-bg to-bg" />
        <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -z-10 h-[400px] w-[400px] rounded-full bg-primary/6 blur-[150px]" />

        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
            className="mx-auto max-w-3xl text-center space-y-8"
          >
            <div className="inline-flex items-center gap-2 text-[10px] tracking-[0.3em] uppercase text-primary/80">
              <Compass className="h-3.5 w-3.5" /> {c.home.badge}
            </div>
            <h1 className="font-display text-5xl sm:text-6xl md:text-7xl font-light tracking-tight text-fg leading-[1.1]">
              {c.home.headline}<br />
              <span className="italic text-primary">{c.home.headlineAccent}</span> {c.home.headlineSuffix}
            </h1>
            <p className="mx-auto max-w-lg text-base leading-relaxed text-fg-muted">
              {c.home.description}
            </p>
            <div className="pt-4">
              <a href="/iletisim" className="inline-flex items-center justify-center gap-2 rounded-[10px] bg-primary px-10 py-3.5 text-sm font-medium text-primary-fg shadow-lg shadow-primary/20 transition-all duration-300 hover:bg-primary-hover hover:shadow-xl hover:shadow-primary/30">
                {c.home.cta} <ArrowRight className="h-4 w-4" />
              </a>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Quote */}
      <section className="py-24 border-y border-border/30">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <motion.div initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} transition={{ duration: 1.2 }} className="mx-auto max-w-2xl text-center space-y-8">
            <Quote className="h-8 w-8 text-primary/20 mx-auto" />
            <p className="font-display text-2xl md:text-3xl italic leading-relaxed text-fg/80 font-light">
              &ldquo;{c.home.quote}&rdquo;
            </p>
            <p className="text-[10px] tracking-[0.4em] uppercase text-fg-muted">{c.home.quoteAuthor}</p>
          </motion.div>
        </div>
      </section>

      {/* Services */}
      <section className="py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="space-y-14">
            <div className="text-center space-y-4">
              <h2 className="font-display text-3xl md:text-4xl font-light text-fg tracking-tight">Calisma Alanlari</h2>
              <p className="text-sm text-fg-muted">Seans bilgisi icin iletisime gecin.</p>
            </div>
            <motion.div variants={stagger} initial="initial" whileInView="animate" viewport={{ once: true }} className="grid gap-5 sm:grid-cols-2 max-w-3xl mx-auto">
              {c.services.map((s, i) => (
                <motion.div key={i} variants={fadeUp}
                  className="group rounded-[10px] border border-border/40 bg-bg-secondary/30 p-7 hover:border-primary/30 hover:bg-bg-secondary/60 transition-all duration-300 space-y-3"
                >
                  <h3 className="font-display text-xl font-light text-fg group-hover:text-primary transition-colors">{s.title}</h3>
                  <p className="text-sm text-fg-muted leading-relaxed">{s.desc}</p>
                  <div className="flex items-center gap-3 text-xs text-fg-muted/60">
                    <span>{s.duration}</span><span className="text-primary/20">|</span><span>{s.method}</span>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </div>
      </section>

      {/* Articles */}
      <section className="py-24 bg-bg-secondary/30">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="space-y-14">
            <h2 className="font-display text-3xl font-light text-center text-fg tracking-tight">Yazilar</h2>
            <div className="mx-auto max-w-2xl divide-y divide-border/25">
              {c.articles.map((a, i) => (
                <motion.div key={i} initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} transition={{ duration: 0.5, delay: i * 0.1 }}
                  className="group py-6 flex items-start justify-between gap-4 cursor-pointer"
                >
                  <div className="space-y-1">
                    <span className="text-[10px] tracking-[0.2em] uppercase text-primary/70">{a.category}</span>
                    <h3 className="font-display text-lg text-fg group-hover:text-primary transition-colors font-light">{a.title}</h3>
                  </div>
                  <span className="text-[11px] text-fg-muted flex-shrink-0 mt-4">{a.readTime}</span>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
