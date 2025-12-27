"use client";


import Link from "next/link";
import React from "react";

import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export type IconProps = React.HTMLAttributes<SVGElement>;




function DockDemo() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-background to-secondary/10 dark:from-background dark:to-secondary/20">
      <div className="w-full items-center flex justify-center mb-12">
        <span className="pointer-events-none whitespace-pre-wrap bg-gradient-to-b from-primary to-primary/70 bg-clip-text text-center text-6xl md:text-8xl font-bold leading-none text-transparent">
          WRITO
        </span>
      </div>
        <p className="text-lg md:text-xl text-muted-foreground max-w-md md:max-w-xl text-center mb-8 px-4">
          Unlock Your Blogging Potential with AI
        </p>
        <Link
          href="/home"
          className={cn(
            buttonVariants({ variant: "default", size: "lg" }),
            "bg-gradient-to-r from-primary to-blue-500 text-white shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105"
          )}
        >
          Start Reading
        </Link>
      </div>
  
  );
}

export default DockDemo;