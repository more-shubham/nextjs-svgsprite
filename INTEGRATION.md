# Integration Guide

This document provides detailed integration instructions for adding the Next.js SVG Sprite plugin to your existing Next.js 15+ project.

## Overview

The plugin consists of four main components:

1. **Plugin File** (`nextjs-svgsprite.js`) - Integrates with Next.js config
2. **Build Script** (`scripts/build-sprite.js`) - Generates the SVG sprite
3. **Route Handler** (`app/icons/route.js`) - Serves the sprite at `/icons`
4. **Icon Component** (`components/Icon.jsx`) - Reusable React component

## Step-by-Step Integration

### 1. Install Dependencies

Add the required dependency to your project:

```bash
npm install --save-dev svgstore
```

Or with yarn:

```bash
yarn add -D svgstore
```

### 2. Copy Core Files

Copy these files to your project:

```
your-project/
├── nextjs-svgsprite.js        # Copy this file to project root
├── scripts/
│   └── build-sprite.js        # Copy this file
├── app/
│   └── icons/
│       └── route.js           # Copy this file (or route.ts for TypeScript)
└── components/
    └── Icon.jsx               # Copy this file (or Icon.tsx for TypeScript)
```

### 3. Create SVG Icons Directory

Create a directory for your SVG icon files:

```bash
mkdir svg-icons
```

Add your SVG files to this directory. Example structure:

```
svg-icons/
├── home.svg
├── user.svg
├── settings.svg
└── ... (more icons)
```

### 4. Update Next.js Configuration

Modify your `next.config.js` to use the plugin:

**Before:**
```javascript
/** @type {import('next').NextConfig} */
const nextConfig = {
  // your config
};

module.exports = nextConfig;
```

**After:**
```javascript
/** @type {import('next').NextConfig} */
const withSvgSprite = require('./nextjs-svgsprite');

const nextConfig = {
  // your config
};

module.exports = withSvgSprite({
  svgDir: 'svg-icons',
  outputPath: 'public/icons-sprite.svg',
})(nextConfig);
```

### 5. Update package.json Scripts

Add sprite generation to your build scripts:

```json
{
  "scripts": {
    "dev": "next dev",
    "build:sprite": "node scripts/build-sprite.js",
    "build": "npm run build:sprite && next build",
    "start": "next start"
  }
}
```

### 6. Update .gitignore

Add the generated sprite to `.gitignore` if you want to regenerate it on each build:

```
# Generated sprite
public/icons-sprite.svg
```

**Note:** If you prefer to commit the sprite, remove this line.

### 7. Generate Initial Sprite

Run the build script to generate your first sprite:

```bash
npm run build:sprite
```

You should see output like:

```
Building SVG sprite...
Found 4 SVG file(s):
  ✓ home
  ✓ user
  ✓ settings
  ✓ search

Sprite generated successfully at: /path/to/public/icons-sprite.svg
Total icons: 4
```

## TypeScript Integration

### Converting to TypeScript

If your project uses TypeScript, convert the JavaScript files:

#### Icon.tsx

```typescript
import React from 'react';

interface IconProps extends React.SVGAttributes<SVGElement> {
  name: string;
  size?: number;
  color?: string;
  className?: string;
}

export default function Icon({
  name,
  size = 24,
  color = 'currentColor',
  className = '',
  style = {},
  ...props
}: IconProps) {
  if (!name) {
    console.warn('Icon component requires a "name" prop');
    return null;
  }

  return (
    <svg
      width={size}
      height={size}
      fill={color}
      className={className}
      style={style}
      aria-hidden="true"
      {...props}
    >
      <use href={`/icons#${name}`} />
    </svg>
  );
}

interface IconWithLabelProps extends IconProps {
  label: string;
}

export function IconWithLabel({
  name,
  label,
  size = 24,
  color = 'currentColor',
  className = '',
  style = {},
  ...props
}: IconWithLabelProps) {
  if (!name) {
    console.warn('IconWithLabel component requires a "name" prop');
    return null;
  }

  return (
    <svg
      width={size}
      height={size}
      fill={color}
      className={className}
      style={style}
      role="img"
      aria-label={label || name}
      {...props}
    >
      <use href={`/icons#${name}`} />
    </svg>
  );
}
```

#### app/icons/route.ts

```typescript
import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

export const dynamic = 'force-static';

