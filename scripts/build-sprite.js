#!/usr/bin/env node

/**
 * Build SVG Sprite Script
 *
 * This script is responsible for generating SVG sprite files from individual SVG icons.
 * It performs the following operations:
 *
 * 1. Scans the svg-icons directory for all .svg files (including subdirectories)
 * 2. Normalizes icon names to kebab-case for consistency
 * 3. Checks for duplicate icons within each namespace and fails if duplicates found
 * 4. Renames SVG files to match kebab-case standard (if no duplicates)
 * 5. Cleans SVG content by removing metadata (title, desc, metadata tags)
 * 6. Optimizes SVGs to reduce file size (remove unused IDs, minify, etc.)
 * 7. Groups icons by namespace based on folder structure
 * 8. Generates separate sprite files for each namespace
 * 9. Creates TypeScript type definitions for type-safe icon usage
 *
 * @author Next.js SVG Sprite Plugin Team
 * @version 1.1.0
 */

const fs = require('fs');
const path = require('path');
const svgstore = require('svgstore');
const { optimize } = require('svgo');

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

  return (
    name
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
      .replace(/^-|-$/g, '')
  );
}

/**
 * Clean SVG content by removing metadata tags
 *
 * Removes the following tags from SVG content:
 * - <title> tags and their content
 * - <desc> tags and their content
 * - <metadata> tags and their content
 *
 * @param {string} svgContent - The SVG content to clean
 * @returns {string} The cleaned SVG content
 *
 * @example
 * cleanSvgMetadata('<svg><title>Icon</title><path d="..."/></svg>')
 * // Returns: '<svg><path d="..."/></svg>'
 */
function cleanSvgMetadata(svgContent) {
  // Remove title, desc, and metadata tags in a single pass
  // Using backreference (\1) to match the opening and closing tags
  return svgContent.replace(/<(title|desc|metadata)[^>]*>[\s\S]*?<\/\1>/gi, '');
}

/**
 * Optimize SVG content using SVGO
 *
 * This function optimizes SVG files by:
 * - Removing unused IDs
 * - Cleaning up numeric values
 * - Removing empty elements
 * - Collapsing groups
 * - Converting path data to shorter formats
 * - And more optimizations to reduce file size
 *
 * @param {string} svgContent - The SVG content to optimize
 * @returns {string} The optimized SVG content
 * @throws {Error} If optimization fails
 *
 * @example
 * optimizeSvg('<svg><g id="unused"><path d="..."/></g></svg>')
 * // Returns optimized SVG with unused ID removed
 */
