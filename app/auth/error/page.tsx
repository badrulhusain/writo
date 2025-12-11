import { Suspense } from "react";
import { ErrorCard } from "@/components/auth/error-card";

const AuthErrorPage = () => {
  return ( 
    <Suspense fallback={<div>Loading...</div>}>
      <ErrorCard />
    </Suspense>
  );
};
 
export default AuthErrorPage;
