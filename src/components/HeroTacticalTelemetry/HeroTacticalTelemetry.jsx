"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { useLenis } from "lenis/react";

import "./HeroTacticalTelemetry.css";

function padInt(n, digits) {
  const v = Math.round(Math.max(0, n));
  return String(v).padStart(digits, "0");
}

function formatWinPct(p) {
  const safe = Number.isFinite(p) ? Math.min(100, Math.max(0, p)) : 0;
  const [intPart, dec] = safe.toFixed(1).split(".");
  return `${intPart.padStart(3, "0")}.${dec}`;
}

function formatSignedPx(value) {
  const n = Math.round(value);
  const sign = n < 0 ? "−" : "+";
  return `${sign}${String(Math.abs(n)).padStart(5, "0")}`;
}

export default function HeroTacticalTelemetry() {
  const lenis = useLenis();
  const [scrollPx, setScrollPx] = useState(0);
  const [scrollPct, setScrollPct] = useState(0);
  const [mx, setMx] = useState(0);
  const [my, setMy] = useState(0);

  const mouseRaf = useRef(0);
  const pendingMouse = useRef({ x: 0, y: 0 });

  const flushMouse = useCallback(() => {
    mouseRaf.current = 0;
    const { x, y } = pendingMouse.current;
    setMx(x);
    setMy(y);
  }, []);

  const onMouseMove = useCallback(
    (e) => {
      pendingMouse.current = { x: e.clientX, y: e.clientY };
      if (!mouseRaf.current) {
        mouseRaf.current = requestAnimationFrame(flushMouse);
      }
    },
    [flushMouse],
  );

  useEffect(() => {
    window.addEventListener("mousemove", onMouseMove, { passive: true });
    return () => {
      window.removeEventListener("mousemove", onMouseMove);
      if (mouseRaf.current) cancelAnimationFrame(mouseRaf.current);
    };
  }, [onMouseMove]);

  useEffect(() => {
    const read = (l) => {
      setScrollPx(l.scroll);
      const pct = l.limit > 0 ? (l.scroll / l.limit) * 100 : 0;
      setScrollPct(Number.isFinite(pct) ? pct : 0);
    };

    if (lenis) {
      read(lenis);
      const unsub = lenis.on("scroll", read);
      return () => unsub();
    }

    const onScroll = () => {
      const y = window.scrollY ?? document.documentElement.scrollTop ?? 0;
      const doc = document.documentElement;
      const max = Math.max(0, doc.scrollHeight - window.innerHeight);
      setScrollPx(y);
      setScrollPct(max > 0 ? (y / max) * 100 : 0);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [lenis]);

  return (
    <aside className="site-telemetry" aria-hidden="true">
      <span className="site-telemetry__side">
        <span className="site-telemetry__k">Z</span>
        <span className="site-telemetry__v">{formatSignedPx(scrollPx)}</span>
        <span className="site-telemetry__u">px</span>
      </span>

      <span className="site-telemetry__corner site-telemetry__corner--br">
        <span className="site-telemetry__k">X</span>
        <span className="site-telemetry__v">{padInt(mx, 4)}</span>
        <span className="site-telemetry__u">px</span>
        <span className="site-telemetry__sep" />
        <span className="site-telemetry__k">Y</span>
        <span className="site-telemetry__v">{padInt(my, 4)}</span>
        <span className="site-telemetry__u">px</span>
      </span>

      <span className="site-telemetry__corner site-telemetry__corner--bl">
        <span className="site-telemetry__k">WIN</span>
        <span className="site-telemetry__v">{formatWinPct(scrollPct)}</span>
      </span>
    </aside>
  );
}
