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
 * Sprite filename patterns and utilities
 */
export const SPRITE_PATTERNS = {
  /**
   * Prefix for sprite filenames
   */
  PREFIX: 'icons-',

  /**
   * Default sprite filename
   */
  DEFAULT_FILENAME: 'icons-sprite.svg',

  /**
   * Regular expression to extract namespace from sprite filename
   * Matches: icons-{namespace}.svg
   */
  NAMESPACE_REGEX: /^icons-(.+)\.svg$/,

  /**
   * Check if a filename is a sprite file (excluding default)
   * @param filename - The filename to check
   * @returns true if it's a namespace sprite file
   */
  isNamespaceSprite: (filename: string): boolean => {
    return (
      filename.startsWith('icons-') && filename.endsWith('.svg') && filename !== 'icons-sprite.svg'
    );
  },

  /**
   * Extract namespace from a sprite filename
   * @param filename - The sprite filename (e.g., 'icons-social.svg')
   * @returns The namespace or null if not a valid sprite filename
   */
  extractNamespace: (filename: string): string | null => {
    const match = filename.match(SPRITE_PATTERNS.NAMESPACE_REGEX);
    return match ? match[1] : null;
  },
};

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
 * Cache control configuration
 */
export const CACHE_CONTROL = {
  /**
   * Long-term cache duration (1 year in seconds)
   * Suitable for production environments with versioned assets
   */
  MAX_AGE: 31536000,

  /**
   * Build the cache control header string
   * @param maxAge - Maximum cache age in seconds (default: 1 year)
   * @returns Cache-Control header value
   */
  buildHeader: (maxAge: number = 31536000): string => {
    return `public, max-age=${maxAge}, immutable`;
  },
};

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
