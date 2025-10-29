"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useCurrentUser } from '@/hooks/use-current-user';
import { AdvancedThemeToggle } from "@/components/advanced-theme-toggle";
import { UserButton } from "@/components/auth/user-button";
import { buttonVariants } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Dock, DockIcon } from "@/components/ui/dock";
import { cn } from "@/lib/utils";
import {
  LayoutDashboard,
  FileText,
  Users,
  Settings,
  ChevronLeft,
  ChevronRight,
  Menu,
  X,
  User as UserIcon,
  Sparkles,
  HomeIcon,
  ImageIcon
} from "lucide-react";
import { Button } from "@/components/ui/button";

interface ModernLayoutProps {
  children: React.ReactNode;
}

export function ModernLayout({ children }: ModernLayoutProps) {
  const pathname = usePathname();
  const user = useCurrentUser();
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);

  const navigation = [

    { name: "Home", href: "/home", icon:HomeIcon },
    { name: "Images", href: "/images", icon: ImageIcon },
    { name: "Posts", href: "/blog", icon: FileText },
    { name: "Create Post", href: "/blog/create", icon: Sparkles },
    { name: "Profile", href: "/profile", icon: UserIcon },
    { name: "Settings", href: "/settings", icon: Settings },
  ];

  return (
    <div className="flex h-screen bg-background">
      {/* Mobile sidebar overlay */}
      {mobileSidebarOpen && (
        <div 
          className="fixed inset-0 z-40 bg-black bg-opacity-50 lg:hidden"
          onClick={() => setMobileSidebarOpen(false)}
        />
      )}

      {/* Mobile Drawer (small screens) */}
      {mobileSidebarOpen && (
        <aside className="fixed inset-y-0 left-0 z-50 w-64 bg-secondary/30 backdrop-blur-sm border-r border-border p-4 lg:hidden">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-bold">WRITO</h2>
            <button
              className="inline-flex items-center justify-center rounded-md p-2"
              onClick={() => setMobileSidebarOpen(false)}
              aria-label="Close sidebar"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
          <nav className="space-y-2">
            {navigation.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className={`flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors text-foreground hover:bg-muted`}
                onClick={() => setMobileSidebarOpen(false)}
              >
                <item.icon className="h-5 w-5" />
                <span>{item.name}</span>
              </Link>
            ))}
          </nav>
        </aside>
      )}

      {/* Dock centered at bottom on large screens; mobile uses drawer above */}
      <aside className="hidden lg:block fixed bottom-8 left-1/2 transform -translate-x-1/2 z-50 transition-all duration-300 ease-in-out"> 
        <TooltipProvider>
          <Dock
            direction="middle"
            className={cn(
              // horizontal dock centered at bottom
              "mx-auto flex h-[58px] w-max items-center justify-center gap-2 rounded-2xl p-2 bg-secondary/30 backdrop-blur-sm border border-border",
            )}
          >
            <DockIcon>
              <Tooltip>
                <TooltipTrigger asChild>
                  <div className={cn(buttonVariants({ variant: "ghost", size: "icon" }), "size-12 rounded-full")}>
                    <AdvancedThemeToggle />
                  </div>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Toggle Theme</p>
                </TooltipContent>
              </Tooltip>
            </DockIcon>

            <Separator orientation="vertical" className="h-6" />

            {navigation.map((item) => {
              const isActive = pathname === item.href;
              return (
                <DockIcon key={item.name}>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Link
                        href={item.href}
                        aria-label={item.name}
                        className={cn(buttonVariants({ variant: "ghost", size: "icon" }), "size-12 rounded-full", {
                          "bg-primary text-primary-foreground": isActive,
                        })}
                      >
                        <item.icon className="h-5 w-5" />
                      </Link>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>{item.name}</p>
                    </TooltipContent>
                  </Tooltip>
                </DockIcon>
              );
            })}

            <Separator orientation="vertical" className="h-6" />

            <DockIcon>
              <Tooltip>
                <TooltipTrigger asChild>
                  <div className={cn(buttonVariants({ variant: "ghost", size: "icon" }), "size-12 rounded-full")}>
                    <UserButton />
                  </div>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Account</p>
                </TooltipContent>
              </Tooltip>
            </DockIcon>
          </Dock>
        </TooltipProvider>
      </aside>

      {/* Main content */}
      <div className="flex flex-col flex-1 lg:ml-0">
        {/* Mobile header */}
        <header className="lg:hidden flex items-center justify-between p-4 border-b border-border bg-background">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setMobileSidebarOpen(true)}
          >
            <Menu className="h-6 w-6" />
          </Button>
          <h1 className="text-xl font-bold">WRITO</h1>
          <div className="w-10" /> {/* Spacer for symmetry */}
        </header>

        {/* Page content */}
        <main className="flex-1 overflow-y-auto p-4 md:p-6 bg-background">
          {children}
        </main>
      </div>
    </div>
  );
}