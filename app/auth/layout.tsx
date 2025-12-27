"use client";



const AuthLayout = ({ 
  children
}: { 
  children: React.ReactNode
}) => {
  return ( 
    <div className="h-full flex flex-col items-center justify-center bg-gradient-to-br from-primary/10 via-background to-secondary/10 dark:from-primary/20 dark:via-background dark:to-secondary/20 relative">
      <div className="w-full max-w-md p-6">
        {children}
      </div>
    </div>
   );
}
 
export default AuthLayout;