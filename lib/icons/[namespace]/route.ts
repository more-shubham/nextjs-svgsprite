/**
 * /icons/[namespace] Route Handler
 * 
 * This route serves namespace-specific SVG sprites at /icons/{namespace}
 * Examples: /icons/social, /icons/brands
 */

import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

export const dynamic = 'force-static';

// Generate static params for all available namespaces
export async function generateStaticParams() {
  try {
    // Try to resolve from node_modules
    let libDir: string;
    try {
      const spritePath = require.resolve('nextjs-svgsprite/lib/icons-sprite.svg');
      libDir = path.dirname(spritePath);
    } catch {
      // Fallback for development
      libDir = path.join(__dirname, '../../');
    }
    
    const files = fs.readdirSync(libDir);
    
    // Find all sprite files with namespace pattern: icons-{namespace}.svg
    const namespaces = files
      .filter(file => file.startsWith('icons-') && file.endsWith('.svg') && file !== 'icons-sprite.svg')
      .map(file => ({
        namespace: file.replace('icons-', '').replace('.svg', '')
      }));

    return namespaces;
  } catch (error) {
    console.error('Error generating static params:', error);
    return [];
  }
}

export async function GET(
  _request: Request,
  { params }: { params: { namespace: string } }
) {
  try {
    const { namespace } = params;
    
    // Serve the bundled namespace sprite from the package
    let spritePath: string;
    try {
      spritePath = require.resolve(`nextjs-svgsprite/lib/icons-${namespace}.svg`);
    } catch {
      // Fallback for development
      spritePath = path.join(__dirname, `../../icons-${namespace}.svg`);
    }
    
    // Check if sprite file exists
    if (!fs.existsSync(spritePath)) {
      return new NextResponse(
        '<svg xmlns="http://www.w3.org/2000/svg" style="display: none;"><!-- Namespace sprite not found --></svg>',
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
    console.error('Error serving namespace sprite:', error);
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
