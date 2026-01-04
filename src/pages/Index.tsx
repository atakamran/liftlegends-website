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
        "alternateName": "LiftLegends",
        "url": "https://liftlegends.io/",
        "logo": {
          "@type": "ImageObject",
          "url": "https://wagixhjktcodkdkgtgdj.supabase.co/storage/v1/object/public/legends//white%20logo.png",
          "width": 200,
          "height": 200
        },
        "description": "AI-powered fitness platform delivering personalized training programs, nutrition plans, and supplement guidance",
        "foundingDate": "2024",
        "industry": "Health & Fitness Technology",
        "knowsAbout": [
          "Personalized Training Programs",
          "AI Fitness Coaching",
          "Nutrition Planning",
          "Supplement Guidance",
          "Strength Training",
          "Body Transformation",
          "Workout Programming",
          "Performance Enhancement"
        ],
        "sameAs": [
          "https://liftlegends.io/"
        ],
        "contactPoint": {
          "@type": "ContactPoint",
          "contactType": "customer service",
          "availableLanguage": ["English"]
        }
      },
      {
        "@type": "WebSite",
        "name": "Lift Legends - AI-Powered Fitness Platform",
        "alternateName": "LiftLegends",
        "url": "https://liftlegends.io/",
        "description": "Transform your physique with AI-driven personalized training programs, smart nutrition plans, and expert supplement guidance. Start your legend today.",
        "inLanguage": "en-US",
        "publisher": {
          "@type": "Organization",
          "name": "Lift Legends"
        },
        "potentialAction": {
          "@type": "SearchAction",
          "target": {
            "@type": "EntryPoint",
            "urlTemplate": "https://liftlegends.io/search?q={search_term_string}"
          },
          "query-input": "required name=search_term_string"
        },
        "mainEntity": {
          "@id": "https://liftlegends.io/#mobileapp"
        }
      },
      {
        "@type": "MobileApplication",
        "@id": "https://liftlegends.io/#mobileapp",
        "name": "Lift Legends",
        "alternateName": "LiftLegends Fitness App",
        "description": "The ultimate AI-powered fitness companion. Get personalized training programs, smart nutrition plans, and expert supplement guidance tailored to your goals.",
        "applicationCategory": "HealthApplication",
        "applicationSubCategory": "Fitness",
        "operatingSystem": "Android, iOS",
        "softwareVersion": "1.0.0",
        "datePublished": "2024-01-01",
        "dateModified": "2024-12-01",
        "inLanguage": "en-US",
        "contentRating": "Everyone",
        "author": {
          "@type": "Organization",
          "name": "Lift Legends"
        },
        "publisher": {
          "@type": "Organization",
          "name": "Lift Legends"
        },
        "downloadUrl": "https://liftlegends.io/download",
        "installUrl": "https://liftlegends.io/download",
        "screenshot": [
          "https://wagixhjktcodkdkgtgdj.supabase.co/storage/v1/object/public/legends//white%20logo.png"
        ],
        "featureList": [
          "AI-Personalized Training Programs",
          "Smart Nutrition Planning",
          "Supplement & PED Guidance",
          "Progress Tracking & Analytics",
          "Virtual AI Coach",
          "Exercise Library with Videos",
          "Macro & Calorie Calculator",
          "Meal Planning Tools"
        ],
        "offers": {
          "@type": "Offer",
          "price": "0",
          "priceCurrency": "USD",
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
              "name": "Mike Johnson"
            },
            "reviewRating": {
              "@type": "Rating",
              "ratingValue": "5",
              "bestRating": "5"
            },
            "reviewBody": "Best fitness app I've ever used. The AI-powered training programs are incredibly effective and adapt to my progress perfectly."
          }
        ]
      },
      {
        "@type": "Service",
        "name": "Lift Legends AI Fitness Platform",
        "description": "Comprehensive fitness platform offering AI-personalized training programs, smart nutrition plans, and expert supplement guidance for optimal results.",
        "provider": {
          "@type": "Organization",
          "name": "Lift Legends"
        },
        "serviceType": "Fitness & Health Consulting",
        "areaServed": {
          "@type": "Place",
          "name": "Worldwide"
        },
        "hasOfferCatalog": {
          "@type": "OfferCatalog",
          "name": "Fitness Services",
          "itemListElement": [
            {
              "@type": "Offer",
              "itemOffered": {
                "@type": "Service",
                "name": "AI Training Programs",
                "description": "Personalized workout programs powered by artificial intelligence"
              }
            },
            {
              "@type": "Offer",
              "itemOffered": {
                "@type": "Service",
                "name": "Smart Nutrition Plans",
                "description": "Customized meal plans based on your goals and preferences"
              }
            },
            {
              "@type": "Offer",
              "itemOffered": {
                "@type": "Service",
                "name": "Supplement Guidance",
                "description": "Expert recommendations for supplements and performance enhancers"
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
            "name": "Is Lift Legends free to use?",
            "acceptedAnswer": {
              "@type": "Answer",
              "text": "Yes, Lift Legends offers a free tier with core features. For advanced features like personalized nutrition plans and AI coaching, premium subscriptions are available."
            }
          },
          {
            "@type": "Question",
            "name": "How does the AI training program work?",
            "acceptedAnswer": {
              "@type": "Answer",
              "text": "Our AI analyzes your profile (age, weight, height, experience level, goals, and limitations) to create a fully personalized training program that adapts as you progress."
            }
          },
          {
            "@type": "Question",
            "name": "Is Lift Legends suitable for beginners?",
            "acceptedAnswer": {
              "@type": "Answer",
              "text": "Absolutely! Lift Legends is designed for all fitness levels, from complete beginners to advanced athletes. Programs automatically adjust to your experience level."
            }
          },
          {
            "@type": "Question",
            "name": "What types of workouts are available?",
            "acceptedAnswer": {
              "@type": "Answer",
              "text": "Our platform includes strength training, HIIT, cardio, functional fitness, and flexibility workouts. All exercises come with video demonstrations and detailed instructions."
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
            "name": "Home",
            "item": "https://liftlegends.io/"
          }
        ]
      }
    ]
  };

  return (
    <>
      <Helmet>
        {/* Primary Meta Tags */}
        <title>Lift Legends | Build Your Legend with AI-Powered Training</title>
        <meta name="title" content="Lift Legends | Build Your Legend with AI-Powered Training" />
        <meta name="description" content="Transform your physique with Lift Legends. AI-personalized training programs, smart nutrition plans, and expert supplement guidance. Start building your legend today – free." />
        <meta name="keywords" content="AI fitness app, personalized training program, workout planner, nutrition plan, supplement guide, strength training, bodybuilding app, fitness coach AI, workout program, body transformation, muscle building, weight loss app" />
        <meta name="author" content="Lift Legends" />
        <meta name="robots" content="index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1" />
        <meta name="language" content="English" />
        <meta name="revisit-after" content="7 days" />
        <meta name="distribution" content="global" />
        <meta name="rating" content="general" />
        
        {/* Geo Tags */}
        <meta name="geo.region" content="US" />
        <meta name="geo.country" content="United States" />
        <meta name="geo.placename" content="Global" />
        
        {/* Mobile Optimization */}
        <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=5.0" />
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
        <meta name="apple-mobile-web-app-title" content="Lift Legends" />
        
        {/* Open Graph / Facebook */}
        <meta property="og:type" content="website" />
        <meta property="og:site_name" content="Lift Legends" />
        <meta property="og:title" content="Lift Legends | AI-Powered Fitness Platform" />
        <meta property="og:description" content="Transform your physique with AI-driven personalized training, smart nutrition plans, and expert supplement guidance. Start free today." />
        <meta property="og:image" content="https://wagixhjktcodkdkgtgdj.supabase.co/storage/v1/object/public/legends//white%20logo.png" />
        <meta property="og:image:width" content="1200" />
        <meta property="og:image:height" content="630" />
        <meta property="og:image:alt" content="Lift Legends - AI-Powered Fitness Platform" />
        <meta property="og:url" content="https://liftlegends.io/" />
        <meta property="og:locale" content="en_US" />
        
        {/* Twitter */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:site" content="@liftlegends" />
        <meta name="twitter:creator" content="@liftlegends" />
        <meta name="twitter:title" content="Lift Legends | AI-Powered Fitness Platform" />
        <meta name="twitter:description" content="Transform your physique with AI-driven personalized training, smart nutrition plans, and expert supplement guidance. Start free today." />
        <meta name="twitter:image" content="https://wagixhjktcodkdkgtgdj.supabase.co/storage/v1/object/public/legends//white%20logo.png" />
        <meta name="twitter:image:alt" content="Lift Legends - AI-Powered Fitness Platform" />
        
        {/* Additional SEO Tags */}
        <meta name="theme-color" content="#D4AF37" />
        <meta name="msapplication-TileColor" content="#D4AF37" />
        <meta name="application-name" content="Lift Legends" />
        
        {/* Canonical and Alternate */}
        <link rel="canonical" href="https://liftlegends.io/" />
        <link rel="alternate" hrefLang="en" href="https://liftlegends.io/" />
        <link rel="alternate" hrefLang="x-default" href="https://liftlegends.io/" />
        
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