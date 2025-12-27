"use client";

import React from "react";
import { ModernLayout } from "@/components/modern-layout";

// Separate component that uses the session
const AppLayoutContent = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  return (
    <>
      <link
        href="https://fonts.googleapis.com/css2?display=swap&family=Inter:wght@400;500;700;900&family=Newsreader:wght@400;500;700;800&family=Noto+Sans:wght@400;500;700;900"
        rel="stylesheet"
      />
      <link href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined" rel="stylesheet" />
      <style jsx>{`
        :root {
          --primary-color: #1173d4;
        }
        .font-newsreader {
          font-family: "Newsreader", serif;
        }
        .font-noto-sans {
          font-family: "Noto Sans", sans-serif;
        }
      `}</style>
      <ModernLayout>
        {children}
      </ModernLayout>
    </>
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