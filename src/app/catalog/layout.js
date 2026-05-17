import { metadataFromPageKey } from "@/lib/metadata";

export const metadata = metadataFromPageKey("catalog");

export default function CatalogLayout({ children }) {
  return children;
}
