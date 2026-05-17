"use client";

import { useEffect, useState, useRef } from "react";
import { usePathname } from "next/navigation";
import { ReactLenis } from "lenis/react";
import Menu from "./components/Menu/Menu";
import Footer from "./components/Footer/Footer";
import CinematicAtmosphere from "./components/CinematicAtmosphere/CinematicAtmosphere";
import HeroTacticalTelemetry from "./components/HeroTacticalTelemetry/HeroTacticalTelemetry";
import GlitchLinks from "./components/GlitchLinks/GlitchLinks";
import LenisScrollSync from "./components/LenisScrollSync/LenisScrollSync";
import TransitionProvider from "./providers/TransitionProvider";

const MOBILE_BREAKPOINT = 1000;
const FOOTER_EXCLUDED_ROUTES = ["/catalog", "/chronicles"];

const LENIS_EASING = (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t));

const LENIS_SHARED = {
  easing: LENIS_EASING,
  direction: "vertical",
  gestureDirection: "vertical",
  smooth: true,
  infinite: false,
  wheelMultiplier: 1,
  orientation: "vertical",
  smoothWheel: true,
  syncTouch: true,
  /** raf через gsap.ticker в LenisScrollSync */
  autoRaf: false,
};

const LENIS_MOBILE = {
  ...LENIS_SHARED,
  duration: 0.8,
  smoothTouch: true,
  touchMultiplier: 1.5,
  lerp: 0.09,
};

const LENIS_DESKTOP = {
  ...LENIS_SHARED,
  duration: 1.2,
  smoothTouch: false,
  touchMultiplier: 2,
  lerp: 0.1,
};

export default function ClientLayout({ children }) {
  const pageRef = useRef(null);
  const pageWrapperRef = useRef(null);
  const pathname = usePathname();

  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const handleResize = () =>
      setIsMobile(window.innerWidth <= MOBILE_BREAKPOINT);
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const lenisOptions = isMobile ? LENIS_MOBILE : LENIS_DESKTOP;
  const showFooter = !FOOTER_EXCLUDED_ROUTES.includes(pathname);

  return (
    <TransitionProvider>
      <ReactLenis root options={lenisOptions}>
        <LenisScrollSync />
        <div className="page" ref={pageRef}>
          <CinematicAtmosphere />
          <HeroTacticalTelemetry />
          <GlitchLinks />
          <Menu />
          <div className="page-wrapper" ref={pageWrapperRef}>
            {children}
            {showFooter && <Footer />}
          </div>
        </div>
      </ReactLenis>
    </TransitionProvider>
  );
}
