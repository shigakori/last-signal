"use client";

import { useSyncExternalStore } from "react";

import "./CinematicAtmosphere.css";

function subscribeReducedMotion(callback) {
  if (typeof window === "undefined") return () => {};
  const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
  mq.addEventListener("change", callback);
  return () => mq.removeEventListener("change", callback);
}

function getReducedMotionSnapshot() {
  if (typeof window === "undefined") return false;
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

function getReducedMotionServerSnapshot() {
  return false;
}

export default function CinematicAtmosphere() {
  const reduceMotion = useSyncExternalStore(
    subscribeReducedMotion,
    getReducedMotionSnapshot,
    getReducedMotionServerSnapshot,
  );

  const reducedClass = reduceMotion ? " cinematic-atmosphere--reduced" : "";

  return (
    <>
      <div
        className={`cinematic-atmosphere cinematic-atmosphere--back${reducedClass}`}
        aria-hidden="true"
      >
        <div className="cinematic-atmosphere__vignette" />
        <div className="cinematic-atmosphere__scanlines" />
        <div className="cinematic-atmosphere__grid" />
      </div>
      <div
        className={`cinematic-atmosphere cinematic-atmosphere--front${reducedClass}`}
        aria-hidden="true"
      >
        <div className="cinematic-atmosphere__grain" />
        <div className="cinematic-atmosphere__noise" />
        <div className="cinematic-atmosphere__dust-stack">
          <span className="cinematic-atmosphere__dust-swarm cinematic-atmosphere__dust-swarm--a" />
          <span className="cinematic-atmosphere__dust-swarm cinematic-atmosphere__dust-swarm--b" />
          <span className="cinematic-atmosphere__dust-swarm cinematic-atmosphere__dust-swarm--c" />
        </div>
      </div>
    </>
  );
}
