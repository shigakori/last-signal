"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";

import {
  getLinkTextTarget,
  mountGlitchText,
  playGlitch,
  resetGlitch,
} from "@/lib/glitchText";

import "./GlitchLinks.css";

const SKIP_SELECTOR =
  'a[href^="#"]:empty, a:not([href]), a[data-glitch-skip]';

function shouldBindLink(link) {
  if (!link?.href || link.matches(SKIP_SELECTOR)) return false;
  if (link.closest("[data-glitch-skip]")) return false;
  if (link.querySelector("img") && !link.textContent.trim()) return false;
  return Boolean(getLinkTextTarget(link));
}

function bindLink(link) {
  if (link.dataset.glitchBound === "true") return;
  if (!shouldBindLink(link)) return;

  const target = getLinkTextTarget(link);
  if (!target) return;

  if (!target.dataset.glitchMounted) {
    const sourceText = target.textContent;
    mountGlitchText(target, sourceText);
  }

  const onEnter = () => playGlitch(target);
  const onLeave = () => resetGlitch(target);

  link.addEventListener("mouseenter", onEnter);
  link.addEventListener("mouseleave", onLeave);
  link.addEventListener("focusin", onEnter);
  link.addEventListener("focusout", onLeave);

  link.dataset.glitchBound = "true";
  link._glitchCleanup = () => {
    link.removeEventListener("mouseenter", onEnter);
    link.removeEventListener("mouseleave", onLeave);
    link.removeEventListener("focusin", onEnter);
    link.removeEventListener("focusout", onLeave);
    resetGlitch(target);
    delete link.dataset.glitchBound;
    delete link._glitchCleanup;
  };
}

function scanLinks(root = document) {
  root.querySelectorAll("a[href]").forEach((link) => {
    if (link.isConnected) bindLink(link);
  });
}

export default function GlitchLinks() {
  const pathname = usePathname();

  useEffect(() => {
    let debounceId = 0;

    const scheduleScan = () => {
      window.clearTimeout(debounceId);
      debounceId = window.setTimeout(() => scanLinks(), 60);
    };

    scheduleScan();

    const observer = new MutationObserver(scheduleScan);
    observer.observe(document.body, { childList: true, subtree: true });

    return () => {
      window.clearTimeout(debounceId);
      observer.disconnect();
      document.querySelectorAll("a[data-glitch-bound='true']").forEach((link) => {
        link._glitchCleanup?.();
      });
    };
  }, [pathname]);

  return null;
}
