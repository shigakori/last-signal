import ClientLayout from "@/client-layout";
import { metadataFromPageKey, siteConfig } from "@/lib/metadata";

import "lenis/dist/lenis.css";
import "./globals.css";

export const metadata = {
  ...metadataFromPageKey("home"),
  title: {
    default: siteConfig.name,
    template: `%s | ${siteConfig.name}`,
  },
  applicationName: siteConfig.name,
  category: "portfolio",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
};

export const viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#050505",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <ClientLayout>{children}</ClientLayout>
      </body>
    </html>
  );
}
