"use client";

import React from "react";
import { Newsreader, Noto_Sans } from "next/font/google";
import { ModernLayout } from "@/components/modern-layout";

const newsreader = Newsreader({ subsets: ["latin"], weight: ["400", "500", "700", "800"], variable: "--font-newsreader" });
const notoSans = Noto_Sans({ subsets: ["latin"], weight: ["400", "500", "700", "900"], variable: "--font-noto-sans" });

// Separate component that uses the session
const AppLayoutContent = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  return (
    <div className={`${newsreader.variable} ${notoSans.variable}`}>
      <style jsx global>{`
        :root {
          --primary-color: #1173d4;
        }
        .font-newsreader {
          font-family: var(--font-newsreader), serif;
        }
        .font-noto-sans {
          font-family: var(--font-noto-sans), sans-serif;
        }
      `}</style>
      <ModernLayout>
        {children}
      </ModernLayout>
    </div>
  );
};

export default function AppLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <AppLayoutContent>
      {children}
    </AppLayoutContent>
  );
}