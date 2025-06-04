import React, { ReactNode } from "react";
import AuthHeader from "./header/AuthHeader";
import FooterSection from "./FooterSection";

interface LayoutProps {
  children: ReactNode;
}

const Layout = ({ children }: LayoutProps) => {
  // Update viewport height on mount and resize
  React.useEffect(() => {
    const setVhVariable = () => {
      const vh = window.innerHeight * 0.01;
      document.documentElement.style.setProperty('--vh', `${vh}px`);
    };
    
    // Set initially and on resize
    setVhVariable();
    window.addEventListener('resize', setVhVariable);
    window.addEventListener('orientationchange', setVhVariable);
    
    return () => {
      window.removeEventListener('resize', setVhVariable);
      window.removeEventListener('orientationchange', setVhVariable);
    };
  }, []);

  return (
    <div className="min-h-screen mobile-full-height bg-black text-white flex flex-col w-full overflow-x-hidden max-w-[100vw]">
      <AuthHeader />
      <main className="flex-grow w-full mobile-safe-area overflow-x-hidden">
        {children}
      </main>
    </div>
  );
};

export default Layout;