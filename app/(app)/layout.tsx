"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { logout } from "@/actions/logout";
import {
  LogOutIcon,
  MenuIcon,
  LayoutDashboardIcon,
  Share2Icon,
  UploadIcon,
  ImageIcon,
} from "lucide-react";

const sidebarItems = [
  { href: "/home", icon: LayoutDashboardIcon, label: "Home Page" },
  { href: "/dashboard", icon: Share2Icon, label: "User Dashboard    " },
  { href: "/video-upload", icon: UploadIcon, label: "Video Upload" },
];
const handleSignOut = async () => {
  // Implement sign-out logic here
  // For example, you might want to call an API endpoint to log out the user
  // and then redirect to the login page.
  
  console.log("Sign out clicked");
}
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
    <div className="drawer lg:drawer-open font-serif bg-[#f6f6f5] min-h-screen">
      <input
        id="sidebar-drawer"
        type="checkbox"
        className="drawer-toggle"
        checked={sidebarOpen}
        onChange={() => setSidebarOpen(!sidebarOpen)}
      />
      <div className="drawer-content flex flex-col">
        {/* Academic Navbar */}
        <header className="w-full bg-[#e9ecef] border-b border-gray-300">
          <div className="navbar max-w-6xl mx-auto px-4 sm:px-8">
            <div className="flex-none lg:hidden">
              <label
                htmlFor="sidebar-drawer"
                className="btn btn-square btn-ghost drawer-button"
              >
                <MenuIcon />
              </label>
            </div>
            <div className="flex-1">
              <Link href="/" onClick={handleLogoClick}>
                <div className="btn btn-ghost normal-case text-2xl font-bold tracking-tight cursor-pointer text-[#1a3258]">
                  <span className="italic font-serif">Cloudinary Showcase</span>
                </div>
              </Link>
            </div>
            <div className="flex-none hidden lg:block"></div>
          </div>
        </header>
        {/* Academic Page Content */}
        <main className="flex-1 p-8">
          <div className="max-w-4xl mx-auto bg-white rounded-xl shadow-md border border-gray-200 p-8">
            {children}
          </div>
        </main>
      </div>
      {/* Academic Sidebar */}
      <div className="drawer-side">
        <label htmlFor="sidebar-drawer" className="drawer-overlay"></label>
        <aside className="bg-[#e9ecef] w-64 h-full flex flex-col border-r border-gray-300">
          <div className="flex items-center justify-center py-6">
            <ImageIcon className="w-12 h-12 text-[#1a3258]" />
          </div>
          <ul className="menu p-4 w-full text-base-content flex-grow">
            {sidebarItems.map((item) => (
              <li key={item.href} className="mb-2">
                <Link
                  href={item.href}
                  className={`flex items-center space-x-4 px-4 py-2 rounded-md font-medium transition-colors ${
                    pathname === item.href
                      ? "bg-[#1a3258] text-white"
                      : "hover:bg-gray-200 text-[#1a3258]"
                  }`}
                  onClick={() => setSidebarOpen(false)}
                >
                  <item.icon className="w-6 h-6" />
                  <span className="font-serif">{item.label}</span>
                </Link>
              </li>
            ))}
          </ul>
          <div className="p-4 mt-auto">
            <button
              onClick={logout}
              className="btn w-full flex items-center space-x-2 cursor-pointer bg-[#1a3258] text-white font-serif hover:bg-[#29406a]"
            >
              <LogOutIcon className="w-5 h-5" />
              <span   onClick={logout} className="" >Sign Out</span>
            </button>
          </div>
        </aside>
      </div>
    </div>
  );
}