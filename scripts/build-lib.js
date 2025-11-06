#!/usr/bin/env node

/**
 * Build Library Script
 *
 * This script prepares the library for npm publishing by:
 * 1. Building the SVG sprites from source files
 * 2. Copying generated sprites to the lib directory
 * 3. Copying TypeScript type definitions to the lib directory
 * 4. Ensuring all necessary files are included for distribution
 *
 * This script is typically run as part of the prepublishOnly lifecycle hook
 * to ensure the library is properly packaged before publishing to npm.
 *
 * @module scripts/build-lib
 * @author Next.js SVG Sprite Plugin Team
 * @version 1.0.0
 *
 * Usage:
 * ```bash
 * npm run build:lib
 * ```
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

// ============================================================================
// Configuration
// ============================================================================

/**
 * Library output directory
 * @type {string}
 */
const LIB_DIR = path.join(process.cwd(), 'lib');

/**
 * Public directory containing generated sprites
 * @type {string}
 */
const PUBLIC_DIR = path.join(process.cwd(), 'public');

/**
 * Components directory containing TypeScript types
 * @type {string}
 */
const COMPONENTS_DIR = path.join(process.cwd(), 'components');

/**
 * Icon types file path
 * @type {string}
 */
const ICON_TYPES_PATH = path.join(COMPONENTS_DIR, 'icon-types.ts');

// ============================================================================
// Utility Functions
// ============================================================================

/**
 * Ensure a directory exists, creating it if necessary
 *
 * @param {string} dirPath - Directory path to ensure
 * @throws {Error} If directory creation fails
 */
function ensureDirectoryExists(dirPath) {
  try {
    if (!fs.existsSync(dirPath)) {
      fs.mkdirSync(dirPath, { recursive: true });
      console.log(`✓ Created directory: ${dirPath}`);
    }
  } catch (error) {
    throw new Error(`Failed to create directory ${dirPath}: ${error.message}`);
  }
}

/**
 * Copy a file from source to destination
 *
 * @param {string} srcPath - Source file path
 * @param {string} destPath - Destination file path
 * @param {string} description - Description of the file being copied
 * @throws {Error} If file copy fails
 */
function copyFile(srcPath, destPath, description) {
  try {
    fs.copyFileSync(srcPath, destPath);
    console.log(`  ✓ Copied ${description}`);
  } catch (error) {
    throw new Error(`Failed to copy ${description}: ${error.message}`);
  }
}

// ============================================================================
// Build Steps
// ============================================================================

/**
 * Build the library for distribution
 *
 * Main function that orchestrates the library build process.
 * Executes all necessary steps to prepare the library for publishing.
 *
 * @throws {Error} If any build step fails
 */
function buildLibrary() {
  console.log('📦 Building library for distribution...\n');

  try {
    // ========================================================================
    // Step 1: Build SVG sprites
    // ========================================================================
    console.log('Step 1: Building SVG sprites...');
    try {
      execSync('node scripts/build-sprite.js', { stdio: 'inherit' });
      console.log('✅ Sprites built successfully\n');
    } catch (error) {
      throw new Error(`Failed to build sprites: ${error.message}`);
    }

    // ========================================================================
    // Step 2: Ensure lib directory exists
    // ========================================================================
    console.log('Step 2: Preparing lib directory...');
    ensureDirectoryExists(LIB_DIR);
    console.log('✅ Lib directory ready\n');

    // ========================================================================
    // Step 3: Copy sprite files to lib directory
    // ========================================================================
    console.log('Step 3: Copying sprite files to lib directory...');

    if (!fs.existsSync(PUBLIC_DIR)) {
      throw new Error(`Public directory not found at: ${PUBLIC_DIR}`);
    }

    const spriteFiles = fs.readdirSync(PUBLIC_DIR).filter((file) => file.endsWith('.svg'));

    if (spriteFiles.length === 0) {
      console.warn('⚠️  No sprite files found in public directory');
    } else {
      spriteFiles.forEach((file) => {
        const srcPath = path.join(PUBLIC_DIR, file);
        const destPath = path.join(LIB_DIR, file);
        copyFile(srcPath, destPath, file);
      });
      console.log(`✅ Copied ${spriteFiles.length} sprite file(s)\n`);
    }

    // ========================================================================
    // Step 4: Copy TypeScript type definitions to lib directory
    // ========================================================================
    console.log('Step 4: Copying TypeScript types to lib directory...');

    if (fs.existsSync(ICON_TYPES_PATH)) {
      const destPath = path.join(LIB_DIR, 'icon-types.ts');
      copyFile(ICON_TYPES_PATH, destPath, 'icon-types.ts');
      console.log('✅ TypeScript types copied\n');
    } else {
      console.warn('⚠️  icon-types.ts not found, skipping type definitions copy');
    }

    // ========================================================================
    // Step 5: Display build summary
    // ========================================================================
    console.log('✅ Library build complete!\n');
    console.log(`📂 Library files are in: ${LIB_DIR}`);
    console.log('\n📋 Contents:');

    // List all files in the lib directory
    const libFiles = fs.readdirSync(LIB_DIR, { withFileTypes: true });

    libFiles.forEach((entry) => {
      if (entry.isDirectory()) {
        console.log(`  - ${entry.name}/ (directory)`);

        // List subdirectory contents
        const subDir = path.join(LIB_DIR, entry.name);
        const subFiles = fs.readdirSync(subDir);
        subFiles.forEach((subFile) => {
          console.log(`    - ${subFile}`);
        });
      } else {
        // Provide descriptions for known files
        if (entry.name === 'icon-types.ts') {
          console.log('  - icon-types.ts (TypeScript type definitions)');
        } else if (entry.name === 'icons-sprite.svg') {
          console.log('  - icons-sprite.svg (default sprite)');
        } else if (entry.name === 'Icon.tsx') {
          console.log('  - Icon.tsx (Icon component)');
        } else if (entry.name.endsWith('.svg')) {
          const match = entry.name.match(/^icons-(.+)\.svg$/);
          if (match) {
            console.log(`  - ${entry.name} (${match[1]} namespace sprite)`);
          } else {
            console.log(`  - ${entry.name}`);
          }
        } else {
          console.log(`  - ${entry.name}`);
        }
      }
    });

    console.log('\n✨ Ready for publishing!');
  } catch (error) {
    console.error('\n❌ Build failed:', error.message);
    process.exit(1);
  }
}

// ============================================================================
// Script Entry Point
// ============================================================================

// Run the build process
buildLibrary();
