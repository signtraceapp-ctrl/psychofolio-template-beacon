"use client";

import dynamic from "next/dynamic";
import { useEffect, useState } from "react";

const BeaconScene = dynamic(
  () => import("./beacon-scene").then((mod) => mod.BeaconScene),
  { ssr: false },
);

interface LazyBeaconSceneProps {
  progressRef: React.MutableRefObject<number>;
}

export function LazyBeaconScene({ progressRef }: LazyBeaconSceneProps) {
  const [reducedMotion, setReducedMotion] = useState(false);

  useEffect(() => {
    const mql = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReducedMotion(mql.matches);
    const handler = (e: MediaQueryListEvent) => setReducedMotion(e.matches);
    mql.addEventListener("change", handler);
    return () => mql.removeEventListener("change", handler);
  }, []);

  if (reducedMotion) {
    return (
      <div
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse at 60% 30%, rgba(255,217,138,0.16), transparent 55%), radial-gradient(ellipse at 50% 100%, rgba(58,90,140,0.25), transparent 60%)",
        }}
        aria-hidden="true"
      />
    );
  }

  return <BeaconScene progressRef={progressRef} />;
}
