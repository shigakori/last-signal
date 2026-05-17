"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";
import { ScrollTrigger } from "gsap/ScrollTrigger";

/** Пересчёт триггеров после смены страницы и ресайза (нативный скролл). */
export default function ScrollTriggerRefresh() {
  const pathname = usePathname();

  useEffect(() => {
    const refresh = () => ScrollTrigger.refresh(true);

    const id = window.setTimeout(refresh, 150);
    window.addEventListener("resize", refresh);

    return () => {
      window.clearTimeout(id);
      window.removeEventListener("resize", refresh);
    };
  }, [pathname]);

  return null;
}
