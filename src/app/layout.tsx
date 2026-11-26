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
        {/* Telegram Web App Script - ყველა სხვა სკრიპტზე ადრე! */}
        <script src="https://telegram.org/js/telegram-web-app.js" />
      </head>
      <body className="antialiased bg-white text-gray-900 overflow-x-hidden">
        {children}
      </body>
    </html>
  );
}