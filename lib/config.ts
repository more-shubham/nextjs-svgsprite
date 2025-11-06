/**
 * Configuration constants for the SVG Sprite Plugin
 *
 * This file centralizes all configuration values used throughout the plugin.
 * This makes the codebase more maintainable and easier to configure.
 */

/**
 * Default directory containing source SVG files
 */
export const DEFAULT_SVG_DIR = 'svg-icons';

/**
 * Default output path for the generated sprite
 */
export const DEFAULT_OUTPUT_PATH = 'public/icons-sprite.svg';

/**
 * Default namespace for root-level icons
 */
export const DEFAULT_NAMESPACE = 'default';

/**
 * Sprite file naming pattern
 */
export const SPRITE_FILE_PREFIX = 'icons-';
export const SPRITE_FILE_EXTENSION = '.svg';
export const DEFAULT_SPRITE_FILENAME = 'icons-sprite.svg';

/**
 * SVG attributes to copy when building sprites
 */
export const SVG_COPY_ATTRS = [
  'fill',
  'stroke',
  'stroke-width',
  'stroke-linecap',
  'stroke-linejoin',
];

/**
 * SVG sprite attributes for the root element
 */
export const SVG_SPRITE_ATTRS = {
  xmlns: 'http://www.w3.org/2000/svg',
  'xmlns:xlink': 'http://www.w3.org/1999/xlink',
  style: 'display: none;',
};

/**
 * Default icon size in pixels
 */
export const DEFAULT_ICON_SIZE = 24;

/**
 * Default icon color
 */
export const DEFAULT_ICON_COLOR = 'currentColor';

/**
 * Cache control header for sprite routes
 */
export const SPRITE_CACHE_CONTROL = 'public, max-age=31536000, immutable';

/**
 * TypeScript type file path
 */
export const TYPES_OUTPUT_PATH = 'components/icon-types.ts';

/**
 * Regex patterns for icon name normalization
 */
export const NORMALIZATION_PATTERNS = {
  MULTIPLE_SPACES: /\s+/g,
  SPACES: /\s/g,
  CAMEL_CASE: /([a-z0-9])([A-Z])/g,
  UNDERSCORES: /_/g,
  MULTIPLE_HYPHENS: /-+/g,
  LEADING_TRAILING_HYPHENS: /^-|-$/g,
};

/**
 * File encoding for reading/writing files
 */
export const FILE_ENCODING = 'utf8';

/**
 * Empty SVG sprite placeholder
 */
export const EMPTY_SPRITE_SVG =
  '<svg xmlns="http://www.w3.org/2000/svg" style="display: none;"></svg>';

/**
 * Build messages
 */
export const BUILD_MESSAGES = {
  BUILDING: 'Building SVG sprite(s)...',
  NO_SVG_FILES: 'No SVG files found. Creating empty default sprite.',
  SPRITE_SAVED: 'Sprite saved',
  ALL_SPRITES_GENERATED: 'All sprites generated successfully!',
  TOTAL_ICONS: 'Total icons',
  NAMESPACES: 'Namespaces',
  DUPLICATE_ERROR: 'ERROR: Duplicate icon names detected after normalization:',
  TYPES_GENERATED: 'TypeScript types generated at',
  NO_ICONS_WARNING: 'No icons found. IconName type is set to "never" to enforce type safety.',
  ADD_ICONS_HINT: 'Add SVG files to svg-icons/ and re-run build:sprite to generate icon types.',
};
