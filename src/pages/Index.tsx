
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
      "name": "بدنسازی هوشمند با LiftLegends",
      "url": "https://liftlegends.ir/",
      "potentialAction": {
        "@type": "SearchAction",
        "target": "https://liftlegends.ir/search?q={search_term_string}",
        "query-input": "required name=search_term_string"
      },
      "description": "بهترین برنامه بدنسازی و تناسب اندام با هوش مصنوعی - برنامه تمرینی هوشمند، رژیم غذایی شخصی‌سازی شده و مشاوره تخصصی مکمل و استرویید",
      "keywords": "بدنسازی، برنامه بدنسازی، تناسب اندام، مربی بدنسازی، برنامه تمرینی بدنسازی، رژیم غذایی بدنسازی، مکمل بدنسازی، استرویید، فیتنس، اپلیکیشن بدنسازی",
      "publisher": {
        "@type": "Organization",
        "name": "LiftLegends - بدنسازی هوشمند",
        "logo": {
          "@type": "ImageObject",
          "url": "https://wagixhjktcodkdkgtgdj.supabase.co/storage/v1/object/public/legends//white%20logo.png"
        }
      },
      "mainEntity": {
        "@type": "SoftwareApplication",
        "name": "LiftLegends - اپلیکیشن بدنسازی",
        "applicationCategory": "HealthApplication",
        "operatingSystem": "Android",
        "offers": {
          "@type": "Offer",
          "price": "0",
          "priceCurrency": "IRR"
        },
        "description": "اپلیکیشن بدنسازی هوشمند با برنامه تمرینی و رژیم غذایی شخصی‌سازی شده"
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
        <title>بدنسازی هوشمند با LiftLegends | برنامه تمرینی و رژیم غذایی شخصی‌سازی شده</title>
        <meta name="description" content="بهترین برنامه بدنسازی و تناسب اندام با هوش مصنوعی - برنامه تمرینی هوشمند، رژیم غذایی شخصی‌سازی شده و مشاوره تخصصی مکمل و استرویید. دانلود اپلیکیشن رایگان بدنسازی LiftLegends." />
        <meta name="keywords" content="بدنسازی، برنامه بدنسازی، تناسب اندام، مربی بدنسازی، برنامه تمرینی بدنسازی، رژیم غذایی بدنسازی، مکمل بدنسازی، استرویید، فیتنس، اپلیکیشن بدنسازی" />
        <meta property="og:title" content="بدنسازی هوشمند با LiftLegends | برنامه تمرینی و رژیم غذایی" />
        <meta property="og:description" content="بهترین برنامه بدنسازی و تناسب اندام با هوش مصنوعی - برنامه تمرینی هوشمند، رژیم غذایی شخصی‌سازی شده و مشاوره تخصصی. دانلود اپلیکیشن رایگان!" />
        <meta property="og:image" content="https://wagixhjktcodkdkgtgdj.supabase.co/storage/v1/object/public/legends//white%20logo.png" />
        <meta property="og:url" content="https://liftlegends.ir/" />
        <meta property="og:type" content="website" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="بدنسازی هوشمند با LiftLegends | برنامه تمرینی و رژیم غذایی" />
        <meta name="twitter:description" content="بهترین برنامه بدنسازی و تناسب اندام با هوش مصنوعی - برنامه تمرینی هوشمند، رژیم غذایی شخصی‌سازی شده و مشاوره تخصصی. دانلود اپلیکیشن رایگان!" />
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
