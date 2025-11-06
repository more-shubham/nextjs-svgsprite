#!/usr/bin/env node

/**
 * Build SVG Sprite Script
 *
 * This script is responsible for generating SVG sprite files from individual SVG icons.
 * It performs the following operations:
 *
 * 1. Scans the svg-icons directory for all .svg files (including subdirectories)
 * 2. Normalizes icon names to kebab-case for consistency
 * 3. Groups icons by namespace based on folder structure
 * 4. Generates separate sprite files for each namespace
 * 5. Creates TypeScript type definitions for type-safe icon usage
 * 6. Detects and reports duplicate icon names
 *
 * @author Next.js SVG Sprite Plugin Team
 * @version 1.0.0
 */

const fs = require('fs');
const path = require('path');
const svgstore = require('svgstore');

// ============================================================================
// Configuration Constants
// ============================================================================

/**
 * Directory containing source SVG files
 * @type {string}
 */
const SVG_DIR = path.join(process.cwd(), 'svg-icons');

/**
 * Output directory for generated sprite files
 * @type {string}
 */
const OUTPUT_DIR = path.join(process.cwd(), 'public');

/**
 * Default sprite file output path
 * @type {string}
 */
const OUTPUT_PATH = path.join(OUTPUT_DIR, 'icons-sprite.svg');

/**
 * TypeScript type definitions output path
 * @type {string}
 */
const TYPES_OUTPUT_PATH = path.join(process.cwd(), 'components', 'icon-types.ts');

/**
 * File encoding for read/write operations
 * @type {string}
 */
const FILE_ENCODING = 'utf8';

/**
 * SVG attributes to preserve when building sprites
 * @type {string[]}
 */
const SVG_COPY_ATTRS = ['fill', 'stroke', 'stroke-width', 'stroke-linecap', 'stroke-linejoin'];

/**
 * Default namespace for root-level icons
 * @type {string}
 */
const DEFAULT_NAMESPACE = 'default';

// ============================================================================
// Utility Functions
// ============================================================================

/**
 * Normalize icon name to kebab-case
 *
 * Converts various naming conventions to a consistent kebab-case format:
 * - PascalCase → kebab-case
 * - camelCase → kebab-case
 * - snake_case → kebab-case
 * - spaces → kebab-case
 *
 * @param {string} name - The original icon name
 * @returns {string} The normalized kebab-case name
 * @throws {Error} If name is not a valid string
 *
 * @example
 * normalizeIconName('sunMoon')      // Returns: 'sun-moon'
 * normalizeIconName('SunMoon')      // Returns: 'sun-moon'
 * normalizeIconName('sun_moon')     // Returns: 'sun-moon'
 * normalizeIconName('sun moon')     // Returns: 'sun-moon'
 * normalizeIconName('sun  moon')    // Returns: 'sun-moon'
 */
function normalizeIconName(name) {
  if (!name || typeof name !== 'string') {
    throw new Error('Icon name must be a non-empty string');
  }

  return name
    // Replace multiple spaces with single space first
    .replace(/\s+/g, ' ')
    // Replace spaces with hyphens
    .replace(/\s/g, '-')
    // Handle PascalCase and camelCase: insert hyphen before uppercase letters
    .replace(/([a-z0-9])([A-Z])/g, '$1-$2')
    // Replace underscores with hyphens
    .replace(/_/g, '-')
    // Convert to lowercase
    .toLowerCase()
    // Remove any duplicate hyphens
    .replace(/-+/g, '-')
    // Remove leading/trailing hyphens
    .replace(/^-|-$/g, '');
}

/**
 * Ensure a directory exists, create if it doesn't
 *
 * @param {string} dirPath - The directory path to ensure exists
 * @throws {Error} If directory creation fails
 */
function ensureDirectoryExists(dirPath) {
  try {
    if (!fs.existsSync(dirPath)) {
      fs.mkdirSync(dirPath, { recursive: true });
    }
  } catch (error) {
    throw new Error(`Failed to create directory ${dirPath}: ${error.message}`);
  }
}

/**
 * Get all SVG files from a directory recursively
 *
 * This function scans a directory and all its subdirectories for SVG files.
 * Subdirectories are treated as namespaces, allowing for organized icon grouping.
 *
 * Features:
 * - Recursive directory traversal
 * - Namespace support via subdirectories (e.g., sidebar/home.svg → sidebar:home)
 * - Nested namespaces (e.g., sidebar/nav/icon.svg → sidebar:nav:icon)
 * - Automatic name normalization to kebab-case
 *
 * @param {string} dir - Directory path to scan
 * @param {string} [namespace=''] - Current namespace (for recursion)
 * @param {string} [originalNamespace=''] - Original namespace path (for error reporting)
 * @returns {Array<{originalName: string, name: string, path: string}>} Array of SVG file objects
 *
 * @example
 * getSvgFiles('./svg-icons')
 * // Returns: [
 * //   { originalName: 'home', name: 'home', path: './svg-icons/home.svg' },
 * //   { originalName: 'social/facebook', name: 'social:facebook', path: './svg-icons/social/facebook.svg' }
 * // ]
 */
