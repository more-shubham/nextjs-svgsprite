/**
 * /icons Route Handler
 * 
 * This route serves the generated SVG sprite at /icons
 * The sprite is automatically generated from all .svg files in /svg-icons
 */

import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

export const dynamic = 'force-static';

export async function GET() {
  try {
    const spritePath = path.join(process.cwd(), 'public', 'icons-sprite.svg');
    
    // Check if sprite file exists
    if (!fs.existsSync(spritePath)) {
      return new NextResponse(
        '<svg xmlns="http://www.w3.org/2000/svg" style="display: none;"></svg>',
        {
          status: 200,
          headers: {
            'Content-Type': 'image/svg+xml',
            'Cache-Control': 'public, max-age=31536000, immutable',
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
