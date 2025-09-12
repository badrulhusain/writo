import Image from "next/image";
import { FlickeringGrid } from "@/components/magicui/flickering-grid";
import React from 'react'

function Home() {
  return (
    <div>
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