/**
 * /icons Route Handler
 *
 * This API route serves the default SVG sprite file at the `/icons` endpoint.
 * The sprite contains all root-level icons (icons not in subdirectories).
 *
 * Features:
 * - Static generation (SSG) for optimal performance
 * - Long-term caching headers for production
 * - Graceful error handling
 * - Serves empty sprite if file doesn't exist
 *
 * @module app/icons/route
 * @author Next.js SVG Sprite Plugin Team
 *
 * Route: GET /icons
 * Returns: SVG sprite content (image/svg+xml)
 * Cache: public, max-age=31536000, immutable
 */

import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

/**
 * Force static generation for this route
 * This ensures the route is pre-rendered at build time
 */
export const dynamic = 'force-static';

/**
 * Empty SVG sprite placeholder
 * Used when the sprite file doesn't exist or an error occurs
 */
const EMPTY_SPRITE = '<svg xmlns="http://www.w3.org/2000/svg" style="display: none;"></svg>';

/**
 * Cache control header for long-term caching
 * - public: Can be cached by any cache
 * - max-age=31536000: Cache for 1 year (in seconds)
 * - immutable: Content will never change
 */
const CACHE_CONTROL_HEADER = 'public, max-age=31536000, immutable';

/**
 * GET handler for the /icons route
 *
 * Serves the default SVG sprite file containing all root-level icons.
 * If the sprite file doesn't exist, returns an empty SVG sprite.
 *
 * @returns {Promise<NextResponse>} Response with SVG content and appropriate headers
 *
 * @example
 * ```
 * // Request
 * GET /icons
 *
 * // Response
 * Content-Type: image/svg+xml
 * Cache-Control: public, max-age=31536000, immutable
 *
 * <svg xmlns="http://www.w3.org/2000/svg" ...>
 *   <symbol id="home">...</symbol>
 *   <symbol id="user">...</symbol>
 *   ...
 * </svg>
 * ```
 */
export async function GET() {
  try {
    const spritePath = path.join(process.cwd(), 'public', 'icons-sprite.svg');

    // Check if sprite file exists
    if (!fs.existsSync(spritePath)) {
      console.warn('Default sprite file not found, serving empty sprite');
      return new NextResponse(EMPTY_SPRITE, {
        status: 200,
        headers: {
          'Content-Type': 'image/svg+xml',
          'Cache-Control': CACHE_CONTROL_HEADER,
        },
      });
    }

    // Read and return the sprite file
    const spriteContent = fs.readFileSync(spritePath, 'utf8');

    return new NextResponse(spriteContent, {
      status: 200,
      headers: {
        'Content-Type': 'image/svg+xml',
        'Cache-Control': CACHE_CONTROL_HEADER,
      },
    });
  } catch (error) {
    console.error('Error serving default sprite:', error);

    // Return empty sprite on error to prevent breaking the application
    return new NextResponse(EMPTY_SPRITE, {
      status: 500,
      headers: {
        'Content-Type': 'image/svg+xml',
      },
    });
  }
}
