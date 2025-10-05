"use client";

import { SessionProvider } from 'next-auth/react';
import { AdvancedThemeToggle } from "@/components/advanced-theme-toggle";

const AuthLayout = ({ 
  children
}: { 
  children: React.ReactNode
}) => {
  return ( 
    <SessionProvider>
      <div className="h-full flex flex-col items-center justify-center bg-gradient-to-br from-primary/10 via-background to-secondary/10 dark:from-primary/20 dark:via-background dark:to-secondary/20 relative">
        <div className="absolute top-4 right-4">
          <AdvancedThemeToggle />
        </div>
        <div className="w-full max-w-md p-6">
          {children}
        </div>
      </div>
    </SessionProvider>
   );
}
 
export default AuthLayout;