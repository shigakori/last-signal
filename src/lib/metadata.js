import { asset } from "@/lib/assets";

const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL ?? "https://lastsignal.shigakori.com";

const SITE_NAME = "Last Signal";
const SITE_AUTHOR = "Shigakori";
const SITE_TAGLINE = "House of Epochs — archival survey of pre-collapse structures";

export const siteConfig = {
  name: SITE_NAME,
  author: SITE_AUTHOR,
  tagline: SITE_TAGLINE,
  url: SITE_URL,
  locale: "en_US",
  defaultOgImage: asset("/images/img2.png"),
};

export const pageMetadata = {
  home: {
    title: "Last Signal",
    description:
      "Genesis archive of Last Signal — cinematic field survey of fallen arches, silent monoliths, and structures that outlasted their civilizations. MWT by Shigakori, March 2026.",
    path: "/",
    keywords: [
      "Last Signal",
      "House of Epochs",
      "archaeological survey",
      "Shigakori",
      "archival documentation",
    ],
  },
  chronicles: {
    title: "Chronicles",
    description:
      "Ten documented sites across the reach — from the Arches of Vorn to the Throat of Ishk. Scroll through eras, coordinates, and field tags for each monument.",
    path: "/chronicles",
    keywords: [
      "chronicles",
      "archaeological sites",
      "monuments",
      "pre-collapse structures",
      "field archive",
    ],
  },
  report: {
    title: "Field Report — Isles of Rhovaan",
    description:
      "Full field report on the Severed Isles of Rhovaan: discovery in 1961, ground confirmation in 1979, geothermal basin conditions, and seven suspended landmasses under continuous survey.",
    path: "/report",
    keywords: [
      "field report",
      "Rhovaan",
      "floating islands",
      "geothermal anomaly",
      "volcanic south",
    ],
  },
  catalog: {
    title: "Catalog",
    description:
      "Open-clearance visual catalog — a curved three-dimensional grid of archival frames. Navigate the signal index with clearance status and last update 1987.",
    path: "/catalog",
    keywords: ["catalog", "visual archive", "signal index", "clearance open"],
  },
  transmit: {
    title: "Transmit — Open Channel",
    description:
      "Three channels, one frequency — general inquiries, field coordination, and archive requests. Field Office 01, frequency active.",
    path: "/transmit",
    keywords: [
      "contact",
      "transmit",
      "field coordination",
      "archive requests",
      "open channel",
    ],
  },
  worldMapSystem: {
    title: "World Map System",
    description:
      "Archive node world map — six active sectors with coordinates, signal strength, and archive sync. Navigate sectors from archived nodes to dormant regions.",
    path: "/world-map-system",
    keywords: [
      "world map",
      "sector scan",
      "archive node",
      "coordinates",
      "signal tracking",
    ],
  },
};

export function createPageMetadata({
  title,
  description,
  path,
  keywords = [],
  noIndex = false,
}) {
  const canonicalPath = path === "/" ? "" : path;
  const url = `${SITE_URL}${canonicalPath || "/"}`;
  const fullTitle =
    title === SITE_NAME ? title : { absolute: `${title} | ${SITE_NAME}` };

  return {
    title: fullTitle,
    description,
    keywords: [...keywords, SITE_NAME, SITE_AUTHOR],
    authors: [{ name: SITE_AUTHOR, url: "https://shigakori.com" }],
    creator: SITE_AUTHOR,
    publisher: SITE_AUTHOR,
    metadataBase: new URL(SITE_URL),
    alternates: {
      canonical: path,
    },
    openGraph: {
      type: "website",
      locale: siteConfig.locale,
      url,
      siteName: SITE_NAME,
      title: typeof fullTitle === "string" ? fullTitle : `${title} | ${SITE_NAME}`,
      description,
      images: [
        {
          url: siteConfig.defaultOgImage,
          width: 1200,
          height: 630,
          alt: `${title} — ${SITE_NAME}`,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: typeof fullTitle === "string" ? fullTitle : `${title} | ${SITE_NAME}`,
      description,
      images: [siteConfig.defaultOgImage],
      creator: "@shigakoriweb",
    },
    robots: noIndex
      ? { index: false, follow: false }
      : {
          index: true,
          follow: true,
          googleBot: {
            index: true,
            follow: true,
            "max-image-preview": "large",
            "max-snippet": -1,
          },
        },
  };
}

export function metadataFromPageKey(pageKey) {
  const page = pageMetadata[pageKey];
  return createPageMetadata(page);
}