function getSvgFiles(dir, namespace = '', originalNamespace = '') {
  if (!fs.existsSync(dir)) {
    console.warn(`⚠️  Warning: SVG directory not found at ${dir}`);
    return [];
  }

  let files = [];

  try {
    const entries = fs.readdirSync(dir, { withFileTypes: true });

    entries.forEach((entry) => {
      const fullPath = path.join(dir, entry.name);

      if (entry.isDirectory()) {
        // Normalize folder name to kebab-case
        const normalizedFolderName = normalizeIconName(entry.name);
        // Build namespace path with kebab-case folder names
        const newNamespace = namespace
          ? `${namespace}:${normalizedFolderName}`
          : normalizedFolderName;
        const newOriginalNamespace = originalNamespace
          ? `${originalNamespace}/${entry.name}`
          : entry.name;

        // Recursively process subdirectories as namespaces
        files = files.concat(getSvgFiles(fullPath, newNamespace, newOriginalNamespace));
      } else if (entry.isFile() && entry.name.toLowerCase().endsWith('.svg')) {
        const originalFileName = path.basename(entry.name, '.svg');
        const normalizedFileName = normalizeIconName(originalFileName);
        const fullIconName = namespace ? `${namespace}:${normalizedFileName}` : normalizedFileName;
        const fullOriginalName = originalNamespace
          ? `${originalNamespace}/${originalFileName}`
          : originalFileName;

        files.push({
          originalName: fullOriginalName,
          name: fullIconName,
          path: fullPath,
        });
      }
    });
  } catch (error) {
    console.error(`❌ Error reading directory ${dir}: ${error.message}`);
    throw error;
  }

  return files;
}

/**
 * Remove duplicate icons and show warnings
 *
 * This function identifies icons with duplicate normalized names and removes them,
 * keeping only the first occurrence. It provides detailed error messages to help
 * developers identify and resolve naming conflicts.
 *
 * @param {Array<{originalName: string, name: string, path: string}>} files - Array of SVG file objects
 * @returns {Array<{originalName: string, name: string, path: string}>} Deduplicated array of SVG file objects
 */
function deduplicateIcons(files) {
  const uniqueIcons = new Map();
  const duplicates = [];

  files.forEach((file) => {
    if (uniqueIcons.has(file.name)) {
      // Found a duplicate
      const existing = uniqueIcons.get(file.name);
      const existingDuplicate = duplicates.find((d) => d.name === file.name);

      if (!existingDuplicate) {
        duplicates.push({
          name: file.name,
          files: [existing.originalName, file.originalName],
        });
      } else {
        existingDuplicate.files.push(file.originalName);
      }
    } else {
      uniqueIcons.set(file.name, file);
    }
  });

  // Show errors for duplicates (always visible for debugging)
  if (duplicates.length > 0) {
    console.error('\n❌ ERROR: Duplicate icon names detected after normalization:');
    duplicates.forEach(({ name, files }) => {
      console.error(`   "${name}" found in: [${files.join(', ')}]`);
    });
    console.error('   These duplicates have been removed. Only the first occurrence is kept.\n');
  }

  return Array.from(uniqueIcons.values());
}

/**
 * Generate TypeScript type definitions for icon names
 *
 * This function creates a TypeScript file with type-safe icon name definitions.
 * It enables IDE autocomplete and compile-time type checking for icon names.
 *
 * @param {string[]} iconNames - Array of normalized icon names
 *
 * @example
 * generateTypeDefinitions(['home', 'user', 'social:facebook'])
 * // Creates: export type IconName = 'home' | 'user' | 'social:facebook';
 */
function generateTypeDefinitions(iconNames) {
  const typeDefinition = `/**
 * Auto-generated TypeScript types for SVG sprite icons
 * Generated from svg-icons directory
 *
 * DO NOT EDIT THIS FILE MANUALLY - it is auto-generated by build-sprite.js
 *
 * To regenerate this file, run: npm run build:sprite
 */

export type IconName = ${iconNames.length > 0 ? iconNames.map((name) => `'${name}'`).join(' | ') : 'never'};

export const iconNames = [${iconNames.map((name) => `'${name}'`).join(', ')}] as const;
`;

  try {
    ensureDirectoryExists(path.dirname(TYPES_OUTPUT_PATH));
    fs.writeFileSync(TYPES_OUTPUT_PATH, typeDefinition, FILE_ENCODING);
    console.log(`\n✅ TypeScript types generated at: ${TYPES_OUTPUT_PATH}`);

    if (iconNames.length === 0) {
      console.warn('⚠️  No icons found. IconName type is set to "never" to enforce type safety.');
      console.warn('   Add SVG files to svg-icons/ and re-run build:sprite to generate icon types.');
    }
  } catch (error) {
    console.error(`❌ Error generating TypeScript types: ${error.message}`);
    throw error;
  }
}

