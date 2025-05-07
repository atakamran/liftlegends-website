
import HeroSection from "@/components/HeroSection";
import FeaturesSection from "@/components/FeaturesSection";
import TestimonialsSection from "@/components/TestimonialsSection";
import FaqSection from "@/components/FaqSection";
import FooterSection from "@/components/FooterSection";
import { useEffect } from "react";

const Index = () => {
  // Add structured data for SEO
  useEffect(() => {
    const structuredData = {
      "@context": "https://schema.org",
      "@type": "SoftwareApplication",
      "name": "LiftLegends",
      "applicationCategory": "HealthApplication",
      "operatingSystem": "Android",
      "offers": {
        "@type": "Offer",
        "price": "0",
        "priceCurrency": "IRR"
      },
      "aggregateRating": {
        "@type": "AggregateRating",
        "ratingValue": "4.8",
        "ratingCount": "1000",
        "bestRating": "5",
        "worstRating": "1"
      },
      "description": "برنامه تمرینی هوشمند و رژیم غذایی شخصی‌سازی شده با هوش مصنوعی برای بدنسازی و تناسب اندام"
    };

    // Add structured data to the page
    const script = document.createElement('script');
    script.type = 'application/ld+json';
    script.text = JSON.stringify(structuredData);
    document.head.appendChild(script);

    return () => {
      document.head.removeChild(script);
    };
  }, []);

  return (
    <div className="min-h-screen bg-black text-white">
      <HeroSection />
      <FeaturesSection />
      {/* <TestimonialsSection />
      <FaqSection /> */}
      <FooterSection />
    </div>
  );
};

export default Index;
