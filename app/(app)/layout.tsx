"use client";

import React, { useState } from "react";
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
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

const hide =()=>{
  if(sidebarCollapsed){
    
  }
}
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
      <div className="relative flex size-full min-h-screen flex-col bg-white group/design-root overflow-x-hidden" style={{ fontFamily: 'Inter, "Noto Sans", sans-serif' }}>
        <div className="layout-container flex h-full grow flex-col">
          <div className="flex flex-1">
            <aside className={`${sidebarCollapsed ? 'w-[100px]' : 'w-80'} flex flex-col bg-gray-100 p-6 shrink-0 transition-all duration-300`}>
              <div className="flex items-center justify-between mb-8">
                <h1 className={`text-gray-900 font-bold ${sidebarCollapsed ? 'text-lg' : 'text-2xl'}`}>WRITO</h1>
                <button
                  onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
                  className="text-gray-900 hover:bg-gray-200 p-2 rounded-lg"
                >
                  <span className="material-symbols-outlined">{sidebarCollapsed ? 'chevron_right' : 'chevron_left'}</span>
                </button>
              </div>
              <nav className="flex flex-col gap-2 flex-grow">
                <Link className={`flex items-center gap-3 px-4 py-2.5 rounded-lg ${pathname === '/dashboard' ? 'bg-gray-200' : ''} text-gray-900 hover:bg-gray-200`} href="/dashboard">
                  <span className="material-symbols-outlined">description</span>
                  {!sidebarCollapsed && <span className="text-sm font-medium">My Posts</span>}
                </Link>
                <Link className={`flex items-center gap-3 px-4 py-2.5 rounded-lg ${pathname === '/blog' ? 'bg-gray-200' : ''} text-gray-900 hover:bg-gray-200`} href="/blog">
                  <span className="material-symbols-outlined">public</span>
                  {!sidebarCollapsed && <span className="text-sm font-medium">All Blogs</span>}
                </Link>
                <a className="flex items-center gap-3 px-4 py-2.5 rounded-lg text-gray-900 hover:bg-gray-200" href="#">
                  <span className="material-symbols-outlined">group</span>
                  {!sidebarCollapsed && <span className="text-sm font-medium">Authors</span>}
                </a>
                <Link className={`flex items-center gap-3 px-4 py-2.5 rounded-lg ${pathname === '/settings' ? 'bg-gray-200' : ''} text-gray-900 hover:bg-gray-200`} href="/settings">
                  <span className="material-symbols-outlined">settings</span>
                  {!sidebarCollapsed && <span className="text-sm font-medium">Settings</span>}
                </Link>
              </nav>
              <div className="flex flex-col gap-4">
                <button className="flex w-full items-center justify-center rounded-lg h-11 px-4 bg-[#1172d4] text-white text-sm font-bold">
                  {!sidebarCollapsed && <span className="truncate">Upgrade to Pro</span>}
                  {sidebarCollapsed && <span className="material-symbols-outlined">upgrade</span>}
                </button>
                <a className="flex items-center gap-3 px-4 py-2.5 rounded-lg text-gray-900 hover:bg-gray-200" href="#">
                  <span className="material-symbols-outlined">group_add</span>
                  {!sidebarCollapsed && <span className="text-sm font-medium">Invite friends</span>}
                </a>
              </div>
            </aside>
            <main className="flex-1 p-8">
              {children}
            </main>
          </div>
        </div>
      </div>
    </>
  );
}