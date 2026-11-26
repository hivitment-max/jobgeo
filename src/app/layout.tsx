import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "JobGeo - სამუშაოს მაძიებელი ბოტი",
  description: "იპოვე შენი იდეალური სამუშაო საქართველოში",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ka">
      <body className="antialiased">
        {children}
      </body>
    </html>
  );
}