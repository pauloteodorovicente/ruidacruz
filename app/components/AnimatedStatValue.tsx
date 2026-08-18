"use client";

import { useEffect, useRef, useState } from "react";

const NUMBER_PATTERN = /^(\+?)(\d+)(.*)$/;

// Conta de 0 até o valor real na primeira vez que entra em vista — só pra
// valores que começam com um número (ex. "7 Anos", "+200"). Texto sem
// número (ex. "RE/MAX Collection") renderiza estático, sem tentar animar.
export function AnimatedStatValue({ value, durationMs = 1200 }: { value: string; durationMs?: number }) {
  const match = value.match(NUMBER_PATTERN);
  const ref = useRef<HTMLSpanElement>(null);
  const [display, setDisplay] = useState(match ? "0" : value);

  useEffect(() => {
    if (!match || !ref.current) return;
    const [, prefix, digits, suffix] = match;
    const target = parseInt(digits, 10);

    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    let started = false;
    const observer = new IntersectionObserver(
      (entries) => {
        if (!entries[0].isIntersecting || started) return;
        started = true;
        observer.disconnect();

        if (reducedMotion) {
          setDisplay(value);
          return;
        }

        const start = performance.now();
        function tick(now: number) {
          const progress = Math.min(1, (now - start) / durationMs);
          const current = Math.round(progress * target);
          setDisplay(`${prefix}${current}${suffix}`);
          if (progress < 1) requestAnimationFrame(tick);
        }
        requestAnimationFrame(tick);
      },
      { threshold: 0.4 }
    );
    observer.observe(ref.current);
    return () => observer.disconnect();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value]);

  return <span ref={ref}>{display}</span>;
}
