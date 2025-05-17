
import HeroSection from "@/components/HeroSection";
import FeaturesSection from "@/components/FeaturesSection";
import TestimonialsSection from "@/components/TestimonialsSection";
import FaqSection from "@/components/FaqSection";
import FooterSection from "@/components/FooterSection";
import { useEffect } from "react";

const Index = () => {
  // Structured data is now added directly in the HTML head for better performance

  return (
    <>
      <HeroSection />
      <FeaturesSection />
      {/* <TestimonialsSection />
      <FaqSection /> */}
      <FooterSection />
    </>
  );
};

export default Index;
