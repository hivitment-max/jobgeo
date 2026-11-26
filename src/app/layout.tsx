import type { Metadata, Viewport } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "JOBSNAP - იპოვე შენი იდეალური სამუშაო",
  description: "AI-ზე დაფუძნებული სამუშაოს მაძიებელი Telegram Mini App საქართველოში",
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  viewportFit: "cover",
  themeColor: "#ffffff",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ka">
      <head>
        {/* Telegram Mini App-ისთვის აუცილებელი meta tags */}
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no, viewport-fit=cover" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
      </head>
      <body className="antialiased bg-white text-gray-900 overflow-x-hidden">
        {children}
      </body>
    </html>
  );
}