import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

interface BreadcrumbItem {
  position: number;
  name: string;
  item: string;
}

interface BreadcrumbData {
  path: string;
  breadcrumb: BreadcrumbItem[];
}

interface BreadcrumbsData {
  breadcrumbs: BreadcrumbData[];
}

const BreadcrumbSchema = () => {
  const location = useLocation();
  
  useEffect(() => {
    const addBreadcrumbSchema = async () => {
      try {
        // Fetch breadcrumbs data
        const response = await fetch('/breadcrumbs.json');
        const data: BreadcrumbsData = await response.json();
        
        // Find matching breadcrumb for current path
        const currentPath = location.pathname;
        const breadcrumbData = data.breadcrumbs.find(item => 
          item.path === currentPath || 
          (currentPath.startsWith(item.path) && item.path !== '/')
        );
        
        // If no matching breadcrumb found and not on homepage, use default
        let breadcrumbItems = [];
        if (!breadcrumbData && currentPath !== '/') {
          // Create default breadcrumb with home and current page
          const pageName = currentPath.split('/').pop() || '';
          breadcrumbItems = [
            {
              "@type": "ListItem",
              "position": 1,
              "name": "صفحه اصلی",
              "item": "https://liftlegends.ir/"
            },
            {
              "@type": "ListItem",
              "position": 2,
              "name": pageName,
              "item": `https://liftlegends.ir${currentPath}`
            }
          ];
        } else if (breadcrumbData) {
          // Use found breadcrumb data
          breadcrumbItems = breadcrumbData.breadcrumb.map(item => ({
            "@type": "ListItem",
            "position": item.position,
            "name": item.name,
            "item": item.item
          }));
        }
        
        // Only add schema if we have breadcrumb items
        if (breadcrumbItems.length > 0) {
          // Create and add schema
          const script = document.createElement('script');
          script.type = 'application/ld+json';
          script.id = 'breadcrumb-schema';
          script.innerHTML = JSON.stringify({
            "@context": "https://schema.org",
            "@type": "BreadcrumbList",
            "itemListElement": breadcrumbItems
          });
          
          // Remove any existing breadcrumb schema
          const existingScript = document.getElementById('breadcrumb-schema');
          if (existingScript) {
            existingScript.remove();
          }
          
          document.head.appendChild(script);
        }
      } catch (error) {
        console.error('Error adding breadcrumb schema:', error);
      }
    };
    
    addBreadcrumbSchema();
    
    return () => {
      // Clean up
      const existingScript = document.getElementById('breadcrumb-schema');
      if (existingScript) {
        existingScript.remove();
      }
    };
  }, [location.pathname]);
  
  // This component doesn't render anything visible
  return null;
};

export default BreadcrumbSchema;