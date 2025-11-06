/**
 * /icons Route Handler
 * 
 * This route serves the bundled SVG sprite at /icons
 * The sprite is pre-built and included with the package
 */

import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

export const dynamic = 'force-static';

export async function GET() {
  try {
    // Serve the bundled sprite from the package
    // Use require.resolve to find the sprite file in node_modules
    let spritePath: string;
    try {
      spritePath = require.resolve('nextjs-svgsprite/lib/icons-sprite.svg');
    } catch {
      // Fallback for development or when resolving from within the package
      spritePath = path.join(__dirname, '../icons-sprite.svg');
    }
    
    // Check if sprite file exists
    if (!fs.existsSync(spritePath)) {
      return new NextResponse(
        '<svg xmlns="http://www.w3.org/2000/svg" style="display: none;"><!-- Sprite file not found --></svg>',
        {
          status: 404,
          headers: {
            'Content-Type': 'image/svg+xml',
          },
        }
      );
    }

    // Read and return the sprite file
    const spriteContent = fs.readFileSync(spritePath, 'utf8');
    
    return new NextResponse(spriteContent, {
      status: 200,
      headers: {
        'Content-Type': 'image/svg+xml',
        'Cache-Control': 'public, max-age=31536000, immutable',
      },
    });
  } catch (error) {
    console.error('Error serving sprite:', error);
    return new NextResponse(
      '<svg xmlns="http://www.w3.org/2000/svg" style="display: none;"></svg>',
      {
        status: 500,
        headers: {
          'Content-Type': 'image/svg+xml',
        },
      }
    );
  }
}
