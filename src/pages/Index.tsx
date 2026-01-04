import HeroSection from "@/components/HeroSection";
import FeaturesSection from "@/components/FeaturesSection";
import ProgramsSection from "@/components/ProgramsSection";
import GymsSection from "@/components/GymsSection";
import CoachesSection from "@/components/CoachesSection";
import CTASection from "@/components/CTASection";
import FaqSection from "@/components/FaqSection";
import BlogSection from "@/components/blog/BlogSection";
import FooterSection from "@/components/FooterSection";
import { Helmet } from "react-helmet";

const Index = () => {
  const structuredData = {
    "@context": "https://schema.org",
    "@graph": [
      {
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
          "برنامه تمرینی رایگان",
          "بدنسازی",
          "برنامه بدنسازی",
          "برنامه تمرینی",
          "تناسب اندام",
          "هوش مصنوعی",
          "رژیم غذایی بدنسازی",
          "مکمل‌های ورزشی",
          "تمرینات بدنسازی",
          "برنامه ورزشی"
        ],
        "sameAs": [
          "https://liftlegends.ir/"
        ],
        "contactPoint": {
          "@type": "ContactPoint",
          "contactType": "customer service",
          "availableLanguage": ["Persian", "English"]
        }
      },
      {
        "@type": "WebSite",
        "name": "Lift Legends - برنامه تمرینی رایگان بدنسازی",
        "alternateName": "لیفت لجندز",
        "url": "https://liftlegends.ir/",
        "description": "بهترین برنامه تمرینی رایگان بدنسازی با هوش مصنوعی - برنامه تمرینی شخصی‌سازی شده، رژیم غذایی بدنسازی و مشاوره تخصصی مکمل",
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
      },
      {
        "@type": "MobileApplication",
        "@id": "https://liftlegends.ir/#mobileapp",
        "name": "Lift Legends",
        "alternateName": "لیفت لجندز",
        "description": "بهترین برنامه تمرینی رایگان بدنسازی با هوش مصنوعی پیشرفته، برنامه تمرینی شخصی‌سازی شده، رژیم غذایی بدنسازی هوشمند و مشاوره مکمل و استرویید",
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
          "برنامه تمرینی رایگان شخصی‌سازی شده",
          "برنامه بدنسازی هوشمند با هوش مصنوعی",
          "رژیم غذایی بدنسازی شخصی‌سازی شده",
          "مشاوره مکمل و استرویید",
          "تمرینات بدنسازی کامل",
          "پیگیری پیشرفت بدنسازی",
          "مربی مجازی بدنسازی",
          "کتابخانه تمرینات بدنسازی",
          "محاسبه کالری و ماکروها",
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
      },
      {
        "@type": "Service",
        "name": "برنامه تمرینی رایگان بدنسازی Lift Legends",
        "description": "ارائه برنامه تمرینی رایگان بدنسازی، برنامه بدنسازی شخصی‌سازی شده، رژیم غذایی بدنسازی هوشمند و مشاوره مکمل با استفاده از هوش مصنوعی",
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
                "name": "برنامه تمرینی رایگان بدنسازی",
                "description": "برنامه تمرینی رایگان بدنسازی شخصی‌سازی شده با هوش مصنوعی"
              }
            },
            {
              "@type": "Offer",
              "itemOffered": {
                "@type": "Service",
                "name": "رژیم غذایی بدنسازی",
                "description": "برنامه غذایی بدنسازی شخصی‌سازی شده بر اساس اهداف و نیازهای فردی"
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
      },
      {
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
            "name": "چگونه برنامه تمرینی رایگان بدنسازی کار می‌کند؟",
            "acceptedAnswer": {
              "@type": "Answer",
              "text": "برنامه تمرینی رایگان بدنسازی Lift Legends با استفاده از هوش مصنوعی و بر اساس اطلاعات شما (سن، وزن، قد، سطح تجربه، اهداف بدنسازی) یک برنامه بدنسازی کاملاً شخصی‌سازی شده طراحی می‌کند."
            }
          },
          {
            "@type": "Question",
            "name": "آیا برنامه تمرینی رایگان برای مبتدیان بدنسازی مناسب است؟",
            "acceptedAnswer": {
              "@type": "Answer",
              "text": "بله، برنامه تمرینی رایگان بدنسازی Lift Legends برای تمام سطوح از مبتدی تا حرفه‌ای طراحی شده است. برنامه‌های بدنسازی بر اساس سطح تجربه شما تنظیم می‌شود."
            }
          },
          {
            "@type": "Question",
            "name": "چه تمریناتی در برنامه بدنسازی رایگان موجود است؟",
            "acceptedAnswer": {
              "@type": "Answer",
              "text": "برنامه تمرینی رایگان بدنسازی شامل تمرینات کامل بدنسازی مانند تمرینات قدرتی، کارکردی، کارتیو و کششی است. همه تمرینات بدنسازی با راهنمایی تصویری و توضیحات کامل ارائه می‌شود."
            }
          }
        ]
      },
      {
        "@type": "BreadcrumbList",
        "itemListElement": [
          {
            "@type": "ListItem",
            "position": 1,
            "name": "خانه",
            "item": "https://liftlegends.ir/"
          }
        ]
      }
    ]
  };

  return (
    <>
      <Helmet>
        {/* Primary Meta Tags */}
        <title>Lift Legends | افسانه خودت را بساز با برنامه تمرینی هوشمند</title>
        <meta name="title" content="Lift Legends | افسانه خودت را بساز با برنامه تمرینی هوشمند" />
        <meta name="description" content="با Lift Legends افسانه خود را بسازید. برنامه تمرینی و رژیم غذایی شخصی‌سازی شده با هوش مصنوعی برای رسیدن به اوج قدرت و تناسب اندام. همین امروز رایگان شروع کنید." />
        <meta name="keywords" content="برنامه تمرینی رایگان، بدنسازی، برنامه بدنسازی، برنامه تمرینی، تناسب اندام، مربی بدنسازی، برنامه تمرینی بدنسازی، رژیم غذایی بدنسازی، مکمل بدنسازی، استرویید، فیتنس، اپلیکیشن بدنسازی، هوش مصنوعی، برنامه ورزشی رایگان، تمرینات بدنسازی، AI fitness، personal trainer" />
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
        <meta property="og:title" content="برنامه تمرینی رایگان بدنسازی | Lift Legends - برنامه بدنسازی هوشمند" />
        <meta property="og:description" content="دانلود رایگان بهترین برنامه تمرینی بدنسازی با هوش مصنوعی. برنامه تمرینی رایگان شخصی‌سازی شده، رژیم غذایی بدنسازی و مشاوره مکمل." />
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
        <meta name="twitter:title" content="برنامه تمرینی رایگان بدنسازی | Lift Legends - برنامه بدنسازی هوشمند" />
        <meta name="twitter:description" content="دانلود رایگان بهترین برنامه تمرینی بدنسازی با هوش مصنوعی. برنامه تمرینی رایگان شخصی‌سازی شده، رژیم غذایی بدنسازی و مشاوره مکمل." />
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

        {/* Add JSON-LD structured data */}
        <script type="application/ld+json">
          {JSON.stringify(structuredData)}
        </script>
      </Helmet>
      <HeroSection />
      <FeaturesSection />
      <ProgramsSection />
      <GymsSection />
      <CoachesSection />
      <CTASection />
      <FaqSection />
      <BlogSection />
      <FooterSection />
    </>
  );
};

export default Index;
