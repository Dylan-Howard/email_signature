const sharp = require('sharp');
const fetch = require('node-fetch');
const fs = require('fs').promises;
const path = require('path');

// Configuration
const INPUT_FILE = 'src/signature.html';
const OUTPUT_DIR = 'output';
const ASSETS_DIR = 'assets/icons';
const ICON_SIZE = 24;
const GITHUB_USER = 'Dylan-Howard';
const GITHUB_REPO = 'email_signature';
const GITHUB_BRANCH = 'main';

// Regex to find Google Fonts static icons
const ICON_REGEX = /https:\/\/fonts\.gstatic\.com\/s\/i\/materialiconsoutlined\/([^\/]+)\/[^"']+/g;

async function extractIconsFromHTML() {
  console.log('📄 Reading HTML file...\n');
  
  const html = await fs.readFile(INPUT_FILE, 'utf-8');
  const icons = new Set();
  
  let match;
  while ((match = ICON_REGEX.exec(html)) !== null) {
    icons.add({
      name: match[1],
      url: match[0]
    });
  }
  
  return { html, icons: Array.from(icons) };
}

async function downloadAndConvertIcons(icons) {
  if (icons.length === 0) {
    console.log('⚠️  No Google Font icons found in HTML\n');
    return;
  }
  
  // Create output directories
  await fs.mkdir(ASSETS_DIR, { recursive: true });
  
  console.log(`🔄 Converting ${icons.length} icon(s)...\n`);
  
  for (const icon of icons) {
    try {
      console.log(`Processing ${icon.name}...`);
      
      // Download SVG
      const response = await fetch(icon.url);
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}`);
      }
      const svgBuffer = await response.buffer();
      
      // Convert to PNG with sharp
      const outputPath = path.join(ASSETS_DIR, `${icon.name}.png`);
      await sharp(svgBuffer)
        .resize(ICON_SIZE, ICON_SIZE)
        .png()
        .toFile(outputPath);
      
      console.log(`✓ ${icon.name}.png created`);
    } catch (error) {
      console.error(`✗ Failed to process ${icon.name}:`, error.message);
    }
  }
  
  console.log('');
}

function replaceIconURLs(html, icons) {
  console.log('🔗 Updating icon URLs in HTML...\n');
  
  let updatedHTML = html;
  
  for (const icon of icons) {
    const githubURL = `https://raw.githubusercontent.com/${GITHUB_USER}/${GITHUB_REPO}/${GITHUB_BRANCH}/assets/icons/${icon.name}.png`;
    
    // Replace the Google Fonts URL with GitHub URL
    const urlPattern = new RegExp(icon.url.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'g');
    updatedHTML = updatedHTML.replace(urlPattern, githubURL);
    
    console.log(`✓ Replaced ${icon.name}: fonts.gstatic.com → GitHub`);
  }
  
  console.log('');
  return updatedHTML;
}

async function saveOutput(html) {
  await fs.mkdir(OUTPUT_DIR, { recursive: true });
  
  const outputPath = path.join(OUTPUT_DIR, 'signature.html');
  await fs.writeFile(outputPath, html, 'utf-8');
  
  console.log(`💾 Updated signature saved to: ${outputPath}`);
}

async function build() {
  try {
    console.log('🚀 Email Signature Build Process\n');
    console.log('═══════════════════════════════════════\n');
    
    // Step 1: Extract icons from HTML
    const { html, icons } = await extractIconsFromHTML();
    
    if (icons.length > 0) {
      console.log('Found icons:');
      icons.forEach(icon => console.log(`  • ${icon.name}`));
      console.log('');
    }
    
    // Step 2: Download and convert icons
    await downloadAndConvertIcons(icons);
    
    // Step 3: Replace URLs in HTML
    const updatedHTML = replaceIconURLs(html, icons);
    
    // Step 4: Save output
    await saveOutput(updatedHTML);
    
    console.log('\n═══════════════════════════════════════');
    console.log('✅ Build complete!\n');
    console.log('Next steps:');
    console.log('  1. Review output/signature.html');
    console.log('  2. Commit and push assets/icons/*.png to GitHub');
    console.log('  3. Test the signature in Gmail');
    
  } catch (error) {
    console.error('\n❌ Build failed:', error.message);
    process.exit(1);
  }
}

build();