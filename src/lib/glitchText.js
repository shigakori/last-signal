import gsap from "gsap";

const GLITCH_LETTERS = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
const GLITCH_SPACE = "·";

const charBySpan = new WeakMap();
const timelineByHost = new WeakMap();

export function isWhitespace(char) {
  return (
    char === " " ||
    char === "\u00A0" ||
    char === "\t" ||
    char === "\n" ||
    char === "\u200b" ||
    char === "\ufeff"
  );
}

export function toDisplayChar(char) {
  if (char === "\u200b" || char === "\ufeff") return "";
  return isWhitespace(char) ? "\u00A0" : char;
}

/** Unicode-safe split — avoids surrogate-pair bugs from .split("") */
export function parseText(text) {
  return Array.from(String(text ?? ""))
    .map(toDisplayChar)
    .filter((c) => c !== "");
}

/** Символ надёжно храним: полный URI-encoded + code point для латиницы */
function setSpanCharMeta(span, char) {
  try {
    span.dataset.glitchEnc = encodeURIComponent(char);
  } catch {
    /* ignore */
  }
  const single = [...char];
  const cp0 = single[0]?.codePointAt(0);
  if (cp0 !== undefined && single.length === 1) {
    span.dataset.glitchCp = String(cp0);
  }
  charBySpan.set(span, char);
}

function readSpanChar(span) {
  if (span?.dataset?.glitchEnc) {
    try {
      return decodeURIComponent(span.dataset.glitchEnc);
    } catch {
      /* fall through */
    }
  }
  const fromCp = span?.dataset?.glitchCp;
  if (fromCp !== undefined && fromCp !== "") {
    const n = Number.parseInt(fromCp, 10);
    if (!Number.isNaN(n)) {
      try {
        return String.fromCodePoint(n);
      } catch {
        /* fall through */
      }
    }
  }
  return charBySpan.get(span);
}

export function isGlitchMounted(host) {
  return Boolean(host?.dataset?.glitchMounted);
}

export function unmountGlitchText(host) {
  if (!host) return;
  delete host.dataset.glitchMounted;
  delete host.dataset.glitchSnapshot;
  host.classList.remove("glitch-text-host");
  host._glitchSpans = undefined;
  host.textContent = "";
}

export function mountGlitchText(host, sourceText) {
  if (!host) return null;

  const raw = String(sourceText ?? host.textContent ?? "");
  if (!raw.trim()) return null;

  if (isGlitchMounted(host) && host.querySelector(".glitch-char")) {
    return host;
  }

  if (isGlitchMounted(host)) {
    unmountGlitchText(host);
  }

  const chars = parseText(raw);
  if (!chars.length) return null;

  const snapshot = chars.join("");

  host.textContent = "";
  host.dataset.glitchMounted = "true";
  host.dataset.glitchSnapshot = snapshot;
  host.classList.add("glitch-text-host");

  const spans = chars.map((char) => {
    const span = document.createElement("span");
    span.className = "glitch-char";
    if (isWhitespace(char)) span.classList.add("glitch-char--space");
    setSpanCharMeta(span, char);
    span.textContent = char;
    return span;
  });

  spans.forEach((span) => host.appendChild(span));
  host._glitchSpans = spans;

  return host;
}

function killTimeline(host) {
  const tl = timelineByHost.get(host);
  if (tl) {
    tl.kill();
    timelineByHost.delete(host);
  }
}

/** Актуальные span в DOM (кэш _glitchSpans может указывать на отвалившиеся узлы) */
function getLiveSpans(host) {
  if (!host?.isConnected) return [];
  return [...host.querySelectorAll(".glitch-char")];
}

function spanCountMatchesSnapshot(host, spans) {
  const snap = host?.dataset?.glitchSnapshot;
  if (!snap) return spans.length > 0;
  const expected = parseText(snap).length;
  return spans.length === expected;
}

