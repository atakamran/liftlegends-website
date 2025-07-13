
import HeroSection from "@/components/HeroSection";
import FeaturesSection from "@/components/FeaturesSection";
import ProgramsSection from "@/components/ProgramsSection";
import CTASection from "@/components/CTASection";
import FaqSection from "@/components/FaqSection";
import BlogSection from "@/components/blog/BlogSection";
import FooterSection from "@/components/FooterSection";
import { useEffect } from "react";
import { Helmet } from "react-helmet";

const Index = () => {
  // Add comprehensive SEO metadata and structured data
  useEffect(() => {
    // Remove any existing structured data scripts
    const existingScripts = document.querySelectorAll('script[type="application/ld+json"]');
    existingScripts.forEach(script => script.remove());

    // 1. Organization Schema
    const organizationScript = document.createElement('script');
    organizationScript.type = 'application/ld+json';
    organizationScript.innerHTML = JSON.stringify({
      "@context": "https://schema.org",
      "@type": "Organization",
      "name": "Lift Legends",
      "alternateName": "لیفت لجندز",
      "url": "https://liftlegends.ir/",
      "logo": {
        "@type": "ImageObject",
        "url": "https://wagixhjktcodkdkgtgdj.supabase.co/storage/v1/object/public/legends//white%20logo.png",
        "width": 200,
        "height": 200
      },
      "description": "شرکت توسعه‌دهنده اپلیکیشن بدنسازی هوشمند با هوش مصنوعی",
      "foundingDate": "2024",
      "industry": "Health & Fitness Technology",
      "knowsAbout": [
        "بدنسازی",
        "تناسب اندام", 
        "هوش مصنوعی",
        "برنامه تمرینی",
        "رژیم غذایی",
        "مکمل‌های ورزشی"
      ],
      "sameAs": [
        "https://liftlegends.ir/"
      ],
      "contactPoint": {
        "@type": "ContactPoint",
        "contactType": "customer service",
        "availableLanguage": ["Persian", "English"]
      }
    });
    document.head.appendChild(organizationScript);

    // 2. Website Schema
    const websiteScript = document.createElement('script');
    websiteScript.type = 'application/ld+json';
    websiteScript.innerHTML = JSON.stringify({
      "@context": "https://schema.org",
      "@type": "WebSite",
      "name": "Lift Legends - بدنسازی هوشمند",
      "alternateName": "لیفت لجندز",
      "url": "https://liftlegends.ir/",
      "description": "بهترین اپلیکیشن بدنسازی و تناسب اندام با هوش مصنوعی - برنامه تمرینی هوشمند، رژیم غذایی شخصی‌سازی شده و مشاوره تخصصی",
      "inLanguage": "fa-IR",
      "publisher": {
        "@type": "Organization",
        "name": "Lift Legends"
      },
      "potentialAction": {
        "@type": "SearchAction",
        "target": {
          "@type": "EntryPoint",
          "urlTemplate": "https://liftlegends.ir/search?q={search_term_string}"
        },
        "query-input": "required name=search_term_string"
      },
      "mainEntity": {
        "@id": "https://liftlegends.ir/#mobileapp"
      }
    });
    document.head.appendChild(websiteScript);

    // 3. Mobile Application Schema (Main Product)
    const appScript = document.createElement('script');
    appScript.type = 'application/ld+json';
    appScript.innerHTML = JSON.stringify({
      "@context": "https://schema.org",
      "@type": "MobileApplication",
      "@id": "https://liftlegends.ir/#mobileapp",
      "name": "Lift Legends",
      "alternateName": "لیفت لجندز",
      "description": "اپلیکیشن بدنسازی هوشمند با هوش مصنوعی پیشرفته، برنامه تمرینی شخصی‌سازی شده، رژیم غذایی هوشمند و مشاوره مکمل و استرویید",
      "applicationCategory": "HealthApplication",
      "applicationSubCategory": "Fitness",
      "operatingSystem": "Android",
      "softwareVersion": "1.0.0",
      "datePublished": "2024-01-01",
      "dateModified": "2024-12-01",
      "inLanguage": "fa-IR",
      "contentRating": "Everyone",
      "author": {
        "@type": "Organization",
        "name": "Lift Legends"
      },
      "publisher": {
        "@type": "Organization", 
        "name": "Lift Legends"
      },
      "downloadUrl": "https://liftlegends.ir/download",
      "installUrl": "https://liftlegends.ir/download",
      "screenshot": [
        "https://wagixhjktcodkdkgtgdj.supabase.co/storage/v1/object/public/legends//white%20logo.png"
      ],
      "featureList": [
        "برنامه تمرینی هوشمند با هوش مصنوعی",
        "رژیم غذایی شخصی‌سازی شده",
        "مشاوره مکمل و استرویید",
        "پیگیری پیشرفت",
        "مربی مجازی",
        "کتابخانه تمرینات",
        "محاسبه کالری",
        "برنامه‌ریزی وعده‌های غذایی"
      ],
      "offers": {
        "@type": "Offer",
        "price": "0",
        "priceCurrency": "IRR",
        "availability": "https://schema.org/InStock",
        "category": "Free with Premium Options"
      },
      "aggregateRating": {
        "@type": "AggregateRating",
        "ratingValue": "4.8",
        "ratingCount": "1250",
        "bestRating": "5",
        "worstRating": "1"
      },
      "review": [
        {
          "@type": "Review",
          "author": {
            "@type": "Person",
            "name": "علی محمدی"
          },
          "reviewRating": {
            "@type": "Rating",
            "ratingValue": "5",
            "bestRating": "5"
          },
          "reviewBody": "بهترین اپلیکیشن بدنسازی که تا حالا استفاده کردم. برنامه تمرینی هوشمندش واقعاً کارآمده."
        }
      ]
    });
    document.head.appendChild(appScript);

    // 4. Service Schema
    const serviceScript = document.createElement('script');
    serviceScript.type = 'application/ld+json';
    serviceScript.innerHTML = JSON.stringify({
      "@context": "https://schema.org",
      "@type": "Service",
      "name": "خدمات بدنسازی هوشمند Lift Legends",
      "description": "ارائه برنامه تمرینی شخصی‌سازی شده، رژیم غذایی هوشمند و مشاوره مکمل با استفاده از هوش مصنوعی",
      "provider": {
        "@type": "Organization",
        "name": "Lift Legends"
      },
      "serviceType": "Fitness & Health Consulting",
      "areaServed": {
        "@type": "Country",
        "name": "Iran"
      },
      "hasOfferCatalog": {
        "@type": "OfferCatalog",
        "name": "خدمات بدنسازی",
        "itemListElement": [
          {
            "@type": "Offer",
            "itemOffered": {
              "@type": "Service",
              "name": "برنامه تمرینی هوشمند",
              "description": "برنامه تمرینی شخصی‌سازی شده با هوش مصنوعی"
            }
          },
          {
            "@type": "Offer", 
            "itemOffered": {
              "@type": "Service",
              "name": "رژیم غذایی هوشمند",
              "description": "برنامه غذایی شخصی‌سازی شده بر اساس اهداف و نیازهای فردی"
            }
          },
          {
            "@type": "Offer",
            "itemOffered": {
              "@type": "Service", 
              "name": "مشاوره مکمل و استرویید",
              "description": "راهنمایی تخصصی در انتخاب و مصرف مکمل‌های ورزشی"
            }
          }
        ]
      }
    });
    document.head.appendChild(serviceScript);

    // 5. FAQ Schema
    const faqScript = document.createElement('script');
    faqScript.type = 'application/ld+json';
    faqScript.innerHTML = JSON.stringify({
      "@context": "https://schema.org",
      "@type": "FAQPage",
      "mainEntity": [
        {
          "@type": "Question",
          "name": "آیا Lift Legends رایگان است؟",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "بله، Lift Legends یک نسخه رایگان با امکانات پایه دارد. برای دسترسی به امکانات پیشرفته مانند برنامه‌های غذایی شخصی‌سازی شده و مربی هوش مصنوعی، نیاز به خرید اشتراک دارید."
          }
        },
        {
          "@type": "Question",
          "name": "چگونه برنامه تمرینی هوشمند کار می‌کند؟",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "برنامه تمرینی هوشمند Lift Legends با استفاده از هوش مصنوعی و بر اساس اطلاعات شما (سن، وزن، قد، سطح تجربه، اهداف) یک برنامه کاملاً شخصی‌سازی شده طراحی می‌کند."
          }
        },
        {
          "@type": "Question",
          "name": "آیا برای مبتدیان مناسب است؟",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "بله، Lift Legends برای تمام سطوح از مبتدی تا حرفه‌ای طراحی شده است. برنامه‌های تمرینی بر اساس سطح تجربه شما تنظیم می‌شود."
          }
        }
      ]
    });
    document.head.appendChild(faqScript);

    // 6. BreadcrumbList Schema
    const breadcrumbScript = document.createElement('script');
    breadcrumbScript.type = 'application/ld+json';
    breadcrumbScript.innerHTML = JSON.stringify({
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      "itemListElement": [
        {
          "@type": "ListItem",
          "position": 1,
          "name": "خانه",
          "item": "https://liftlegends.ir/"
        }
      ]
    });
    document.head.appendChild(breadcrumbScript);

    return () => {
      // Cleanup all structured data scripts when component unmounts
      const scripts = document.querySelectorAll('script[type="application/ld+json"]');
      scripts.forEach(script => {
        if (script.parentNode) {
          script.parentNode.removeChild(script);
        }
      });
    };
  }, []);

  return (
    <>
      <Helmet>
        {/* Primary Meta Tags */}
        <title>بدنسازی هوشمند با Lift Legends | برنامه تمرینی و رژیم غذایی شخصی‌سازی شده</title>
        <meta name="title" content="بدنسازی هوشمند با Lift Legends | برنامه تمرینی و رژیم غذایی شخصی‌سازی شده" />
        <meta name="description" content="بهترین اپلیکیشن بدنسازی و تناسب اندام با هوش مصنوعی - برنامه تمرینی هوشمند، رژیم غذایی شخصی‌سازی شده و مشاوره تخصصی مکمل و استرویید. دانلود رایگان Lift Legends." />
        <meta name="keywords" content="بدنسازی، برنامه بدنسازی، تناسب اندام، مربی بدنسازی، برنامه تمرینی بدنسازی، رژیم غذایی بدنسازی، مکمل بدنسازی، استرویید، فیتنس، اپلیکیشن بدنسازی، هوش مصنوعی، AI fitness، personal trainer" />
        <meta name="author" content="Lift Legends" />
        <meta name="robots" content="index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1" />
        <meta name="language" content="Persian" />
        <meta name="revisit-after" content="7 days" />
        <meta name="distribution" content="global" />
        <meta name="rating" content="general" />
        
        {/* Geo Tags */}
        <meta name="geo.region" content="IR" />
        <meta name="geo.country" content="Iran" />
        <meta name="geo.placename" content="Iran" />
        
        {/* Mobile Optimization */}
        <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=5.0" />
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
        <meta name="apple-mobile-web-app-title" content="Lift Legends" />
        
        {/* Open Graph / Facebook */}
        <meta property="og:type" content="website" />
        <meta property="og:site_name" content="Lift Legends" />
        <meta property="og:title" content="بدنسازی هوشمند با Lift Legends | برنامه تمرینی و رژیم غذایی" />
        <meta property="og:description" content="بهترین اپلیکیشن بدنسازی و تناسب اندام با هوش مصنوعی - برنامه تمرینی هوشمند، رژیم غذایی شخصی‌سازی شده و مشاوره تخصصی. دانلود رایگان!" />
        <meta property="og:image" content="https://wagixhjktcodkdkgtgdj.supabase.co/storage/v1/object/public/legends//white%20logo.png" />
        <meta property="og:image:width" content="1200" />
        <meta property="og:image:height" content="630" />
        <meta property="og:image:alt" content="Lift Legends - اپلیکیشن بدنسازی هوشمند" />
        <meta property="og:url" content="https://liftlegends.ir/" />
        <meta property="og:locale" content="fa_IR" />
        
        {/* Twitter */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:site" content="@liftlegends" />
        <meta name="twitter:creator" content="@liftlegends" />
        <meta name="twitter:title" content="بدنسازی هوشمند با Lift Legends | برنامه تمرینی و رژیم غذایی" />
        <meta name="twitter:description" content="بهترین اپلیکیشن بدنسازی و تناسب اندام با هوش مصنوعی - برنامه تمرینی هوشمند، رژیم غذایی شخصی‌سازی شده و مشاوره تخصصی. دانلود رایگان!" />
        <meta name="twitter:image" content="https://wagixhjktcodkdkgtgdj.supabase.co/storage/v1/object/public/legends//white%20logo.png" />
        <meta name="twitter:image:alt" content="Lift Legends - اپلیکیشن بدنسازی هوشمند" />
        
        {/* Additional SEO Tags */}
        <meta name="theme-color" content="#D4AF37" />
        <meta name="msapplication-TileColor" content="#D4AF37" />
        <meta name="application-name" content="Lift Legends" />
        
        {/* Canonical and Alternate */}
        <link rel="canonical" href="https://liftlegends.ir/" />
        <link rel="alternate" hrefLang="fa" href="https://liftlegends.ir/" />
        <link rel="alternate" hrefLang="x-default" href="https://liftlegends.ir/" />
        
        {/* Preconnect for Performance */}
        <link rel="preconnect" href="https://wagixhjktcodkdkgtgdj.supabase.co" />
        <link rel="dns-prefetch" href="https://wagixhjktcodkdkgtgdj.supabase.co" />
      </Helmet>
      <HeroSection />
      <FeaturesSection />
      <ProgramsSection />
      <CTASection />
      <FaqSection />
      <BlogSection />
      <FooterSection />
    </>
  );
};

export default Index;
