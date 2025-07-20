import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// This script generates sitemaps dynamically
// You can run this script to update sitemaps with actual database content

const generateMainSitemap = () => {
  const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:xhtml="http://www.w3.org/1999/xhtml"
        xmlns:image="http://www.google.com/schemas/sitemap-image/1.1"
        xmlns:video="http://www.google.com/schemas/sitemap-video/1.1">
  <!-- صفحه اصلی -->
  <url>
    <loc>https://liftlegends.ir/</loc>
    <lastmod>${new Date().toISOString().split("T")[0]}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>1.0</priority>
    <image:image>
      <image:loc>https://wagixhjktcodkdkgtgdj.supabase.co/storage/v1/object/public/legends//white%20logo.png</image:loc>
      <image:title>بدنسازی هوشمند با LiftLegends</image:title>
      <image:caption>لیفت لجندز - بهترین برنامه بدنسازی و تناسب اندام با هوش مصنوعی</image:caption>
    </image:image>
  </url>

  <!-- صفحات اصلی -->
  <url>
    <loc>https://liftlegends.ir/privacy-policy</loc>
    <lastmod>${new Date().toISOString().split("T")[0]}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.5</priority>
  </url>
  <url>
    <loc>https://liftlegends.ir/terms-of-use</loc>
    <lastmod>${new Date().toISOString().split("T")[0]}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.5</priority>
  </url>
  <url>
    <loc>https://liftlegends.ir/about-us</loc>
    <lastmod>${new Date().toISOString().split("T")[0]}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.7</priority>
  </url>
  <url>
    <loc>https://liftlegends.ir/coach-application</loc>
    <lastmod>${new Date().toISOString().split("T")[0]}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.7</priority>
  </url>

  <!-- صفحات عمومی -->
  <url>
    <loc>https://liftlegends.ir/search</loc>
    <lastmod>${new Date().toISOString().split("T")[0]}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.5</priority>
  </url>
  <url>
    <loc>https://liftlegends.ir/download</loc>
    <lastmod>${new Date().toISOString().split("T")[0]}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.7</priority>
  </url>
  <url>
    <loc>https://liftlegends.ir/legends</loc>
    <lastmod>${new Date().toISOString().split("T")[0]}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.6</priority>
  </url>

  <!-- صفحات بلاگ -->
  <url>
    <loc>https://liftlegends.ir/blog</loc>
    <lastmod>${new Date().toISOString().split("T")[0]}</lastmod>
    <changefreq>daily</changefreq>
    <priority>0.8</priority>
    <image:image>
      <image:loc>https://uploadkon.ir/uploads/4b3815_25بهترین-برنامه‌های-تمرینی-برای-افزایش-حجم-عضلات.jpg</image:loc>
      <image:title>بلاگ لیفت لجندز</image:title>
      <image:caption>مقالات تخصصی بدنسازی و تناسب اندام</image:caption>
    </image:image>
  </url>

  <!-- دسته‌بندی‌های بلاگ -->
  <url>
    <loc>https://liftlegends.ir/blog?category=workout</loc>
    <lastmod>${new Date().toISOString().split("T")[0]}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.7</priority>
  </url>
  <url>
    <loc>https://liftlegends.ir/blog?category=nutrition</loc>
    <lastmod>${new Date().toISOString().split("T")[0]}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.7</priority>
  </url>
  <url>
    <loc>https://liftlegends.ir/blog?category=supplements</loc>
    <lastmod>${new Date().toISOString().split("T")[0]}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.7</priority>
  </url>
  <url>
    <loc>https://liftlegends.ir/blog?category=motivation</loc>
    <lastmod>${new Date().toISOString().split("T")[0]}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.7</priority>
  </url>

  <!-- صفحات محصولات -->
  <url>
    <loc>https://liftlegends.ir/programs</loc>
    <lastmod>${new Date().toISOString().split("T")[0]}</lastmod>
    <changefreq>daily</changefreq>
    <priority>0.9</priority>
  </url>
  <url>
    <loc>https://liftlegends.ir/programs?category=training</loc>
    <lastmod>${new Date().toISOString().split("T")[0]}</lastmod>
    <changefreq>daily</changefreq>
    <priority>0.8</priority>
  </url>
  <url>
    <loc>https://liftlegends.ir/programs?category=diet</loc>
    <lastmod>${new Date().toISOString().split("T")[0]}</lastmod>
    <changefreq>daily</changefreq>
    <priority>0.8</priority>
  </url>
  <url>
    <loc>https://liftlegends.ir/programs?category=supplement</loc>
    <lastmod>${new Date().toISOString().split("T")[0]}</lastmod>
    <changefreq>daily</changefreq>
    <priority>0.8</priority>
  </url>
</urlset>`;

  return sitemap;
};

const generateSitemapIndex = () => {
  const sitemapIndex = `<?xml version="1.0" encoding="UTF-8"?>
<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <sitemap>
    <loc>https://liftlegends.ir/sitemap.xml</loc>
    <lastmod>${new Date().toISOString().split("T")[0]}</lastmod>
  </sitemap>
  <sitemap>
    <loc>https://liftlegends.ir/blog-sitemap.xml</loc>
    <lastmod>${new Date().toISOString().split("T")[0]}</lastmod>
  </sitemap>
  <sitemap>
    <loc>https://liftlegends.ir/programs-sitemap.xml</loc>
    <lastmod>${new Date().toISOString().split("T")[0]}</lastmod>
  </sitemap>
</sitemapindex>`;

  return sitemapIndex;
};

// Generate and save sitemaps
const publicDir = path.join(__dirname, "..", "public");

// Generate main sitemap
fs.writeFileSync(path.join(publicDir, "sitemap.xml"), generateMainSitemap());
console.log("✅ Main sitemap generated successfully");

// Generate sitemap index
fs.writeFileSync(
  path.join(publicDir, "sitemap-index.xml"),
  generateSitemapIndex()
);
console.log("✅ Sitemap index generated successfully");

console.log("🎉 All sitemaps have been updated with current date!");
console.log("📝 Note: To include dynamic content from database, you need to:");
console.log("   1. Connect to your Supabase database");
console.log("   2. Fetch actual blog posts and programs");
console.log("   3. Generate URLs based on actual data");