/** Восстановить текст из data + WeakMap (на случай обрыва анимации) */
export function restoreAllChars(host) {
  if (!host) return;

  let spans = getLiveSpans(host);
  if (!spanCountMatchesSnapshot(host, spans) && host.dataset?.glitchSnapshot) {
    const snap = host.dataset.glitchSnapshot;
    unmountGlitchText(host);
    mountGlitchText(host, snap);
    spans = getLiveSpans(host);
  }

  spans.forEach((span) => {
    if (!span?.isConnected) return;
    const char = readSpanChar(span);
    if (char !== undefined) span.textContent = char;
    gsap.killTweensOf(span);
    gsap.set(span, {
      opacity: 1,
      x: 0,
      y: 0,
      skewX: 0,
      clearProps: "transform,filter",
    });
  });

  host._glitchSpans = spans;
}

export function resetGlitch(host) {
  if (!host) return;

  killTimeline(host);
  restoreAllChars(host);
}

function randomGlitchLetter() {
  return GLITCH_LETTERS[Math.floor(Math.random() * GLITCH_LETTERS.length)];
}

export function playGlitch(host) {
  if (!host || !isGlitchMounted(host)) return;
  if (
    typeof window !== "undefined" &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches
  ) {
    return;
  }

  if (!host.querySelector(".glitch-char")) {
    const snap = host.dataset?.glitchSnapshot;
    if (snap) mountGlitchText(host, snap);
  }

  killTimeline(host);

  let spans = getLiveSpans(host);
  if (!spanCountMatchesSnapshot(host, spans) && host.dataset?.glitchSnapshot) {
    const snap = host.dataset.glitchSnapshot;
    unmountGlitchText(host);
    mountGlitchText(host, snap);
    spans = getLiveSpans(host);
  }

  const items = [];

  spans.forEach((span) => {
    if (!span?.isConnected) return;
    const char = readSpanChar(span);
    if (char !== undefined) items.push({ span, char });
  });

  if (!items.length) return;

  host._glitchSpans = spans;

  const elements = items.map((item) => item.span);
  const tl = gsap.timeline({
    onComplete: () => {
      restoreAllChars(host);
      timelineByHost.delete(host);
    },
  });

  /* Без translateX: родитель .menu-line-mask { overflow:hidden } обрезает первую букву */
  tl.to(elements, {
    opacity: 0,
    skewX: () => gsap.utils.random(-14, 14),
    filter: "blur(2px)",
    duration: 0.08,
    stagger: { each: 0.006, from: "start" },
    ease: "power2.in",
  });

  items.forEach(({ span, char }, index) => {
    const startAt = 0.12 + index * 0.052;
    const cycles = 4 + Math.floor(Math.random() * 3);
    const isSpace = isWhitespace(char);

    tl.set(span, { opacity: 1, x: 0, y: 0, skewX: 0, clearProps: "filter" }, startAt);

    for (let cycle = 0; cycle < cycles; cycle += 1) {
      tl.call(
        () => {
          span.textContent = isSpace ? GLITCH_SPACE : randomGlitchLetter();
        },
        null,
        startAt + 0.004 + cycle * 0.028,
      );
    }

    tl.call(
      () => {
        span.textContent = char;
      },
      null,
      startAt + 0.004 + cycles * 0.028 + 0.012,
    );
  });

  timelineByHost.set(host, tl);
}

const TEXT_TARGET_SELECTORS = [
  ".menu-line",
  ".button__text",
  "p",
  "h1",
  "h2",
  "h3",
  "h4",
  "h5",
  "h6",
];

export function getLinkTextTarget(link) {
  if (!link || link.tagName !== "A") return null;

  if (link.querySelector("img") && !link.textContent.trim()) {
    return null;
  }

  for (const selector of TEXT_TARGET_SELECTORS) {
    const candidate = link.querySelector(selector);
    if (candidate?.textContent?.trim()) {
      return candidate;
    }
  }

  const hasBlockChild = [...link.children].some((child) => {
    const tag = child.tagName;
    return tag === "DIV" || tag === "SVG" || tag === "IMG";
  });

  if (!hasBlockChild && link.textContent.trim()) {
    return link;
  }

  return null;
}
