import type { Metadata, Viewport } from "next";
import "./globals.css";
import QueryProvider from "@/components/QueryProvider";

export const metadata: Metadata = {
  title: "Hunar — AI-Powered Blue-Collar Job Platform",
  description: "India's #1 AI-powered platform connecting skilled workers, employers, and customers. Find electricians, plumbers, carpenters, and 500+ blue-collar professionals near you.",
  keywords: "blue collar jobs, skilled workers, electrician near me, plumber, carpenter, hunar, AI job platform",
  openGraph: {
    title: "Hunar — AI-Powered Blue-Collar Job Platform",
    description: "Find skilled professionals or discover jobs powered by AI recommendations.",
    type: "website",
  },
  manifest: "/manifest.json",
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#1E3A8A",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
        <link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@300;400;500;600;700;800&family=Inter:wght@300;400;500;600;700&display=swap" rel="stylesheet" />
      </head>
      <body>
        <QueryProvider>{children}</QueryProvider>
      </body>
    </html>
  );
}

