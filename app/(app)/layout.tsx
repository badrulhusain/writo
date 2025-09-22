"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { logout } from "@/actions/logout";
import { MenuIcon } from "lucide-react";
import { Button } from '@/components/ui/button'
const sidebarItems = [
  { href: "/home", label: "Home" },
  { href: "/blog", label: "Blog" },
  { href: "/dashboard", label: "Dashboard" },
];

export default function AppLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const pathname = usePathname();
  const router = useRouter();

  const handleLogoClick = () => {
    router.push("/");
  };

  return (
    <>
      <link
        href="https://fonts.googleapis.com/css2?display=swap&family=Newsreader:wght@400;500;700;800&family=Noto+Sans:wght@400;500;700;900"
        rel="stylesheet"
      />
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
      <div className="drawer font-noto-sans bg-gray-50 text-gray-800 min-h-screen">
        <input
          id="sidebar-drawer"
          type="checkbox"
          className="drawer-toggle"
          checked={sidebarOpen}
          onChange={() => setSidebarOpen(!sidebarOpen)}
        />
        <div className="drawer-content flex flex-col">
          <header className="flex items-center justify-between whitespace-nowrap border-b border-gray-200 px-10 py-4 bg-white">
            <div className="flex items-center gap-8">
              <div className="flex-none">
                <label
                  htmlFor="sidebar-drawer"
                  className="btn btn-square btn-ghost drawer-button"
                >
                  <MenuIcon />
                </label>
              </div>
              <div className="flex items-center gap-2.5 text-gray-900">
                <div className="size-6 text-[var(--primary-color)]">
                  <svg fill="none" viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg">
                    <path d="M6 6H42L36 24L42 42H6L12 24L6 6Z" fill="currentColor"></path>
                  </svg>
                </div>
                <h2 className="text-gray-900 text-xl font-bold font-newsreader tracking-tight cursor-pointer" onClick={handleLogoClick}>
                  Academic Blog
                </h2>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <div className="hidden md:flex items-center gap-2">
                <button className="flex h-10 w-10 items-center justify-center rounded-full text-gray-500 hover:bg-gray-100 hover:text-gray-900 transition-colors">
                  <svg fill="currentColor" height="20px" viewBox="0 0 256 256" width="20px" xmlns="http://www.w3.org/2000/svg">
                    <path d="M229.66,218.34l-50.07-50.06a88.11,88.11,0,1,0-11.31,11.31l50.06,50.07a8,8,0,0,0,11.32-11.32ZM40,112a72,72,0,1,1,72,72A72.08,72.08,0,0,1,40,112Z"></path>
                  </svg>
                </button>
                <button className="flex h-10 w-10 items-center justify-center rounded-full text-gray-500 hover:bg-gray-100 hover:text-gray-900 transition-colors">
                  <svg fill="currentColor" height="20px" viewBox="0 0 256 256" width="20px" xmlns="http://www.w3.org/2000/svg">
                    <path d="M221.8,175.94C216.25,166.38,208,139.33,208,104a80,80,0,1,0-160,0c0,35.34-8.26,62.38-13.81,71.94A16,16,0,0,0,48,200H88.81a40,40,0,0,0,78.38,0H208a16,16,0,0,0,13.8-24.06ZM128,216a24,24,0,0,1-22.62-16h45.24A24,24,0,0,1,128,216ZM48,184c7.7-13.24,16-43.92,16-80a64,64,0,1,1,128,0c0,36.05,8.28,66.73,16,80Z"></path>
                  </svg>
                </button>
                <Button ><Link href="/blog/create">Create</Link></Button>
              </div>
              
            </div>
          </header>
          <main className="flex-1 px-10 py-8">
            <div className="max-w-6xl mx-auto">
              {children}
            </div>
          </main>
        </div>
        <div className="drawer-side">
          <label htmlFor="sidebar-drawer" className="drawer-overlay"></label>
          <aside className="bg-white w-64 h-full flex flex-col border-r border-gray-200">
            <div className="flex items-center justify-center py-6">
              <div className="size-8 text-[var(--primary-color)]">
                <svg fill="none" viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg">
                  <path d="M6 6H42L36 24L42 42H6L12 24L6 6Z" fill="currentColor"></path>
                </svg>
              </div>
            </div>
            <ul className="menu p-4 w-full text-base-content flex-grow">
              {sidebarItems.map((item) => (
                <li key={item.href} className="mb-2">
                  <Link
                    href={item.href}
                    className={`flex items-center px-4 py-2 rounded-md font-medium transition-colors ${
                      pathname === item.href
                        ? "bg-[var(--primary-color)] text-white"
                        : "hover:bg-gray-100 text-gray-700"
                    }`}
                    onClick={() => setSidebarOpen(false)}
                  >
                    <span className="font-noto-sans">{item.label}</span>
                  </Link>
                </li>
              ))}
            </ul>
            <div className="p-4 mt-auto">
         
              <button
                onClick={logout}
                className="w-full px-4 py-2 text-sm font-medium text-[var(--primary-color)] border border-[var(--primary-color)] rounded-md hover:bg-[var(--primary-color)] hover:text-white transition-colors"
              >
                Log Out
              </button>
            </div>
          </aside>
        </div>
      </div>
    </>
  );
}