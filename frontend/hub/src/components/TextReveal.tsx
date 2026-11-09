"use client";

import { useEffect, useRef, useState } from "react";

interface TextRevealProps {
  text: string;
  className?: string;
}

export default function TextReveal({ text, className = "" }: TextRevealProps) {
  const [visible, setVisible] = useState(false);
  const ref = useRef<HTMLSpanElement>(null);
  const words = text.split(" ");

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (typeof IntersectionObserver === "undefined") {
      setVisible(true);
      return;
    }
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          observer.unobserve(el);
        }
      },
      { threshold: 0.1 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <span ref={ref} className={className} aria-label={text}>
      {words.map((word, i) => (
        <span
          key={i}
          className="inline-block"
          style={{
            animation: visible ? `textReveal 0.6s cubic-bezier(0.16, 1, 0.3, 1) forwards` : "none",
            animationDelay: visible ? `${i * 80}ms` : "0ms",
            opacity: visible ? undefined : 0,
            transform: visible ? undefined : "translateY(20px)",
          }}
        >
          {word}
          {i < words.length - 1 ? "\u00A0" : ""}
        </span>
      ))}
    </span>
  );
}
