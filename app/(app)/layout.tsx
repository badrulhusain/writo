"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { logout } from "@/actions/logout";
import { useCurrentUser } from '@/hooks/use-current-user';

export default function AppLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const pathname = usePathname();
  const user = useCurrentUser();

  const getPageTitle = (path: string) => {
    if (path === '/home') return 'Home';
    if (path === '/blog') return 'Blog';
    if (path === '/dashboard') return 'Dashboard';
    return 'Page';
  };

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
      <div className="relative flex size-full min-h-screen flex-col bg-[#111418] dark group/design-root overflow-x-hidden" style={{ fontFamily: 'Inter, "Noto Sans", sans-serif' }}>
        <div className="layout-container flex h-full grow flex-col">
          <div className="flex flex-1">
            <aside className="w-80 flex flex-col bg-[#181C20] p-6 shrink-0">
              <div className="flex items-center gap-3 mb-8">
                <h1 className="text-white text-2xl font-bold">BlogForge AI</h1>
              </div>
              <nav className="flex flex-col gap-2 flex-grow">
                <Link className={`flex items-center gap-3 px-4 py-2.5 rounded-lg ${pathname === '/dashboard' ? 'bg-[#283039]' : ''} text-white hover:bg-[#283039]`} href="/dashboard">
                  <span className="material-symbols-outlined">description</span>
                  <span className="text-sm font-medium">My Posts</span>
                </Link>
                <Link className={`flex items-center gap-3 px-4 py-2.5 rounded-lg ${pathname === '/blog' ? 'bg-[#283039]' : ''} text-white hover:bg-[#283039]`} href="/blog">
                  <span className="material-symbols-outlined">public</span>
                  <span className="text-sm font-medium">All Blogs</span>
                </Link>
                <a className="flex items-center gap-3 px-4 py-2.5 rounded-lg text-white hover:bg-[#283039]" href="#">
                  <span className="material-symbols-outlined">group</span>
                  <span className="text-sm font-medium">Authors</span>
                </a>
                <Link className={`flex items-center gap-3 px-4 py-2.5 rounded-lg ${pathname === '/settings' ? 'bg-[#283039]' : ''} text-white hover:bg-[#283039]`} href="/settings">
                  <span className="material-symbols-outlined">settings</span>
                  <span className="text-sm font-medium">Settings</span>
                </Link>
              </nav>
              <div className="flex flex-col gap-4">
                <button className="flex w-full items-center justify-center rounded-lg h-11 px-4 bg-[#1172d4] text-white text-sm font-bold">
                  <span className="truncate">Upgrade to Pro</span>
                </button>
                <a className="flex items-center gap-3 px-4 py-2.5 rounded-lg text-white hover:bg-[#283039]" href="#">
                  <span className="material-symbols-outlined">group_add</span>
                  <span className="text-sm font-medium">Invite friends</span>
                </a>
              </div>
            </aside>
            <main className="flex-1 p-8">
              {pathname !== '/dashboard' && (
                <header className="flex justify-between items-center mb-8">
                  <div>
                    <h1 className="text-white text-4xl font-bold">{getPageTitle(pathname)}</h1>
                    <p className="text-[#9dabb9] text-base mt-1">Welcome back, {user?.name?.split(' ')[0] || 'User'}.</p>
                  </div>
                  <div className="flex items-center gap-4">
                    <button className="flex items-center justify-center gap-2 rounded-lg h-11 px-5 bg-[#1172d4] text-white text-sm font-bold hover:bg-[#0f63b6]">
                      <span className="material-symbols-outlined">add_circle</span>
                      <span className="truncate">Create New Post</span>
                    </button>
                    <div className="relative">
                      <button className="bg-center bg-no-repeat aspect-square bg-cover rounded-full size-14 border-2 border-blue-500" style={{ backgroundImage: `url("${user?.image || 'https://lh3.googleusercontent.com/aida-public/AB6AXuDMuFAcrexZnu-MnPc33xMsc_TgHughy31oOlB7PluORPRu3VUrPUpFWE74H9EjDfs2yIRFOeEo5RzyD0OrkPUpPyyUnJokv8JD5iJRKA1KeTGdQUdsiwEIW-1oiFW7NQigRO41QzDt53CHzwfcClIRSs8MYM6Dq70QX0OaBmEtbThHU1nq1Oc16BvkQHDoU8irFLAKvyqht4k5iKhD1g4EJn6X-z8XRVg1b7DQ0NAoow1PmDOkMjSsmxLpBlOFrxP6k3NhtlrY3ME'}"` }}></button>
                    </div>
                  </div>
                </header>
              )}
              <div className={pathname === '/dashboard' ? '' : 'max-w-6xl mx-auto'}>
                {children}
              </div>
            </main>
          </div>
        </div>
      </div>
    </>
  );
}