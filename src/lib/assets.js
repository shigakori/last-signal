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