function optimizeSvg(svgContent) {
  try {
    const result = optimize(svgContent, {
      plugins: [
        {
          name: 'preset-default',
          params: {
            overrides: {
              // Keep viewBox as it's important for scaling
              removeViewBox: false,
            },
          },
        },
      ],
    });
    
    return result.data;
  } catch (error) {
    console.warn(`⚠️  Warning: SVGO optimization failed: ${error.message}`);
    // Return original content if optimization fails
    return svgContent;
  }
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
 * Check for duplicate icons within each namespace and fail build if found
 *
 * This function identifies icons with duplicate normalized names within the same namespace.
 * Duplicates across different namespaces are allowed (e.g., 'plus' and 'sidebar:plus').
 * If duplicates are found within a namespace, the build fails with an error.
 *
 * @param {Array<{originalName: string, name: string, path: string}>} files - Array of SVG file objects
 * @throws {Error} If duplicates are found within the same namespace
 */
function checkForDuplicates(files) {
  // Group files by namespace
  const namespaceGroups = new Map();
  
  files.forEach((file) => {
    // Extract namespace from icon name (e.g., "social:facebook" -> "social")
    const colonIndex = file.name.indexOf(':');
    const namespace = colonIndex > 0 ? file.name.substring(0, colonIndex) : DEFAULT_NAMESPACE;
    const iconName = colonIndex > 0 ? file.name.substring(colonIndex + 1) : file.name;
    
    if (!namespaceGroups.has(namespace)) {
      namespaceGroups.set(namespace, new Map());
    }
    
    const namespaceIcons = namespaceGroups.get(namespace);
    
    if (!namespaceIcons.has(iconName)) {
      namespaceIcons.set(iconName, []);
    }
    
    namespaceIcons.get(iconName).push({
      originalName: file.originalName,
      fullName: file.name,
      path: file.path,
    });
  });
  
  // Check for duplicates within each namespace
  const duplicatesFound = [];
  
  namespaceGroups.forEach((icons, namespace) => {
    icons.forEach((files, iconName) => {
      if (files.length > 1) {
        duplicatesFound.push({
          namespace: namespace === DEFAULT_NAMESPACE ? 'default (root level)' : namespace,
          iconName,
          files: files.map(f => f.originalName),
        });
      }
    });
  });
  
  // If duplicates found, show error and fail the build
  if (duplicatesFound.length > 0) {
    console.error('\n❌ ERROR: Duplicate icon names detected within the same namespace:');
    console.error('   Duplicate icons within the same namespace are not allowed!\n');
    
    duplicatesFound.forEach(({ namespace, iconName, files }) => {
      console.error(`   Namespace: ${namespace}`);
      console.error(`   Icon name: "${iconName}"`);
      console.error(`   Found in files: [${files.join(', ')}]`);
      console.error('');
    });
    
    console.error('   Please rename or remove duplicate files within each namespace.');
    console.error('   Note: Same icon names in DIFFERENT namespaces are allowed.');
    console.error('   Example: "plus.svg" and "sidebar/plus.svg" is OK.\n');
    
    throw new Error('Build failed due to duplicate icon names within the same namespace');
  }
}

/**
 * Rename SVG files to kebab-case standard
 *
 * This function renames SVG source files to match the kebab-case naming convention
 * used in the Icon component. It only renames files that differ from their normalized names.
 *
 * @param {Array<{originalName: string, name: string, path: string}>} files - Array of SVG file objects
 * @returns {Array<{originalName: string, name: string, path: string}>} Updated array with new paths
 */
function renameFilesToKebabCase(files) {
  const renamedFiles = [];
  let renamedCount = 0;
  
  files.forEach((file) => {
    const dir = path.dirname(file.path);
    const originalFileName = path.basename(file.path);
    const originalBaseName = path.basename(originalFileName, '.svg');
    
    // Extract the expected filename from the normalized name
    // For namespaced icons, get just the icon part (after last colon)
    const lastColonIndex = file.name.lastIndexOf(':');
    const expectedBaseName = lastColonIndex >= 0 
      ? file.name.substring(lastColonIndex + 1) 
      : file.name;
    const expectedFileName = `${expectedBaseName}.svg`;
    
    // Check if renaming is needed
    if (originalBaseName !== expectedBaseName) {
      const newPath = path.join(dir, expectedFileName);
      
      // Check if target file already exists
      if (fs.existsSync(newPath)) {
        console.warn(`⚠️  Warning: Cannot rename "${originalFileName}" to "${expectedFileName}" - target file already exists`);
        renamedFiles.push(file);
      } else {
        try {
          fs.renameSync(file.path, newPath);
          console.log(`  ✓ Renamed: ${file.originalName}.svg → ${expectedBaseName}.svg`);
          renamedCount++;
          
          // Update the file object with new path
          renamedFiles.push({
            ...file,
            path: newPath,
          });
        } catch (error) {
          console.error(`  ✗ Error renaming ${originalFileName}: ${error.message}`);
          renamedFiles.push(file);
        }
      }
    } else {
      // No rename needed
      renamedFiles.push(file);
    }
  });
  
  if (renamedCount > 0) {
    console.log(`\n✅ Renamed ${renamedCount} file(s) to kebab-case standard\n`);
  }
  
  return renamedFiles;
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
  // Generate multi-line format for better readability
  const typeLines =
    iconNames.length > 0 ? iconNames.map((name) => `  | '${name}'`).join('\n') : '  never';

  const iconNamesLines =
    iconNames.length > 0
      ? iconNames
          .map((name, index) => `  '${name}'${index < iconNames.length - 1 ? ',' : ''}`)
          .join('\n')
      : '';

  const typeDefinition = `/**
 * Auto-generated TypeScript types for SVG sprite icons
 * Generated from svg-icons directory
 *
 * DO NOT EDIT THIS FILE MANUALLY - it is auto-generated by build-sprite.js
 *
 * To regenerate this file, run: npm run build:sprite
 */

export type IconName =
${typeLines};

export const iconNames = [
${iconNamesLines}
] as const;
`;

  try {
    ensureDirectoryExists(path.dirname(TYPES_OUTPUT_PATH));
    fs.writeFileSync(TYPES_OUTPUT_PATH, typeDefinition, FILE_ENCODING);
    console.log(`\n✅ TypeScript types generated at: ${TYPES_OUTPUT_PATH}`);

    if (iconNames.length === 0) {
      console.warn('⚠️  No icons found. IconName type is set to "never" to enforce type safety.');
      console.warn(
        '   Add SVG files to svg-icons/ and re-run build:sprite to generate icon types.',
      );
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

    console.log(`📊 Found ${allSvgFiles.length} SVG file(s):\n`);

    // Step 3: Check for duplicates within each namespace and fail if found
    checkForDuplicates(allSvgFiles);

    // Step 4: Rename files to kebab-case standard
    console.log('📝 Checking file names...\n');
    const renamedFiles = renameFilesToKebabCase(allSvgFiles);

    // Step 5: Group icons by namespace
    const namespaceGroups = groupByNamespace(renamedFiles);

    // Step 6: Generate sprite files for each namespace
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
          // Read SVG content
          let svgContent = fs.readFileSync(filePath, FILE_ENCODING);
          
          // Get original size for comparison
          const originalSize = svgContent.length;
          
          // Clean metadata (title, desc, metadata tags)
          svgContent = cleanSvgMetadata(svgContent);
          
          // Optimize SVG (remove unused IDs, minify, etc.)
          svgContent = optimizeSvg(svgContent);
          
          const optimizedSize = svgContent.length;
          const reduction = originalSize > 0 ? ((originalSize - optimizedSize) / originalSize * 100).toFixed(1) : 0;
          
          sprites.add(iconName, svgContent);
          allIconNames.push(fullName);
          console.log(`  ✓ ${fullName} (${originalSize}B → ${optimizedSize}B, -${reduction}%)`);
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

    // Step 7: Generate TypeScript type definitions
    generateTypeDefinitions(allIconNames);

    // Step 8: Display success summary
    console.log('✅ All sprites generated successfully!');
    console.log(`📈 Total icons: ${renamedFiles.length}`);
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
