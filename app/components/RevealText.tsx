"use client";

import { useEffect, useRef, useState } from "react";

export function RevealText({ text, className = "" }: { text: string; className?: string }) {
  const ref = useRef<HTMLHeadingElement>(null);
  const [visible, setVisible] = useState(false);
  const [reduceMotion, setReduceMotion] = useState(false);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setReduceMotion(true);
      setVisible(true);
      return;
    }
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.3 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  if (reduceMotion) {
    return <h1 className={className}>{text}</h1>;
  }

  const words = text.split(" ");

  return (
    <h1 ref={ref} className={className}>
      {words.map((word, idx) => (
        <span key={idx} className="inline-block overflow-hidden mr-[0.28em] align-top">
          <span
            className="inline-block transition-transform duration-[900ms] ease-out"
            style={{
              transitionDelay: `${idx * 55}ms`,
              transform: visible ? "translateY(0%)" : "translateY(110%)",
            }}
          >
            {word}
          </span>
        </span>
      ))}
    </h1>
  );
}
