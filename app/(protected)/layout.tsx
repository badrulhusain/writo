"use client";

import Navbar from "@/components/Navbar";

// Separate component that uses the session
const ProtectedLayoutContent = ({ children }: { children: React.ReactNode; }) => {
  return ( 
    <div className="h-full w-full flex flex-col gap-y-10 items-center justify-center bg-gradient-to-br from-primary/10 via-background to-secondary/10 dark:from-primary/20 dark:via-background dark:to-secondary/20">
      <Navbar />
      <div className="w-full max-w-4xl p-4">
        {children}
      </div>
    </div>
  );
};

interface ProtectedLayoutProps {
  children: React.ReactNode;
};

const ProtectedLayout = ({ children }: ProtectedLayoutProps) => {
  return ( 
    <ProtectedLayoutContent>
      {children}
    </ProtectedLayoutContent>
   );
};
 
export default ProtectedLayout;