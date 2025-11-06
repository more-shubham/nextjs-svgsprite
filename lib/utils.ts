/**
 * Utility functions for the SVG Sprite Plugin
 *
 * This module contains reusable utility functions used throughout the plugin.
 */

import { NORMALIZATION_PATTERNS } from './config';

/**
 * Normalize icon name to kebab-case
 *
 * Converts various naming conventions to a consistent kebab-case format:
 * - PascalCase → kebab-case
 * - camelCase → kebab-case
 * - snake_case → kebab-case
 * - spaces → kebab-case
 *
 * @param name - The original icon name
 * @returns The normalized kebab-case name
 *
 * @example
 * normalizeIconName('sunMoon') // returns 'sun-moon'
 * normalizeIconName('SunMoon') // returns 'sun-moon'
 * normalizeIconName('sun_moon') // returns 'sun-moon'
 * normalizeIconName('sun moon') // returns 'sun-moon'
 */
export function normalizeIconName(name: string): string {
  if (!name || typeof name !== 'string') {
    throw new Error('Icon name must be a non-empty string');
  }

  return (
    name
      // Replace multiple spaces with single space first
      .replace(NORMALIZATION_PATTERNS.MULTIPLE_SPACES, ' ')
      // Replace spaces with hyphens
      .replace(NORMALIZATION_PATTERNS.SPACES, '-')
      // Handle PascalCase and camelCase: insert hyphen before uppercase letters
      .replace(NORMALIZATION_PATTERNS.CAMEL_CASE, '$1-$2')
      // Replace underscores with hyphens
      .replace(NORMALIZATION_PATTERNS.UNDERSCORES, '-')
      // Convert to lowercase
      .toLowerCase()
      // Remove any duplicate hyphens
      .replace(NORMALIZATION_PATTERNS.MULTIPLE_HYPHENS, '-')
      // Remove leading/trailing hyphens
      .replace(NORMALIZATION_PATTERNS.LEADING_TRAILING_HYPHENS, '')
  );
}

/**
 * Parse a namespaced icon name into its components
 *
 * @param name - Icon name (e.g., "home" or "social:facebook")
 * @returns Object with namespace and iconName
 *
 * @example
 * parseIconName('home') // { namespace: 'default', iconName: 'home' }
 * parseIconName('social:facebook') // { namespace: 'social', iconName: 'facebook' }
 */
export function parseIconName(name: string): { namespace: string; iconName: string } {
  if (!name || typeof name !== 'string') {
    throw new Error('Icon name must be a non-empty string');
  }

  const colonIndex = name.indexOf(':');

  if (colonIndex > 0) {
    return {
      namespace: name.substring(0, colonIndex),
      iconName: name.substring(colonIndex + 1),
    };
  }

  return {
    namespace: 'default',
    iconName: name,
  };
}

/**
 * Validate that a string is a valid icon name
 *
 * @param name - The name to validate
 * @returns true if valid, false otherwise
 */
export function isValidIconName(name: string): boolean {
  if (!name || typeof name !== 'string') {
    return false;
  }

  // Check for valid characters (alphanumeric, hyphens, colons for namespaces)
  const validNamePattern = /^[a-z0-9-]+(?::[a-z0-9-]+)*$/;
  return validNamePattern.test(name);
}

/**
 * Sanitize a file path to prevent directory traversal attacks
 *
 * @param filePath - The file path to sanitize
 * @param basePath - Optional base directory to validate against
 * @returns Sanitized file path
 * @throws Error if the path contains suspicious patterns or escapes base directory
 */
export function sanitizeFilePath(filePath: string, basePath?: string): string {
  if (!filePath || typeof filePath !== 'string') {
    throw new Error('File path must be a non-empty string');
  }

  // Normalize path separators to forward slashes
  const normalizedPath = filePath.replace(/\\/g, '/');

  // Check for basic directory traversal patterns
  if (normalizedPath.includes('..') || normalizedPath.includes('~')) {
    throw new Error('Invalid file path: directory traversal is not allowed');
  }

  // If basePath is provided, validate that the resolved path is within the base directory
  if (basePath) {
    const path = require('path');
    const resolvedBase = path.resolve(basePath);
    const resolvedPath = path.resolve(basePath, normalizedPath);

    if (!resolvedPath.startsWith(resolvedBase)) {
      throw new Error('Invalid file path: path escapes base directory');
    }
  }

  return normalizedPath;
}

/**
 * Check if a file extension is SVG
 *
 * @param filename - The filename to check
 * @returns true if the file is an SVG, false otherwise
 */
export function isSvgFile(filename: string): boolean {
  return filename.toLowerCase().endsWith('.svg');
}

/**
 * Format a sprite filename from a namespace
 *
 * @param namespace - The namespace name
 * @returns The sprite filename
 *
 * @example
 * formatSpriteFilename('default') // 'icons-sprite.svg'
 * formatSpriteFilename('social') // 'icons-social.svg'
 */
export function formatSpriteFilename(namespace: string): string {
  if (namespace === 'default') {
    return 'icons-sprite.svg';
  }
  return `icons-${namespace}.svg`;
}
