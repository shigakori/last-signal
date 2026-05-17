"use client";

import { useRef, useEffect, useCallback } from "react";
import { TransitionRouter } from "next-transition-router";
import gsap from "gsap";

const BLOCK_SIZE_DESKTOP = 120;
const BLOCK_SIZE_MOBILE = 80;
const MOBILE_BREAKPOINT = 1000;

export default function TransitionProvider({ children }) {
  const overlayRef = useRef(null);
  const cellsRef = useRef([]);
  const gridRef = useRef({ rows: 0, cols: 0 });

  const buildGrid = useCallback(() => {
    if (!overlayRef.current) return;

    const overlay = overlayRef.current;
    overlay.innerHTML = "";
    cellsRef.current = [];

    const blockSize =
      window.innerWidth < MOBILE_BREAKPOINT
        ? BLOCK_SIZE_MOBILE
        : BLOCK_SIZE_DESKTOP;

    const cols = Math.ceil(window.innerWidth / blockSize);
    const rows = Math.ceil(window.innerHeight / blockSize);

    gridRef.current = { rows, cols };
    overlay.style.setProperty("--transition-columns", cols);
    overlay.style.setProperty("--transition-block-size", `${blockSize}px`);

    for (let row = 0; row < rows; row++) {
      for (let col = 0; col < cols; col++) {
        const cell = document.createElement("div");
        cell.className = "transition-cell";
        overlay.appendChild(cell);
        cellsRef.current.push({ el: cell, row, col });
      }
    }

    gsap.set(
      cellsRef.current.map((c) => c.el),
      { scale: 0, willChange: "transform" },
    );
  }, []);

  useEffect(() => {
    buildGrid();

    let resizeTimer;
    const handleResize = () => {
      clearTimeout(resizeTimer);
      resizeTimer = setTimeout(buildGrid, 250);
    };

    window.addEventListener("resize", handleResize);
    return () => {
      clearTimeout(resizeTimer);
      window.removeEventListener("resize", handleResize);
    };
  }, [buildGrid]);

  return (
    <TransitionRouter
      auto
      leave={(next) => {
        const els = cellsRef.current.map((c) => c.el);
        const { rows, cols } = gridRef.current;

        gsap.set(overlayRef.current, { visibility: "visible" });

        const tl = gsap.timeline({ onComplete: next });

        tl.fromTo(
          els,
          { scale: 0 },
          {
            scale: 1.05,
            duration: 0.5,
            ease: "power2.inOut",
            stagger: {
              grid: [rows, cols],
              from: "center",
              each: 0.05,
            },
          },
        );

        return () => tl.kill();
      }}
      enter={(next) => {
        const els = cellsRef.current.map((c) => c.el);
        const { rows, cols } = gridRef.current;

        const tl = gsap.timeline({
          delay: 0.1,
          onComplete: () => {
            gsap.set(overlayRef.current, { visibility: "hidden" });
            next();
          },
        });

        tl.fromTo(
          els,
          { scale: 1.05 },
          {
            scale: 0,
            duration: 0.5,
            ease: "power2.inOut",
            stagger: {
              grid: [rows, cols],
              from: "center",
              each: 0.05,
            },
          },
        );

        return () => tl.kill();
      }}
    >
      <div ref={overlayRef} className="transition-overlay" />
      {children}
    </TransitionRouter>
  );
}
