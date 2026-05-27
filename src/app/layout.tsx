import type { Metadata } from "next";
import localFont from "next/font/local";
import { SiteShell } from "@/components/site-shell";
import { THEME_INIT_SCRIPT, geistSans, geistMono } from "@drake/ui";
import "./globals.css";

const drakeWordmark = localFont({
  src: "../../public/fonts/old-english-five/OldEnglishFive-axyVg.ttf",
  variable: "--font-drake-wordmark",
});

export const metadata: Metadata = {
  title: "Drake.fm",
  description: "Personal website of Cameron W. Drake",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} ${drakeWordmark.variable} h-full antialiased`}
      suppressHydrationWarning
    >
      <head>
        <script dangerouslySetInnerHTML={{ __html: THEME_INIT_SCRIPT }} />
      </head>
      <body className="min-h-full flex flex-col">
        <SiteShell>{children}</SiteShell>
      </body>
    </html>
  );
}
