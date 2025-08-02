import { useEffect, useState } from 'react';
import { supabase } from "@/integrations/supabase/client";

interface Program {
  id: string;
  title: string;
  description: string;
  price: number;
  category: 'training' | 'diet' | 'supplement';
  image_url: string | null;
  program_url: string | null;
  created_at: string;
  updated_at: string;
}

/**
 * Component that generates and injects JSON-LD schema for all products
 * This helps search engines understand your product catalog
 */
const ProductSchema = () => {
  const [products, setProducts] = useState<Program[]>([]);
  
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        // Fetch all products
        const { data, error } = await supabase
          .from("programs_sale")
          .select("*")
          .order("created_at", { ascending: false });
          
        if (error) throw error;
        
        // Map data to Program interface
        const programsData = data ? data.map(program => ({
          id: program.id,
          title: program.title,
          description: program.description,
          price: program.price,
          category: program.category as 'training' | 'diet' | 'supplement',
          image_url: program.image_url,
          program_url: program.program_url || null,
          created_at: program.created_at || new Date().toISOString(),
          updated_at: program.updated_at || new Date().toISOString()
        })) : [];
        
        setProducts(programsData);
      } catch (error) {
        console.error("Error fetching products for schema:", error);
      }
    };
    
    fetchProducts();
  }, []);
  
  useEffect(() => {
    if (!products.length) return;
    
    // Create product schema for each product
    const productSchemas = products.map(product => ({
      "@context": "https://schema.org/",
      "@type": "Product",
      "name": product.title,
      "description": product.description.substring(0, 200) + (product.description.length > 200 ? '...' : ''),
      "image": product.image_url || "https://liftlegends.ir/images/default-product.jpg",
      "url": product.program_url 
        ? `https://liftlegends.ir/programs/${product.program_url}`
        : `https://liftlegends.ir/product/${product.id}`,
      "sku": product.id,
      "brand": {
        "@type": "Brand",
        "name": "لیفت لجندز"
      },
      "offers": {
        "@type": "Offer",
        "url": product.program_url 
          ? `https://liftlegends.ir/programs/${product.program_url}`
          : `https://liftlegends.ir/product/${product.id}`,
        "priceCurrency": "IRR",
        "price": product.price * 10, // Convert to Rial for international standards
        "availability": "https://schema.org/InStock",
        "priceValidUntil": new Date(new Date().setFullYear(new Date().getFullYear() + 1)).toISOString().split('T')[0]
      },
      "category": getCategoryLabel(product.category)
    }));
    
    // Create product list schema
    const productListSchema = {
      "@context": "https://schema.org/",
      "@type": "ItemList",
      "itemListElement": products.map((product, index) => ({
        "@type": "ListItem",
        "position": index + 1,
        "item": {
          "@type": "Product",
          "name": product.title,
          "url": product.program_url 
            ? `https://liftlegends.ir/programs/${product.program_url}`
            : `https://liftlegends.ir/product/${product.id}`,
          "image": product.image_url || "https://liftlegends.ir/images/default-product.jpg"
        }
      }))
    };
    
    // Add product schemas to head
    const script = document.createElement('script');
    script.type = 'application/ld+json';
    script.id = 'product-schemas';
    script.innerHTML = JSON.stringify([...productSchemas, productListSchema]);
    
    // Remove any existing product schema
    const existingScript = document.getElementById('product-schemas');
    if (existingScript) {
      existingScript.remove();
    }
    
    document.head.appendChild(script);
    
    return () => {
      // Clean up
      const existingScript = document.getElementById('product-schemas');
      if (existingScript) {
        existingScript.remove();
      }
    };
  }, [products]);
  
  // Get category label
  const getCategoryLabel = (category: string) => {
    switch (category) {
      case 'training':
        return 'برنامه تمرینی';
      case 'diet':
        return 'برنامه غذایی';
      case 'supplement':
        return 'مکمل';
      default:
        return category;
    }
  };
  
  // This component doesn't render anything visible
  return null;
};

export default ProductSchema;