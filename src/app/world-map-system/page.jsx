"use client";

import { useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import styles from "./world-map-system.module.css";

gsap.registerPlugin(ScrollTrigger);

const SECTORS = [
  {
    id: "SECTOR_01",
    x: 12,
    y: 43,
    coordinates: "N 48.13 / W 11.58",
    status: "ARCHIVED",
    signal: 82,
  },
  {
    id: "SECTOR_02",
    x: 32,
    y: 27,
    coordinates: "N 35.68 / E 139.69",
    status: "SCANNING",
    signal: 64,
  },
  {
    id: "SECTOR_03",
    x: 50,
    y: 41,
    coordinates: "S 33.86 / E 151.21",
    status: "UNSTABLE",
    signal: 41,
  },
  {
    id: "SECTOR_04",
    x: 67,
    y: 30,
    coordinates: "N 40.71 / W 74.00",
    status: "ARCHIVED",
    signal: 77,
  },
  {
    id: "SECTOR_05",
    x: 85,
    y: 47,
    coordinates: "N 1.29 / E 103.85",
    status: "DORMANT",
    signal: 23,
  },
  {
    id: "SECTOR_06",
    x: 24,
    y: 63,
    coordinates: "S 23.55 / W 46.63",
    status: "SYNCING",
    signal: 56,
  },
];

const SECTOR_TOUR_STOPS = [0.192, 0.346, 0.5, 0.654, 0.808, 0.923];

function angleToSector(sector) {
  const dx = sector.x - 50;
  const dy = sector.y - 50;
  return (Math.atan2(dy, dx) * 180) / Math.PI + 90;
}

function clamp(value, min, max) {
  return Math.min(max, Math.max(min, value));
}

function smoothstep(t) {
  return t * t * (3 - 2 * t);
}

function samplePath(points, t) {
  if (points.length < 2) return points[0];

  const clamped = clamp(t, 0, 1);
  const segmentFloat = clamped * (points.length - 1);
  const i = Math.min(points.length - 2, Math.floor(segmentFloat));
  const localT = smoothstep(segmentFloat - i);
  const a = points[i];
  const b = points[i + 1];

  return {
    x: a.x + (b.x - a.x) * localT,
    y: a.y + (b.y - a.y) * localT,
    scale: a.scale + (b.scale - a.scale) * localT,
  };
}

function formatAzimuth(angle) {
  const normalized = ((Math.round(angle) % 360) + 360) % 360;
  return `${String(normalized).padStart(3, "0")}°`;
}

function estimateRangeKm(sector) {
  const dx = sector.x - 50;
  const dy = sector.y - 50;
  return Math.round(Math.sqrt(dx * dx + dy * dy) * 82 + 240);
}

const COMPASS_TICKS = Array.from({ length: 24 }, (_, i) => i);

export default function WorldMapSystemPage() {
  const pageRef = useRef(null);
  const mapWorldRef = useRef(null);
  const fogNearRef = useRef(null);
  const fogFarRef = useRef(null);
  const compassNeedleRef = useRef(null);
  const compassDriftRef = useRef(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const [scrollPercent, setScrollPercent] = useState(0);
  const [compassMode, setCompassMode] = useState("NAV");
  const [compassAzimuth, setCompassAzimuth] = useState("000°");
  const [compassRangeKm, setCompassRangeKm] = useState(0);

  const activeSector = SECTORS[activeIndex];

  const handleSectorClick = (idx) => {
    const root = pageRef.current;
    if (!root) return;

    const sectionTop = window.scrollY + root.getBoundingClientRect().top;
    const scrollableDistance = root.offsetHeight - window.innerHeight;
    if (scrollableDistance <= 0) return;

    const targetProgress = clamp(0.04 + SECTOR_TOUR_STOPS[idx] * 0.93, 0, 1);
    const targetY = sectionTop + scrollableDistance * targetProgress;

    setActiveIndex(idx);
    window.scrollTo({
      top: targetY,
      behavior: "smooth",
    });
  };

  useGSAP(
    () => {
      const root = pageRef.current;
      if (!root) return;

      gsap.set([fogNearRef.current, fogFarRef.current], {
        xPercent: -1.2,
        yPercent: -1.2,
      });

      gsap.to(fogNearRef.current, {
        xPercent: 1.6,
        yPercent: 0.7,
        duration: 14,
        ease: "sine.inOut",
        repeat: -1,
        yoyo: true,
      });

      gsap.to(fogFarRef.current, {
        xPercent: 2.3,
        yPercent: 1.4,
        duration: 18,
        ease: "sine.inOut",
        repeat: -1,
        yoyo: true,
      });

      const path = [
        { x: 50, y: 50, scale: 1.0 },
        { x: 50, y: 50, scale: 1.0 },
        { x: 12, y: 43, scale: 1.28 },
        { x: 12, y: 43, scale: 1.32 },
        { x: 32, y: 27, scale: 1.34 },
        { x: 32, y: 27, scale: 1.38 },
        { x: 50, y: 41, scale: 1.36 },
        { x: 50, y: 41, scale: 1.4 },
        { x: 67, y: 30, scale: 1.34 },
        { x: 67, y: 30, scale: 1.38 },
        { x: 85, y: 47, scale: 1.38 },
        { x: 85, y: 47, scale: 1.42 },
        { x: 24, y: 63, scale: 1.32 },
        { x: 24, y: 63, scale: 1.36 },
      ];

      const trigger = ScrollTrigger.create({
        trigger: root,
        start: "top top",
        end: "bottom bottom",
        scrub: 2.4,
        onUpdate: (self) => {
          const progress = self.progress;
          setScrollPercent(progress);

          const tourProgress = clamp((progress - 0.04) / 0.93, 0, 1);
          const sampled = samplePath(path, tourProgress);
          const currentSectorIndex = clamp(Math.round(tourProgress * (SECTORS.length - 1)), 0, SECTORS.length - 1);
          setActiveIndex(currentSectorIndex);

          gsap.set(mapWorldRef.current, {
            xPercent: (50 - sampled.x) * 1.35,
            yPercent: (50 - sampled.y) * 1.15,
            scale: sampled.scale,
            transformOrigin: "50% 50%",
          });

          const targetAngle =
            angleToSector(SECTORS[currentSectorIndex]) +
            tourProgress * 62 +
            (sampled.scale - 1) * 16;
          const driftAngle = targetAngle - 6 - Math.sin(tourProgress * Math.PI * 4) * 1.6;
          const phase = tourProgress * (SECTORS.length - 1);
          const lockDistance = Math.abs(phase - Math.round(phase));
          const nextMode =
            tourProgress < 0.06 ? "NAV" : lockDistance < 0.12 ? "LOCK" : "TRACK";

          setCompassMode(nextMode);
          setCompassAzimuth(formatAzimuth(targetAngle));
          setCompassRangeKm(estimateRangeKm(SECTORS[currentSectorIndex]));

          gsap.to(compassNeedleRef.current, {
            rotate: targetAngle,
            transformOrigin: "50% 50%",
            duration: 0.6,
            ease: "power3.out",
            overwrite: "auto",
          });

          gsap.to(compassDriftRef.current, {
            rotate: driftAngle,
            transformOrigin: "50% 50%",
            duration: 1.4,
            ease: "power2.out",
            overwrite: "auto",
          });
        },
      });

      return () => trigger.kill();
    },
    { scope: pageRef },
  );

  return (
    <section className={styles.worldMapSystem} ref={pageRef}>
      <div className={styles.overlay}>
        <p className={styles.kicker}>WORLD MAP SYSTEM / ARCHIVE NODE</p>
        <div className={styles.overlayGrid}>
          <div>
            <p className={styles.label}>ACTIVE SECTOR</p>
            <p className={styles.value}>{activeSector.id}</p>
          </div>
          <div>
            <p className={styles.label}>COORDINATES</p>
            <p className={styles.value}>{activeSector.coordinates}</p>
          </div>
          <div>
            <p className={styles.label}>STATUS</p>
            <p className={styles.value}>{activeSector.status}</p>
          </div>
          <div>
            <p className={styles.label}>SIGNAL</p>
            <p className={styles.value}>{activeSector.signal}%</p>
          </div>
          <div>
            <p className={styles.label}>ARCHIVE SYNC</p>
            <p className={styles.value}>{Math.round(62 + scrollPercent * 35)}%</p>
          </div>
        </div>
      </div>

      <div className={styles.viewport}>
        <div className={styles.mapLayer}>
          <div className={styles.gridFine} />
          <div className={styles.gridWide} />
          <div className={styles.crosshairH} />
          <div className={styles.crosshairV} />
          <div className={styles.mapWorld} ref={mapWorldRef}>
            <svg className={styles.mapCanvas} viewBox="0 0 1200 760" aria-hidden />

            {SECTORS.map((sector, idx) => {
              const isActive = idx === activeIndex;
              const isInactive = sector.signal < 35;

              return (
                <button
                  key={sector.id}
                  type="button"
                  className={`${styles.sector} ${isActive ? styles.active : ""} ${
                    isInactive ? styles.inactive : ""
                  }`}
                  style={{ left: `${sector.x}%`, top: `${sector.y}%` }}
                  onClick={() => handleSectorClick(idx)}
                  aria-label={`Focus ${sector.id}`}
                >
                  <span className={styles.sectorDot} />
                  <span className={styles.sectorPulse} />
                  <span className={styles.sectorId}>{sector.id}</span>
                </button>
              );
            })}
          </div>

          <div className={styles.fogNear} ref={fogNearRef} />
          <div className={styles.fogFar} ref={fogFarRef} />
          <div className={styles.grain} />

          <svg className={styles.compass} viewBox="0 0 260 260" aria-hidden>
            <circle cx="130" cy="130" r="118" className={styles.compassRing} />
            <circle cx="130" cy="130" r="94" className={styles.compassRingThin} />
            <circle cx="130" cy="130" r="70" className={styles.compassRingInner} />
            {COMPASS_TICKS.map((tick) => {
              const angle = tick * 15;
              const long = tick % 6 === 0;
              const start = long ? 18 : 24;
              const end = long ? 30 : 28;
              const r = (angle * Math.PI) / 180;
              const x1 = 130 + Math.sin(r) * (130 - start);
              const y1 = 130 - Math.cos(r) * (130 - start);
              const x2 = 130 + Math.sin(r) * (130 - end);
              const y2 = 130 - Math.cos(r) * (130 - end);
              return (
                <line
                  key={`compass-tick-${tick}`}
                  x1={x1}
                  y1={y1}
                  x2={x2}
                  y2={y2}
                  className={`${styles.compassTick} ${long ? styles.compassTickLong : ""}`}
                />
              );
            })}
            <line x1="130" y1="130" x2="130" y2="20" className={styles.compassTrueNorth} />
            <g ref={compassDriftRef}>
              <line x1="130" y1="130" x2="130" y2="52" className={styles.compassDriftLine} />
            </g>
            <g ref={compassNeedleRef}>
              <line
                x1="130"
                y1="130"
                x2="130"
                y2="40"
                className={styles.compassNeedle}
              />
              <line
                x1="130"
                y1="130"
                x2="130"
                y2="176"
                className={styles.compassNeedleTail}
              />
              <circle cx="130" cy="130" r="6" className={styles.compassCore} />
            </g>
            <text x="130" y="24" className={styles.compassLabel}>
              N
            </text>
            <text x="240" y="136" className={styles.compassLabel}>
              E
            </text>
            <text x="130" y="252" className={styles.compassLabel}>
              S
            </text>
            <text x="18" y="136" className={styles.compassLabel}>
              W
            </text>
            <text x="130" y="114" className={styles.compassReadoutLabel}>
              {compassMode}
            </text>
            <text x="130" y="156" className={styles.compassReadoutValue}>
              {compassAzimuth}
            </text>
            <text x="130" y="174" className={styles.compassReadoutSmall}>
              RNG {compassRangeKm} KM
            </text>
          </svg>
        </div>
      </div>

    </section>
  );
}
