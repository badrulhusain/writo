// import { useRouter } from 'next/navigation'

import React from 'react'
import { Button } from '@/components/ui/button'
// import { useRouter } from 'next/router'
import Link from 'next/link'

function Home() {

  return (
    <div>page
      <Button ><Link href="/blog/create">Create</Link></Button>
    </div>
  )
}

export default Home