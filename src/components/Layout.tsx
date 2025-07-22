import React, { ReactNode } from "react";
import AuthHeader from "./header/AuthHeader";
import FooterSection from "./FooterSection";
import PullToRefresh from "./PullToRefresh";

interface LayoutProps {
  children: ReactNode;
}

const Layout = ({ children }: LayoutProps) => {
  // Update viewport height on mount and resize
  React.useEffect(() => {
    const setVhVariable = () => {
      const vh = window.innerHeight * 0.01;
      document.documentElement.style.setProperty("--vh", `${vh}px`);
    };

    // Set initially and on resize
    setVhVariable();
    window.addEventListener("resize", setVhVariable);
    window.addEventListener("orientationchange", setVhVariable);

    return () => {
      window.removeEventListener("resize", setVhVariable);
      window.removeEventListener("orientationchange", setVhVariable);
    };
  }, []);

  const handleRefresh = async () => {
    // Add a small delay to show the refresh animation
    await new Promise((resolve) => setTimeout(resolve, 500));

    // Reload the page
    window.location.reload();
  };

  return (
    <div className="min-h-screen mobile-full-height bg-black text-white flex flex-col w-full overflow-x-hidden max-w-[100vw]">
      <PullToRefresh
        onRefresh={handleRefresh}
        className="flex flex-col min-h-screen"
      >
        <AuthHeader />
        <main className="flex-grow w-full mobile-safe-area overflow-x-hidden pb-safe">
          {children}
        </main>
        <div className="h-[20px] md:h-0 mobile-safe-bottom"></div>
      </PullToRefresh>
    </div>
  );
};

export default Layout;
