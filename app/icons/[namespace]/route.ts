/**
 * /icons/[namespace] Route Handler
 *
 * This dynamic API route serves namespace-specific SVG sprite files.
 * Each namespace (e.g., 'social', 'brands') gets its own sprite file.
 *
 * Features:
 * - Static generation with generateStaticParams
 * - Automatic namespace detection from sprite files
 * - Long-term caching for optimal performance
 * - Graceful error handling
 *
 * @module app/icons/[namespace]/route
 * @author Next.js SVG Sprite Plugin Team
 *
 * Routes:
 * - GET /icons/social → icons-social.svg
 * - GET /icons/brands → icons-brands.svg
 * - GET /icons/{namespace} → icons-{namespace}.svg
 */

import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';
import { EMPTY_SPRITE_SVG, CACHE_CONTROL, SPRITE_PATTERNS } from '@/lib/config';

/**
 * Force static generation for this route
 * Ensures routes are pre-rendered at build time
 */
export const dynamic = 'force-static';

/**
 * Generate static params for all available namespaces
 *
 * This function scans the public directory for sprite files and extracts
 * namespace names. It enables static generation for all namespace routes.
 *
 * @returns {Promise<Array<{namespace: string}>>} Array of namespace params
 *
 * @example
 * ```
 * // If public/ contains: icons-social.svg, icons-brands.svg
 * // Returns: [{ namespace: 'social' }, { namespace: 'brands' }]
 * ```
 */
export async function generateStaticParams() {
  const publicDir = path.join(process.cwd(), 'public');

  // Return empty array if public directory doesn't exist
  if (!fs.existsSync(publicDir)) {
    console.warn('Public directory not found, no namespace sprites to generate');
    return [];
  }

  try {
    // Find all sprite files (icons-*.svg except icons-sprite.svg which is default)
    const files = fs.readdirSync(publicDir);
    const namespaces = files
      .filter(SPRITE_PATTERNS.isNamespaceSprite)
      .map(SPRITE_PATTERNS.extractNamespace)
      .filter(Boolean) as string[];

    console.log(`Found ${namespaces.length} namespace(s): ${namespaces.join(', ')}`);

    return namespaces.map((namespace) => ({
      namespace,
    }));
  } catch (error) {
    console.error('Error generating static params:', error);
    return [];
  }
}

/**
 * GET handler for namespace-specific sprite routes
 *
 * Serves the sprite file for a specific namespace. If the sprite file
 * doesn't exist, returns a 404 response with an empty sprite.
 *
 * @param {Request} request - The incoming request
 * @param {Object} context - Route context with params
 * @param {Promise<{namespace: string}>} context.params - Route parameters
 * @returns {Promise<NextResponse>} Response with SVG content and appropriate headers
 *
 * @example
 * ```
 * // Request
 * GET /icons/social
 *
 * // Response
 * Content-Type: image/svg+xml
 * Cache-Control: public, max-age=31536000, immutable
 *
 * <svg xmlns="http://www.w3.org/2000/svg" ...>
 *   <symbol id="facebook">...</symbol>
 *   <symbol id="twitter">...</symbol>
 *   ...
 * </svg>
 * ```
 */
export async function GET(
  request: Request,
  { params }: { params: Promise<{ namespace: string }> },
) {
  try {
    const { namespace } = await params;

    // Validate namespace parameter
    if (!namespace) {
      console.error('Namespace parameter is missing');
      return new NextResponse(EMPTY_SPRITE_SVG, {
        status: 400,
        headers: {
          'Content-Type': 'image/svg+xml',
        },
      });
    }

    const spritePath = path.join(process.cwd(), 'public', `icons-${namespace}.svg`);

    // Check if sprite file exists
    if (!fs.existsSync(spritePath)) {
      console.warn(`Sprite file not found for namespace: ${namespace}`);
      return new NextResponse(EMPTY_SPRITE_SVG, {
        status: 404,
        headers: {
          'Content-Type': 'image/svg+xml',
        },
      });
    }

    // Read and return the sprite file
    const spriteContent = fs.readFileSync(spritePath, 'utf8');

    return new NextResponse(spriteContent, {
      status: 200,
      headers: {
        'Content-Type': 'image/svg+xml',
        'Cache-Control': CACHE_CONTROL.buildHeader(),
      },
    });
  } catch (error) {
    console.error('Error serving namespace sprite:', error);

    // Return empty sprite on error
    return new NextResponse(EMPTY_SPRITE_SVG, {
      status: 500,
      headers: {
        'Content-Type': 'image/svg+xml',
      },
    });
  }
}
