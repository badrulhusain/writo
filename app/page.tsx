import Image from "next/image";
import { FlickeringGrid } from "@/components/magicui/flickering-grid";
import React from 'react';
import Link from 'next/link';

function Home() {
  return (
    <div className="relative">
      <div className="absolute top-0 left-0 right-0 z-10 flex justify-center items-center h-20">
        <Link href="/home" className="bg-blue-500 text-white px-6 py-3 rounded-lg hover:bg-blue-600 transition-colors">
          Get Started
        </Link>
      </div>
      <FlickeringGrid
        className="relative inset-0 z-0 [mask-image:radial-gradient(450px_circle_at_center,white,transparent)]"
        squareSize={10}
        gridGap={6}
        color="#60A5FA"
        maxOpacity={0.5}
        flickerChance={0.1}
        height={800}
        width={1100}
      />
    </div>
  )
}

export default Home