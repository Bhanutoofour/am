export const INDIA_LOCALE_PREFIX = "/en-in";
export const SITE_URL = (
  process.env.NEXT_PUBLIC_SITE_URL || "https://www.autocracymachinery.com"
).replace(/\/+$/, "");

export function isIndiaPath(pathname?: string | null) {
  return pathname === INDIA_LOCALE_PREFIX || pathname?.startsWith(`${INDIA_LOCALE_PREFIX}/`);
}

export function withLocalePrefix(href: string, pathname?: string | null) {
  if (!isIndiaPath(pathname)) return href;
  if (!href.startsWith("/") || href.startsWith("//")) return href;
  if (href === INDIA_LOCALE_PREFIX || href.startsWith(`${INDIA_LOCALE_PREFIX}/`)) return href;
  if (href === "/") return INDIA_LOCALE_PREFIX;
  return `${INDIA_LOCALE_PREFIX}${href}`;
}

export function indiaCanonical(path = "") {
  const normalizedPath = path.startsWith("/") ? path : `/${path}`;
  return `${SITE_URL}${INDIA_LOCALE_PREFIX}${normalizedPath === "/" ? "" : normalizedPath}`;
}

export function rootCanonical(path = "") {
  const normalizedPath = path.startsWith("/") ? path : `/${path}`;
  return `${SITE_URL}${normalizedPath === "/" ? "" : normalizedPath}`;
}
