#!/usr/bin/env node

/**
 * Build Library Script
 * 
 * This script prepares the library for publishing by:
 * - Building the SVG sprites
 * - Copying sprites to the lib directory
 * - Copying icon types to the lib directory
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

console.log('Building library for distribution...\n');

// Step 1: Build sprites
console.log('Step 1: Building SVG sprites...');
try {
  execSync('node scripts/build-sprite.js', { stdio: 'inherit' });
} catch (error) {
  console.error('Failed to build sprites:', error.message);
  process.exit(1);
}

// Ensure lib directory exists
const libDir = path.join(process.cwd(), 'lib');
if (!fs.existsSync(libDir)) {
  fs.mkdirSync(libDir, { recursive: true });
}

// Step 2: Copy sprite files to lib directory
console.log('\nStep 2: Copying sprite files to lib directory...');
const publicDir = path.join(process.cwd(), 'public');
const spriteFiles = fs.readdirSync(publicDir).filter(file => file.endsWith('.svg'));

spriteFiles.forEach(file => {
  const srcPath = path.join(publicDir, file);
  const destPath = path.join(libDir, file);
  fs.copyFileSync(srcPath, destPath);
  console.log(`  ✓ Copied ${file}`);
});

// Step 3: Copy icon types to lib directory
console.log('\nStep 3: Copying icon types to lib directory...');
const iconTypesPath = path.join(process.cwd(), 'components', 'icon-types.ts');
const libIconTypesPath = path.join(libDir, 'icon-types.ts');
if (fs.existsSync(iconTypesPath)) {
  fs.copyFileSync(iconTypesPath, libIconTypesPath);
  console.log('  ✓ Copied icon-types.ts');
}

console.log('\n✅ Library build complete!');
console.log(`Library files are in: ${libDir}`);
console.log('\nContents:');

// Dynamically list the actual files in lib directory
const libFiles = fs.readdirSync(libDir, { withFileTypes: true });

// List files with descriptions
libFiles.forEach(entry => {
  if (entry.isDirectory()) {
    console.log(`  - ${entry.name}/ (directory)`);
  } else if (entry.name === 'icon-types.ts') {
    console.log('  - icon-types.ts (TypeScript types)');
  } else if (entry.name === 'icons-sprite.svg') {
    console.log('  - icons-sprite.svg (default sprite)');
  } else if (entry.name === 'Icon.tsx') {
    console.log('  - Icon.tsx (Icon component)');
  } else if (entry.name.endsWith('.svg')) {
    console.log(`  - ${entry.name}`);
  } else {
    console.log(`  - ${entry.name}`);
  }
});

// List route handlers if icons directory exists
const iconsDir = path.join(libDir, 'icons');
if (fs.existsSync(iconsDir)) {
  console.log('  - icons/route.ts (route handler for /icons)');
  const namespaceDir = path.join(iconsDir, '[namespace]');
  if (fs.existsSync(namespaceDir)) {
    console.log('  - icons/[namespace]/route.ts (route handler for namespace sprites)');
  }
}
