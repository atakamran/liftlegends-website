import { useEffect } from 'react';

interface SEOProps {
  title: string;
  description: string;
  keywords?: string;
  ogType?: 'website' | 'article' | 'product';
  ogImage?: string;
  ogUrl?: string;
  twitterCard?: 'summary' | 'summary_large_image';
  canonicalUrl?: string;
  noIndex?: boolean;
}

/**
 * Custom hook to dynamically update meta tags for SEO
 * This is an alternative to using Helmet when you need to update meta tags programmatically
 */
const useSEO = ({
  title,
  description,
  keywords,
  ogType = 'website',
  ogImage,
  ogUrl,
  twitterCard = 'summary_large_image',
  canonicalUrl,
  noIndex = false
}: SEOProps) => {
  useEffect(() => {
    // Update document title
    document.title = title;
    
    // Helper function to update meta tag
    const updateMetaTag = (name: string, content: string) => {
      let meta = document.querySelector(`meta[name="${name}"]`) || 
                document.querySelector(`meta[property="${name}"]`);
      
      if (!meta) {
        meta = document.createElement('meta');
        if (name.startsWith('og:') || name.startsWith('twitter:')) {
          meta.setAttribute('property', name);
        } else {
          meta.setAttribute('name', name);
        }
        document.head.appendChild(meta);
      }
      
      meta.setAttribute('content', content);
    };
    
    // Update basic meta tags
    updateMetaTag('description', description);
    if (keywords) updateMetaTag('keywords', keywords);
    if (noIndex) {
      updateMetaTag('robots', 'noindex, nofollow');
    } else {
      updateMetaTag('robots', 'index, follow');
    }
    
    // Update Open Graph meta tags
    updateMetaTag('og:title', title);
    updateMetaTag('og:description', description);
    updateMetaTag('og:type', ogType);
    if (ogImage) updateMetaTag('og:image', ogImage);
    if (ogUrl) updateMetaTag('og:url', ogUrl);
    
    // Update Twitter meta tags
    updateMetaTag('twitter:card', twitterCard);
    updateMetaTag('twitter:title', title);
    updateMetaTag('twitter:description', description);
    if (ogImage) updateMetaTag('twitter:image', ogImage);
    
    // Update canonical URL
    let canonicalTag = document.querySelector('link[rel="canonical"]');
    if (!canonicalTag && canonicalUrl) {
      canonicalTag = document.createElement('link');
      canonicalTag.setAttribute('rel', 'canonical');
      document.head.appendChild(canonicalTag);
    }
    
    if (canonicalTag && canonicalUrl) {
      canonicalTag.setAttribute('href', canonicalUrl);
    }
    
    // Clean up function
    return () => {
      // Optional: Remove custom meta tags when component unmounts
      // This is usually not necessary as they will be overwritten by the next page
    };
  }, [
    title,
    description,
    keywords,
    ogType,
    ogImage,
    ogUrl,
    twitterCard,
    canonicalUrl,
    noIndex
  ]);
};

export default useSEO;