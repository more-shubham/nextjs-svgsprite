# Setting Up Routes for Exported Icon Component

When using the `nextjs-svgsprite` package in your Next.js application, you need to set up route handlers to serve the bundled sprites.

## Quick Setup

### Step 1: Create Default Icons Route

Create the file `app/icons/route.ts` in your Next.js project:

```typescript
// app/icons/route.ts
export { GET, dynamic } from 'nextjs-svgsprite/icons/route';
```

This single line re-exports the bundled route handler that serves the default icon sprite.

### Step 2: Create Namespace Icons Route

Create the file `app/icons/[namespace]/route.ts` in your Next.js project:

```typescript
// app/icons/[namespace]/route.ts
export { GET, dynamic, generateStaticParams } from 'nextjs-svgsprite/icons/[namespace]/route';
```

This handles namespaced icons like `social:facebook` and `brands:apple`.

## That's It!

With these two route files, your application will:
- Serve the default sprite at `/icons`
- Serve namespace sprites at `/icons/social`, `/icons/brands`, etc.
- Use static generation for optimal performance
- Include proper caching headers

## Using the Icon Component

After setting up the routes, you can use the Icon component anywhere in your app:

```tsx
import Icon from 'nextjs-svgsprite/Icon';

export default function MyComponent() {
  return (
    <div>
      <Icon name="home" size={24} />
      <Icon name="social:facebook" size={32} />
      <Icon name="brands:apple" size={28} />
    </div>
  );
}
```

## Verification

To verify the routes are working:

1. Start your Next.js development server: `npm run dev`
2. Visit `http://localhost:3000/icons` in your browser
3. You should see the SVG sprite XML content
4. Visit `http://localhost:3000/icons/social` to see the social icons sprite
5. Visit `http://localhost:3000/icons/brands` to see the brand icons sprite

## Directory Structure

Your Next.js app structure should look like this:

```
your-nextjs-app/
├── app/
│   ├── icons/
│   │   ├── [namespace]/
│   │   │   └── route.ts       # Re-exports namespace route handler
│   │   └── route.ts           # Re-exports default route handler
│   ├── layout.tsx
│   └── page.tsx
├── package.json
└── ...
```

## Alternative: Custom Route Handlers

If you need to customize the route handlers, you can create your own instead of re-exporting:

```typescript
// app/icons/route.ts - Custom handler
import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

export const dynamic = 'force-static';

export async function GET() {
  try {
    // Serve from node_modules where the package is installed
    const spritePath = require.resolve('nextjs-svgsprite/lib/icons-sprite.svg');
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
```

But using the simple re-export approach is recommended for most use cases.
