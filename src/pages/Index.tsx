
import HeroSection from "@/components/HeroSection";
import FeaturesSection from "@/components/FeaturesSection";
import FaqSection from "@/components/FaqSection";
import BlogSection from "@/components/BlogSection";
import FooterSection from "@/components/FooterSection";
import { useEffect } from "react";
import { Helmet } from "react-helmet";

const Index = () => {
  // Add SEO metadata and structured data
  useEffect(() => {
    // Add structured data for SEO
    const script = document.createElement('script');
    script.type = 'application/ld+json';
    script.innerHTML = JSON.stringify({
      "@context": "https://schema.org",
      "@type": "WebSite",
      "name": "LiftLegends - مربی بدنسازی هوشمند",
      "url": "https://liftlegends.ir/",
      "potentialAction": {
        "@type": "SearchAction",
        "target": "https://liftlegends.ir/search?q={search_term_string}",
        "query-input": "required name=search_term_string"
      },
      "description": "مربی بدنسازی هوشمند با هوش مصنوعی پیشرفته، برنامه تمرینی و رژیم غذایی شخصی‌سازی شده",
      "publisher": {
        "@type": "Organization",
        "name": "LiftLegends",
        "logo": {
          "@type": "ImageObject",
          "url": "https://wagixhjktcodkdkgtgdj.supabase.co/storage/v1/object/public/legends//white%20logo.png"
        }
      }
    });
    document.head.appendChild(script);

    return () => {
      document.head.removeChild(script);
    };
  }, []);

  return (
    <>
      <Helmet>
        <title>LiftLegends - مربی بدنسازی هوشمند با هوش مصنوعی</title>
        <meta name="description" content="مربی بدنسازی هوشمند با هوش مصنوعی پیشرفته، برنامه تمرینی و رژیم غذایی شخصی‌سازی شده. دانلود اپلیکیشن LiftLegends برای اندروید." />
        <meta name="keywords" content="مربی بدنسازی, هوش مصنوعی, برنامه تمرینی, رژیم غذایی, مکمل, استرویید, اپلیکیشن بدنسازی" />
        <meta property="og:title" content="LiftLegends - مربی بدنسازی هوشمند با هوش مصنوعی" />
        <meta property="og:description" content="مربی بدنسازی هوشمند با هوش مصنوعی پیشرفته، برنامه تمرینی و رژیم غذایی شخصی‌سازی شده. دانلود اپلیکیشن LiftLegends برای اندروید." />
        <meta property="og:image" content="https://wagixhjktcodkdkgtgdj.supabase.co/storage/v1/object/public/legends//white%20logo.png" />
        <meta property="og:url" content="https://liftlegends.ir/" />
        <meta property="og:type" content="website" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="LiftLegends - مربی بدنسازی هوشمند با هوش مصنوعی" />
        <meta name="twitter:description" content="مربی بدنسازی هوشمند با هوش مصنوعی پیشرفته، برنامه تمرینی و رژیم غذایی شخصی‌سازی شده. دانلود اپلیکیشن LiftLegends برای اندروید." />
        <meta name="twitter:image" content="https://wagixhjktcodkdkgtgdj.supabase.co/storage/v1/object/public/legends//white%20logo.png" />
        <link rel="canonical" href="https://liftlegends.ir/" />
      </Helmet>
      <HeroSection />
      <FeaturesSection />
      <BlogSection />
      <FaqSection />
      <FooterSection />
    </>
  );
};

export default Index;