export async function GET() {
  try {
    const spritePath = path.join(process.cwd(), 'public', 'icons-sprite.svg');
    
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

## Usage Examples

### Basic Usage

```jsx
import Icon from '@/components/Icon';

function MyComponent() {
  return (
    <button>
      <Icon name="home" size={20} />
      Home
    </button>
  );
}
```

### With Tailwind CSS

```jsx
import Icon from '@/components/Icon';

function Navigation() {
  return (
    <nav className="flex gap-4">
      <Icon name="home" size={24} className="text-blue-500 hover:text-blue-700" />
      <Icon name="user" size={24} className="text-gray-600" />
      <Icon name="settings" size={24} className="text-gray-600" />
    </nav>
  );
}
```

### Accessible Icons

```jsx
import { IconWithLabel } from '@/components/Icon';

function AccessibleButton() {
  return (
    <button>
      <IconWithLabel 
        name="search" 
        label="Search the site" 
        size={20} 
      />
    </button>
  );
}
```

### Dynamic Icons

```jsx
import Icon from '@/components/Icon';

function IconList({ items }) {
  return (
    <div>
      {items.map(item => (
        <div key={item.id}>
          <Icon name={item.iconName} size={24} />
          <span>{item.label}</span>
        </div>
      ))}
    </div>
  );
}
```

## Configuration Options

### Plugin Options

```javascript
withSvgSprite({
  svgDir: 'svg-icons',              // Directory containing SVG files
  outputPath: 'public/icons-sprite.svg',  // Output path for the sprite
})
```

### Customizing Icon Names

By default, the icon name is the SVG filename without the extension. For example:
- `home.svg` → `<Icon name="home" />`
- `arrow-right.svg` → `<Icon name="arrow-right" />`
- `user-profile.svg` → `<Icon name="user-profile" />`

## Build Integration

### Development Mode

During development (`npm run dev`), the sprite is automatically regenerated when you run webpack builds.

### Production Build

For production builds, the sprite is generated before the Next.js build:

```bash
npm run build
```

This runs:
1. `npm run build:sprite` - Generates the sprite
2. `next build` - Builds your Next.js app

### CI/CD Integration

Example GitHub Actions workflow:

```yaml
name: Build and Deploy

on:
  push:
    branches: [main]

jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      
      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '18'
          
      - name: Install dependencies
        run: npm ci
        
      - name: Build sprite
        run: npm run build:sprite
        
      - name: Build Next.js
        run: npm run build
        
      - name: Deploy
        run: # your deployment command
```

### Vercel Deployment

When deploying to Vercel, ensure your build command includes sprite generation:

In your Vercel project settings:
- **Build Command**: `npm run build`
- **Output Directory**: `.next`

The `build` script in `package.json` already includes `npm run build:sprite`.

## Performance Considerations

### Caching

The `/icons` route sets aggressive caching headers:

```javascript
'Cache-Control': 'public, max-age=31536000, immutable'
```

This means the browser will cache the sprite for 1 year.

### Sprite Size

The sprite size depends on the number and complexity of your icons. Best practices:

1. **Optimize SVG files** before adding them to `svg-icons/`:
   ```bash
   npm install -g svgo
   svgo svg-icons/*.svg
   ```

2. **Use simple icons** - Complex illustrations should be loaded separately

3. **Monitor sprite size** - If it exceeds 100KB, consider splitting into multiple sprites

### Loading Strategy

The Icon component uses `<use>` with an external reference, which means:
- The sprite is loaded once and cached
- All icons share the same HTTP request
- No JavaScript is needed to display icons

## Troubleshooting

### Icons Not Appearing

**Problem**: Icons don't show up on the page

**Solutions**:
1. Check that the sprite was generated: `ls -la public/icons-sprite.svg`
2. Visit `/icons` in your browser to verify the route works
3. Check browser console for errors
4. Verify icon names match SVG filenames (without .svg extension)

### Sprite Not Updating

**Problem**: Changes to SVG files don't appear

**Solutions**:
1. Delete the generated sprite: `rm public/icons-sprite.svg`
2. Regenerate: `npm run build:sprite`
3. Clear Next.js cache: `rm -rf .next`
4. Restart dev server

### TypeScript Errors

**Problem**: TypeScript complains about Icon component

**Solution**: Convert Icon.jsx to Icon.tsx with proper types (see TypeScript Integration above)

### Build Failures

**Problem**: Build fails with module not found

**Solutions**:
1. Ensure `svgstore` is installed: `npm install --save-dev svgstore`
2. Verify all files are in the correct locations
3. Check that `scripts/build-sprite.js` is executable

## Migration from Other Icon Libraries

### From react-icons

**Before:**
```jsx
import { FaHome, FaUser } from 'react-icons/fa';

<FaHome size={24} />
<FaUser size={24} />
```

**After:**
```jsx
import Icon from '@/components/Icon';

<Icon name="home" size={24} />
<Icon name="user" size={24} />
```

### From SVG Imports

**Before:**
```jsx
import HomeIcon from './icons/home.svg';

<HomeIcon width={24} height={24} />
```

**After:**
```jsx
import Icon from '@/components/Icon';

<Icon name="home" size={24} />
```

## Advanced Customization

### Custom Icon Wrapper

Create a custom wrapper with default styles:

```jsx
import Icon from '@/components/Icon';

export function StyledIcon({ name, ...props }) {
  return (
    <Icon 
      name={name}
      className="inline-block transition-colors duration-200"
      {...props}
    />
  );
}
```

### Icon Button Component

```jsx
import Icon from '@/components/Icon';

export function IconButton({ icon, label, onClick }) {
  return (
    <button
      onClick={onClick}
      className="flex items-center gap-2 px-4 py-2 rounded hover:bg-gray-100"
    >
      <Icon name={icon} size={20} />
      <span>{label}</span>
    </button>
  );
}
```

### Multiple Sprite Sources

To support multiple sprite directories:

1. Modify `scripts/build-sprite.js` to accept arguments
2. Create multiple build scripts
3. Generate multiple sprites
4. Create separate Icon components for each sprite

## Support

For issues, questions, or contributions:
1. Check the troubleshooting section
2. Review the examples in this guide
3. Open an issue on GitHub

## Version Compatibility

- **Next.js**: 15.0.0 or higher (App Router)
- **React**: 18.0.0 or higher
- **Node.js**: 16.0.0 or higher

## Next Steps

After integration:

1. Add your SVG icons to `svg-icons/`
2. Run `npm run build:sprite`
3. Import and use the `Icon` component
4. Test the `/icons` route in your browser
5. Customize the Icon component as needed

Happy coding! 🎉