/**
 * Group icons by namespace
 *
 * Organizes icons into namespace groups based on their naming structure.
 * Icons with colons in their names (e.g., 'social:facebook') are grouped
 * by their namespace prefix.
 *
 * @param {Array<{originalName: string, name: string, path: string}>} files - Array of SVG file objects
 * @returns {Map<string, Array<{originalName: string, name: string, path: string, iconName: string, fullName: string}>>} Map of namespace to icon arrays
 *
 * @example
 * groupByNamespace([
 *   { name: 'home', ... },
 *   { name: 'social:facebook', ... }
 * ])
 * // Returns Map: { 'default' => [{...}], 'social' => [{...}] }
 */
function groupByNamespace(files) {
  const groups = new Map();

  files.forEach((file) => {
    // Extract namespace from icon name (e.g., "social:facebook" -> "social")
    const colonIndex = file.name.indexOf(':');
    let namespace = DEFAULT_NAMESPACE; // Root level icons
    let iconName = file.name;

    if (colonIndex > 0) {
      namespace = file.name.substring(0, colonIndex);
      iconName = file.name.substring(colonIndex + 1);
    }

    if (!groups.has(namespace)) {
      groups.set(namespace, []);
    }

    groups.get(namespace).push({
      ...file,
      iconName, // Name without namespace prefix
      fullName: file.name, // Full name with namespace
    });
  });

  return groups;
}

// ============================================================================
// Main Build Function
// ============================================================================

/**
 * Build the SVG sprite files
 *
 * This is the main function that orchestrates the entire build process:
 * 1. Scans for SVG files in the svg-icons directory
 * 2. Normalizes and deduplicates icon names
 * 3. Groups icons by namespace
 * 4. Generates separate sprite files for each namespace
 * 5. Creates TypeScript type definitions
 *
 * @throws {Error} If the build process fails
 */
function buildSprite() {
  console.log('🚀 Building SVG sprite(s)...\n');

  try {
    // Step 1: Get all SVG files from the source directory
    const allSvgFiles = getSvgFiles(SVG_DIR);

    // Step 2: Handle empty directory case
    if (allSvgFiles.length === 0) {
      console.warn('⚠️  No SVG files found. Creating empty default sprite.');
      ensureDirectoryExists(OUTPUT_DIR);
      const emptySprite = '<svg xmlns="http://www.w3.org/2000/svg" style="display: none;"></svg>';
      fs.writeFileSync(OUTPUT_PATH, emptySprite, FILE_ENCODING);
      generateTypeDefinitions([]);
      return;
    }

    // Step 3: Remove duplicates and validate
    const svgFiles = deduplicateIcons(allSvgFiles);
    console.log(
      `📊 Found ${allSvgFiles.length} SVG file(s), ${svgFiles.length} unique after normalization:\n`,
    );

    // Step 4: Group icons by namespace
    const namespaceGroups = groupByNamespace(svgFiles);

    // Step 5: Generate sprite files for each namespace
    const allIconNames = [];
    ensureDirectoryExists(OUTPUT_DIR);

    namespaceGroups.forEach((icons, namespace) => {
      // Configure svgstore for this namespace
      const sprites = svgstore({
        svgAttrs: {
          xmlns: 'http://www.w3.org/2000/svg',
          'xmlns:xlink': 'http://www.w3.org/1999/xlink',
          style: 'display: none;',
        },
        copyAttrs: SVG_COPY_ATTRS,
        cleanDefs: true,
        cleanSymbols: true,
      });

      console.log(`📦 Building sprite for namespace: ${namespace}`);

      // Add each icon to the sprite
      icons.forEach(({ iconName, fullName, originalName, path: filePath }) => {
        try {
          const svgContent = fs.readFileSync(filePath, FILE_ENCODING);
          sprites.add(iconName, svgContent);
          allIconNames.push(fullName);
          console.log(`  ✓ ${fullName} (from ${originalName})`);
        } catch (error) {
          console.error(`  ✗ Error adding ${fullName}: ${error.message}`);
        }
      });

      // Write the namespace sprite file
      const spriteFileName =
        namespace === DEFAULT_NAMESPACE ? 'icons-sprite.svg' : `icons-${namespace}.svg`;
      const spritePath = path.join(OUTPUT_DIR, spriteFileName);
      const spriteContent = sprites.toString();

      try {
        fs.writeFileSync(spritePath, spriteContent, FILE_ENCODING);
        console.log(`  ✅ Sprite saved: ${spriteFileName} (${icons.length} icons)\n`);
      } catch (error) {
        console.error(`  ❌ Error writing sprite file: ${error.message}`);
        throw error;
      }
    });

    // Step 6: Generate TypeScript type definitions
    generateTypeDefinitions(allIconNames);

    // Step 7: Display success summary
    console.log('✅ All sprites generated successfully!');
    console.log(`📈 Total icons: ${svgFiles.length}`);
    console.log(`🏷️  Namespaces: ${Array.from(namespaceGroups.keys()).join(', ')}`);
  } catch (error) {
    console.error('\n❌ Build failed:', error.message);
    throw error;
  }
}

// ============================================================================
// Script Entry Point
// ============================================================================

// Run the build process
try {
  buildSprite();
} catch (error) {
  console.error('❌ Fatal error building sprite:', error);
  process.exit(1);
}
