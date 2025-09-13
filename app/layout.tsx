import type { Metadata } from 'next'
import { Inter, Noto_Sans } from 'next/font/google'
import { SessionProvider } from 'next-auth/react'
import { auth } from '@/Auth'
import './globals.css'
import { Toaster } from "@/components/ui/sonner";
import Head from 'next/head';

const inter = Inter({ subsets: ['latin'] })
const notoSans = Noto_Sans({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'BlogSmart',
  description: 'Unlock Your Blogging Potential with AI',
}

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const session = await auth();

  return (
    <SessionProvider session={session}>
      <Head>
        <link href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined" rel="stylesheet" />
      </Head>
      <html lang="en">
        <body className={inter.className}>
          <Toaster />
          {children}
        </body>
      </html>
    </SessionProvider>
  )
}
