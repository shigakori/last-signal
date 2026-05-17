"use client";

import { useRef, useState, useEffect } from "react";
import gsap from "gsap";
import { useLenis } from "lenis/react";

import "./Preloader.css";

export let isInitialLoad = true;

const BLOCK_SIZE_DESKTOP = 120;
const BLOCK_SIZE_MOBILE = 80;
const MOBILE_BREAKPOINT = 1000;

const PATH =
  "M0.00,223.62 C13.97,230.86 57.27,254.22 83.80,267.09 C110.33,279.96 126.47,302.27 159.17,300.85 C191.88,299.43 247.15,262.25 280.04,258.58 C312.92,254.91 329.78,276.72 356.48,278.83 C383.18,280.95 415.17,276.23 440.25,271.27 C465.32,266.31 479.47,257.02 506.93,249.06 C534.39,241.10 578.81,233.75 604.99,223.48 C631.16,213.22 634.84,199.17 663.99,187.49 C693.14,175.81 750.43,161.40 779.90,153.40 C809.37,145.40 811.78,139.68 840.80,139.48 C869.82,139.27 928.46,154.71 953.99,152.19 C979.53,149.66 963.87,124.04 994.01,124.35 C1024.15,124.66 1099.27,154.32 1134.83,154.04 C1170.39,153.77 1179.34,123.19 1207.34,122.70 C1235.33,122.21 1275.00,148.47 1302.79,151.09 C1330.59,153.70 1351.23,144.47 1374.10,138.39 C1396.97,132.31 1429.02,118.57 1440.00,114.61";

const DELAY = 0.5;
const BASE_IN = 1;
const GAP_AFTER_BASE = 0.25;
const FILL_IN = 3;
const GAP_AFTER_FILL = 0.25;
const BOTH_OUT = 1.5;
const BLOCKS_OUT = 0.55;
const BLOCK_STAGGER = 0.045;

export default function Preloader() {
  const wrapperRef = useRef(null);
  const timelineRef = useRef(null);
  const startedRef = useRef(false);
  const [showPreloader, setShowPreloader] = useState(isInitialLoad);
  const [loaderAnimating, setLoaderAnimating] = useState(isInitialLoad);
  const lenis = useLenis();

  useEffect(() => {
    return () => {
      isInitialLoad = false;
    };
  }, []);

  useEffect(() => {
    if (loaderAnimating) {
      document.documentElement.classList.add("is-preloading");
      lenis?.stop();
    } else {
      document.documentElement.classList.remove("is-preloading");
      lenis?.start();
    }
  }, [lenis, loaderAnimating]);

  useEffect(() => {
    if (!showPreloader || startedRef.current) return;

    const root = wrapperRef.current;
    if (!root) return;

    startedRef.current = true;

    const blocksEl = root.querySelector(".preloader-blocks");
    const svgEl = root.querySelector(".preloader-svg");
    const base = root.querySelector(".preloader-path-base");
    const fill = root.querySelector(".preloader-path-fill");

    if (!blocksEl || !svgEl || !base || !fill) {
      startedRef.current = false;
      return;
    }

    const blockSize =
      window.innerWidth < MOBILE_BREAKPOINT
        ? BLOCK_SIZE_MOBILE
        : BLOCK_SIZE_DESKTOP;

    const cols = Math.ceil(window.innerWidth / blockSize);
    const rows = Math.ceil(window.innerHeight / blockSize);

    blocksEl.innerHTML = "";
    blocksEl.style.setProperty("--preloader-columns", String(cols));
    blocksEl.style.setProperty("--preloader-block-size", `${blockSize}px`);

    const cells = [];
    for (let r = 0; r < rows; r += 1) {
      for (let c = 0; c < cols; c += 1) {
        const cell = document.createElement("div");
        cell.className = "preloader-cell";
        blocksEl.appendChild(cell);
        cells.push(cell);
      }
    }

    gsap.set(cells, { scale: 1, transformOrigin: "50% 50%", force3D: true });
    gsap.set(root, { opacity: 1 });

    const pathLength = base.getTotalLength();
    const dashStr = `${pathLength} ${pathLength}`;

    gsap.set(base, { strokeDasharray: dashStr, strokeDashoffset: pathLength });
    gsap.set(fill, {
      strokeDasharray: dashStr,
      strokeDashoffset: pathLength,
      opacity: 0,
    });
    gsap.set(svgEl, { visibility: "visible" });

    const tl = gsap.timeline({
      delay: DELAY,
      onComplete: () => {
        gsap.to(root, {
          opacity: 0,
          duration: 0.35,
          ease: "power2.inOut",
          onComplete: () => {
            setLoaderAnimating(false);
            setShowPreloader(false);
          },
        });
      },
    });

    tl.to(base, {
      strokeDashoffset: 0,
      duration: BASE_IN,
      ease: "power1.inOut",
      onComplete: () => {
        gsap.set(fill, { opacity: 1 });
      },
    })
      .to(
        fill,
        {
          strokeDashoffset: 0,
          opacity: 1,
          duration: FILL_IN,
          ease: "power2.inOut",
        },
        `+=${GAP_AFTER_BASE}`,
      )
      .to(
        base,
        {
          strokeDashoffset: -pathLength,
          duration: BOTH_OUT,
          ease: "power2.inOut",
        },
        `+=${GAP_AFTER_FILL}`,
      )
      .to(
        fill,
        {
          strokeDashoffset: -pathLength,
          duration: BOTH_OUT,
          ease: "power2.inOut",
        },
        "<",
      )
      .set(svgEl, { visibility: "hidden" })
      .to(cells, {
        scale: 0,
        duration: BLOCKS_OUT,
        ease: "power3.inOut",
        stagger: {
          grid: [rows, cols],
          from: "center",
          each: BLOCK_STAGGER,
        },
      });

    timelineRef.current = tl;

    return () => {
      timelineRef.current?.kill();
      timelineRef.current = null;
    };
  }, [showPreloader]);

  if (!showPreloader) return null;

  return (
    <div className="preloader" ref={wrapperRef}>
      <div className="preloader-blocks" aria-hidden />
      <div className="preloader-inner">
        <svg
          className="preloader-svg"
          viewBox="0 0 1440 500"
          preserveAspectRatio="xMidYMid slice"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path className="preloader-path-base" d={PATH} fill="none" />
          <path className="preloader-path-fill" d={PATH} fill="none" />
        </svg>
      </div>
    </div>
  );
}
