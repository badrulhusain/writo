"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useCurrentUser } from '@/hooks/use-current-user';
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
  FileText,
  Settings,
  User as UserIcon,
  Sparkles,
  HomeIcon,
  ImageIcon,
  ShieldCheck
} from "lucide-react";

interface ModernLayoutProps {
  children: React.ReactNode;
}

export function ModernLayout({ children }: ModernLayoutProps) {
  const pathname = usePathname();
  const user = useCurrentUser();

  const navigation = [
    { name: "Home", href: "/home", icon: HomeIcon },


    { name: "Create Post", href: "/blog/create", icon: Sparkles },
    ...(user?.role === "ADMIN"
      ? [{ name: "Admin", href: "/admin", icon: ShieldCheck }]
      : []),
    { name: "Profile", href: "/profile", icon: UserIcon },
    { name: "Settings", href: "/settings", icon: Settings },
  ];

  return (
    <div className="flex h-screen bg-background">
      {/* Dock centered at bottom - visible on all screen sizes */}
      <aside className="fixed bottom-4 lg:bottom-8 left-1/2 transform -translate-x-1/2 z-50 transition-all duration-300 ease-in-out">
        <TooltipProvider>
          <Dock
            direction="middle"
            className={cn(
              // horizontal dock centered at bottom - responsive sizing
              "mx-auto flex h-[52px] lg:h-[58px] w-max items-center justify-center gap-1 lg:gap-2 rounded-2xl p-1.5 lg:p-2 bg-secondary/30 backdrop-blur-sm border border-border",
            )}
          >

            {navigation.map((item) => {
              const isActive = pathname === item.href;
              return (
                <DockIcon key={item.name}>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Link
                        href={item.href}
                        aria-label={item.name}
                        className={cn(buttonVariants({ variant: "ghost", size: "icon" }), "size-10 lg:size-12 rounded-full", {
                          "bg-primary text-primary-foreground": isActive,
                        })}
                      >
                        <item.icon className="h-4 lg:h-5 w-4 lg:w-5" />
                      </Link>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>{item.name}</p>
                    </TooltipContent>
                  </Tooltip>
                </DockIcon>
              );
            })}

            <Separator orientation="vertical" className="h-5 lg:h-6" />

            <DockIcon>
              <Tooltip>
                <TooltipTrigger asChild>
                  <div className={cn(buttonVariants({ variant: "ghost", size: "icon" }), "size-10 lg:size-12 rounded-full")}>
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
        {/* Page content */}
        <main className="flex-1 overflow-y-auto p-4 md:p-6 pb-24 lg:pb-6 bg-background">
          {children}
        </main>
      </div>
    </div>
  );
}