/**
 * Script to generate a dynamic robots.txt file with product URLs
 * Run this script periodically to update the robots.txt file with the latest product URLs
 * 
 * Usage: node scripts/generate-robots.js
 */

const fs = require('fs');
const path = require('path');
const { createClient } = require('@supabase/supabase-js');

// Initialize Supabase client
const supabaseUrl = process.env.SUPABASE_URL || 'https://wagixhjktcodkdkgtgdj.supabase.co';
const supabaseKey = process.env.SUPABASE_ANON_KEY || 'your-anon-key-here';
const supabase = createClient(supabaseUrl, supabaseKey);

// Base robots.txt template
const robotsTemplate = `# LiftLegends Robots.txt
# Website: https://liftlegends.ir
# Last Updated: ${new Date().toISOString().split('T')[0]}

# Google
User-agent: Googlebot
Allow: /
Allow: /programs/
Allow: /product/
Allow: /blog/
Disallow: /admin/
Disallow: /api/
Disallow: /private/
Disallow: /dashboard
Disallow: /profile

# Google Image
User-agent: Googlebot-Image
Allow: /images/
Allow: /*.jpg$
Allow: /*.jpeg$
Allow: /*.png$
Allow: /*.webp$
Allow: /*.svg$

# Bing
User-agent: Bingbot
Allow: /
Allow: /programs/
Allow: /product/
Allow: /blog/
Disallow: /admin/
Disallow: /api/
Disallow: /private/
Disallow: /dashboard
Disallow: /profile

# Yandex
User-agent: Yandex
Allow: /
Disallow: /admin/
Disallow: /api/
Disallow: /private/
Disallow: /dashboard
Disallow: /profile

# Yooz (موتور جستجوی ایرانی)
User-agent: YoozBot
Allow: /
Disallow: /admin/
Disallow: /api/
Disallow: /private/
Disallow: /dashboard
Disallow: /profile

# Social Media Bots
User-agent: Twitterbot
Allow: /
Allow: /blog/
Allow: /images/

User-agent: facebookexternalhit
Allow: /
Allow: /blog/
Allow: /images/

User-agent: LinkedInBot
Allow: /
Allow: /blog/
Allow: /images/

User-agent: Pinterestbot
Allow: /
Allow: /blog/
Allow: /images/

User-agent: TelegramBot
Allow: /
Allow: /blog/
Allow: /images/

# Default for all other bots
User-agent: *
Allow: /
Allow: /programs/
Allow: /product/
Allow: /blog/
Disallow: /admin/
Disallow: /api/
Disallow: /private/
Disallow: /dashboard
Disallow: /profile
Disallow: /login
Disallow: /register
Disallow: /reset-password
Disallow: /update-password
Disallow: /payment
Disallow: /payment-callback
Disallow: /*.json$
Disallow: /*.xml$
Disallow: /*.txt$
Disallow: /*.md$
Disallow: /*.log$
Disallow: /*.sql$
Disallow: /*.env$
Disallow: /*.config$

# Crawl delay for all bots
Crawl-delay: 10

# Sitemaps
Sitemap: https://liftlegends.ir/sitemap-index.xml
Sitemap: https://liftlegends.ir/sitemap.xml
Sitemap: https://liftlegends.ir/blog-sitemap.xml
`;

async function generateRobotsTxt() {
  try {
    // Fetch all products
    const { data: products, error } = await supabase
      .from('programs_sale')
      .select('id, program_url');
      
    if (error) throw error;
    
    // Generate product-specific rules
    let productRules = '\n# Product Pages - Auto-generated\n';
    
    products.forEach(product => {
      const url = product.program_url 
        ? `/programs/${product.program_url}`
        : `/product/${product.id}`;
      
      productRules += `Allow: ${url}\n`;
    });
    
    // Combine template with product rules
    const robotsTxt = robotsTemplate + productRules;
    
    // Write to robots.txt file
    fs.writeFileSync(
      path.join(__dirname, '../public/robots.txt'),
      robotsTxt
    );
    
    console.log('robots.txt generated successfully!');
  } catch (error) {
    console.error('Error generating robots.txt:', error);
  }
}

// Run the generator
generateRobotsTxt();