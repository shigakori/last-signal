/** Префикс для статики при деплое в подпапку (GitHub Pages). На Vercel оставьте пустым. */
const basePath = process.env.NEXT_PUBLIC_BASE_PATH ?? "";

/**
 * Путь к файлу из /public (картинки, музыка и т.д.)
 * @param {string} path — например "/images/img1.png"
 */
export function asset(path) {
  const normalized = path.startsWith("/") ? path : `/${path}`;
  return `${basePath}${normalized}`;
}

/**
 * @param {string} path
 */
export function assetUrl(path) {
  const relative = asset(path);
  if (typeof window === "undefined") return relative;
  return new URL(relative, window.location.origin).href;
}
