#!/usr/bin/env node

/**
 * Build SVG Sprite Script
 * 
 * This script:
 * - Reads all .svg files from the svg-icons directory
 * - Combines them into a single SVG sprite
 * - Outputs the sprite to public/icons-sprite.svg
 */

const fs = require('fs');
const path = require('path');
const svgstore = require('svgstore');

// Configuration
const SVG_DIR = path.join(process.cwd(), 'svg-icons');
const OUTPUT_PATH = path.join(process.cwd(), 'public', 'icons-sprite.svg');

/**
 * Ensure a directory exists, create if it doesn't
 */
function ensureDirectoryExists(dirPath) {
  if (!fs.existsSync(dirPath)) {
    fs.mkdirSync(dirPath, { recursive: true });
  }
}

/**
 * Get all SVG files from a directory
 */
function getSvgFiles(dir) {
  if (!fs.existsSync(dir)) {
    console.warn(`Warning: SVG directory not found at ${dir}`);
    return [];
  }

  return fs.readdirSync(dir)
    .filter(file => file.endsWith('.svg'))
    .map(file => ({
      name: path.basename(file, '.svg'),
      path: path.join(dir, file),
    }));
}

/**
 * Build the SVG sprite
 */
function buildSprite() {
  console.log('Building SVG sprite...');

  // Initialize svgstore
  const sprites = svgstore({
    svgAttrs: {
      xmlns: 'http://www.w3.org/2000/svg',
      'xmlns:xlink': 'http://www.w3.org/1999/xlink',
      style: 'display: none;',
    },
    copyAttrs: ['fill', 'stroke', 'stroke-width', 'stroke-linecap', 'stroke-linejoin'],
    cleanDefs: true,
    cleanSymbols: true,
  });

  // Get all SVG files
  const svgFiles = getSvgFiles(SVG_DIR);

  if (svgFiles.length === 0) {
    console.warn('No SVG files found. Creating empty sprite.');
    ensureDirectoryExists(path.dirname(OUTPUT_PATH));
    fs.writeFileSync(OUTPUT_PATH, '<svg xmlns="http://www.w3.org/2000/svg" style="display: none;"></svg>');
    return;
  }

  console.log(`Found ${svgFiles.length} SVG file(s):`);

  // Add each SVG to the sprite
  svgFiles.forEach(({ name, path: filePath }) => {
    try {
      const svgContent = fs.readFileSync(filePath, 'utf8');
      sprites.add(name, svgContent);
      console.log(`  ✓ ${name}`);
    } catch (error) {
      console.error(`  ✗ Error adding ${name}:`, error.message);
    }
  });

  // Ensure output directory exists
  ensureDirectoryExists(path.dirname(OUTPUT_PATH));

  // Write the sprite file
  const spriteContent = sprites.toString();
  fs.writeFileSync(OUTPUT_PATH, spriteContent);

  console.log(`\nSprite generated successfully at: ${OUTPUT_PATH}`);
  console.log(`Total icons: ${svgFiles.length}`);
}

// Run the build
try {
  buildSprite();
} catch (error) {
  console.error('Error building sprite:', error);
  process.exit(1);
}
