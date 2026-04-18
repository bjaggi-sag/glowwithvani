"use client";

import { useEffect, useRef, useState } from "react";

export function Reveal({
  children,
  className = "",
  threshold = 0.16,
  rootMargin = "0px 0px -8% 0px"
}: Readonly<{
  children: React.ReactNode;
  className?: string;
  threshold?: number;
  rootMargin?: string;
}>) {
  const ref = useRef<HTMLDivElement | null>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const element = ref.current;

    if (!element) {
      return;
    }

    const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");

    if (mediaQuery.matches) {
      setIsVisible(true);
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        const [entry] = entries;

        if (entry?.isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      {
        threshold,
        rootMargin
      }
    );

    observer.observe(element);

    return () => {
      observer.disconnect();
    };
  }, [rootMargin, threshold]);

  return (
    <div ref={ref} className={`reveal${isVisible ? " is-visible" : ""}${className ? ` ${className}` : ""}`}>
      {children}
    </div>
  );
}
