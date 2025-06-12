import { readFileSync, writeFileSync } from 'fs';
import { join } from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const distDir = join(__dirname, '..', 'dist');
const indexPath = join(distDir, 'index.html');

try {
  // Read the index.html file
  let content = readFileSync(indexPath, 'utf-8');
  
  // Replace relative paths with absolute paths
  content = content.replace(/src="\.\/assets\//g, 'src="/assets/');
  content = content.replace(/href="\.\/assets\//g, 'href="/assets/');
  content = content.replace(/src="\.\/fix-scroll\.js"/g, 'src="/fix-scroll.js"');
  content = content.replace(/src="\.\/page-refresh\.js"/g, 'src="/page-refresh.js"');
  
  // Write the fixed content back
  writeFileSync(indexPath, content, 'utf-8');
  
  console.log('✅ Fixed asset paths in index.html');
} catch (error) {
  console.error('❌ Error fixing paths:', error);
  process.exit(1);
}