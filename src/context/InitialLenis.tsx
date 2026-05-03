"use client";

import Lenis from "lenis";
import { useEffect, useRef, ReactNode } from "react";

interface SmoothScrollWrapperProps {
  children: ReactNode;
}

const SmoothScrollWrapper = ({ children }: SmoothScrollWrapperProps) => {
  const lenisRef = useRef<Lenis | null>(null);

  useEffect(() => {
    const lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
    });

    lenisRef.current = lenis;
    let rafId: number;

    const raf = (time: number) => {
      lenis.raf(time);
      rafId = requestAnimationFrame(raf);
    };

    rafId = requestAnimationFrame(raf);

    return () => {
      cancelAnimationFrame(rafId);
      lenis.destroy();
    };
  }, []);

  return <div>{children}</div>;
};

export default SmoothScrollWrapper;
