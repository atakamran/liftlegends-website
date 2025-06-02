import { ReactNode } from "react";
import AuthHeader from "./header/AuthHeader";
import FooterSection from "./FooterSection";

interface LayoutProps {
  children: ReactNode;
}

const Layout = ({ children }: LayoutProps) => {
  return (
    <div className="min-h-screen mobile-full-height bg-black text-white flex flex-col w-full overflow-x-hidden">
      <AuthHeader />
      <main className="flex-grow w-full mobile-safe-area">
        {children}
      </main>
    </div>
  );
};

export default Layout;