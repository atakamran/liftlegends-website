import { ReactNode } from "react";
import AuthHeader from "./header/AuthHeader";
import FooterSection from "./FooterSection";

interface LayoutProps {
  children: ReactNode;
}

const Layout = ({ children }: LayoutProps) => {
  return (
    <div className="min-h-screen bg-black text-white flex flex-col">
      <AuthHeader />
      <main className="flex-grow">
        {children}
      </main>
    </div>
  );
};

export default Layout;