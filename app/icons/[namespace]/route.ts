/**
 * /icons/[namespace] Route Handler
 * 
 * This route serves namespace-specific SVG sprites at /icons/{namespace}
 * Each namespace (e.g., social, brands) gets its own sprite file
 */

import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

export const dynamic = 'force-static';

// Generate static params for all namespaces
export async function generateStaticParams() {
  const publicDir = path.join(process.cwd(), 'public');
  
  if (!fs.existsSync(publicDir)) {
    return [];
  }

  // Find all sprite files (icons-*.svg except icons-sprite.svg which is default)
  const files = fs.readdirSync(publicDir);
  const namespaces = files
    .filter(file => file.startsWith('icons-') && file.endsWith('.svg') && file !== 'icons-sprite.svg')
    .map(file => {
      // Extract namespace from filename: icons-social.svg -> social
      const match = file.match(/^icons-(.+)\.svg$/);
      return match ? match[1] : null;
    })
    .filter(Boolean);

  return namespaces.map(namespace => ({
    namespace,
  }));
}

export async function GET(
  request: Request,
  { params }: { params: Promise<{ namespace: string }> }
) {
  try {
    const { namespace } = await params;
    const spritePath = path.join(process.cwd(), 'public', `icons-${namespace}.svg`);
    
    // Check if sprite file exists
    if (!fs.existsSync(spritePath)) {
      return new NextResponse(
        '<svg xmlns="http://www.w3.org/2000/svg" style="display: none;"></svg>',
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
