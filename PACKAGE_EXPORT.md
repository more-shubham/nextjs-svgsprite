# Package Export Feature

This document explains how the `nextjs-svgsprite` package exports a ready-to-use Icon component with pre-built SVG sprites.

## Overview

The package has been enhanced to export a complete icon library that can be directly used in Next.js applications. Users no longer need to manage their own SVG files or set up sprite generation - everything is pre-built and included with the package.

## What's Included

### Pre-built Icons

The package includes 10 pre-built icons organized into namespaces:

**Default Icons:**
- `home` - Home icon
- `user` - User profile icon
- `settings` - Settings/gear icon
- `search` - Search icon
- `star` - Star icon
- `sun-moon` - Theme toggle icon

**Social Icons (namespace: social):**
- `social:facebook` - Facebook logo
- `social:twitter` - Twitter logo

**Brand Icons (namespace: brands):**
- `brands:apple` - Apple logo
- `brands:google` - Google logo

### Exported Components

1. **Icon Component** - Main icon display component
2. **IconWithLabel Component** - Accessible icon with label
3. **TypeScript Types** - Full type safety with autocomplete
4. **Route Handlers** - Pre-configured routes to serve sprites

## Package Structure

```
lib/
├── Icon.tsx                     # Icon component
├── icon-types.ts                # TypeScript type definitions
├── icons-sprite.svg             # Default sprite file
├── icons-social.svg             # Social namespace sprite
├── icons-brands.svg             # Brands namespace sprite
└── icons/
    ├── route.ts                 # Default icons route handler
    └── [namespace]/
        └── route.ts             # Namespace icons route handler
```

## Installation & Usage

### Step 1: Install Package

```bash
npm install nextjs-svgsprite
```

### Step 2: Set Up Routes

Create two route files in your Next.js app:

**app/icons/route.ts:**
```typescript
export { GET, dynamic } from 'nextjs-svgsprite/icons/route';
```

**app/icons/[namespace]/route.ts:**
```typescript
export { GET, dynamic, generateStaticParams } from 'nextjs-svgsprite/icons/[namespace]/route';
```

### Step 3: Use Icon Component

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

## Package Exports

The package.json exports configuration:

```json
{
  "exports": {
    ".": "./nextjs-svgsprite.js",
    "./Icon": "./lib/Icon.tsx",
    "./icon-types": "./lib/icon-types.ts",
    "./icons/route": "./lib/icons/route.ts",
    "./icons/[namespace]/route": "./lib/icons/[namespace]/route.ts",
    "./lib/icons-sprite.svg": "./lib/icons-sprite.svg",
    "./lib/icons-social.svg": "./lib/icons-social.svg",
    "./lib/icons-brands.svg": "./lib/icons-brands.svg"
  }
}
```

## Build Process

The package uses a build script (`npm run build:lib`) that:

1. Generates SVG sprites from source icons
2. Creates TypeScript type definitions
3. Copies sprites to the `lib/` directory
4. Prepares the package for publishing

The `prepublishOnly` script ensures sprites are always up-to-date before publishing to npm.

## Features

✅ **Zero Configuration** - Works out of the box
✅ **Pre-built Icons** - 10 icons included (social, brands, utility)
✅ **TypeScript Support** - Full type safety with autocomplete
✅ **Namespace Support** - Organized icon sets
✅ **Static Generation** - Optimal performance with Next.js
✅ **Proper Caching** - Immutable cache headers for sprites
✅ **Accessible** - IconWithLabel component for screen readers
✅ **No Build Step Required** - Icons are pre-built in the package

## Route Handler Implementation

The route handlers use `require.resolve()` to locate sprites in `node_modules`:

```typescript
// Primary method: resolve from node_modules
let spritePath: string;
try {
  spritePath = require.resolve('nextjs-svgsprite/lib/icons-sprite.svg');
} catch {
  // Fallback for development
  spritePath = path.join(__dirname, '../icons-sprite.svg');
}
```

This ensures sprites are found whether the package is:
- Installed via npm in node_modules
- Used during development
- Linked via npm link

## TypeScript Support

Full TypeScript support with icon name validation:

```tsx
import Icon, { IconName, iconNames } from 'nextjs-svgsprite/Icon';

// Type-safe icon names
const iconName: IconName = 'home'; // ✅ Valid
const invalid: IconName = 'nope';  // ❌ Type error

// All available icons
console.log(iconNames); 
// ['home', 'user', 'settings', 'search', 'star', 'sun-moon', 
//  'social:facebook', 'social:twitter', 'brands:apple', 'brands:google']
```

## Files Included in Package

The `files` array in package.json specifies what gets published:

```json
{
  "files": [
    "nextjs-svgsprite.js",
    "lib/**/*",
    "scripts/build-sprite.js",
    "components/Icon.tsx",
    "components/icon-types.ts",
    "app/icons/**/*"
  ]
}
```

This ensures:
- All lib files (sprites, Icon component, routes)
- Build scripts for custom sprite generation
- Original components for reference
- Example route handlers

## Security

✅ No vulnerabilities detected in dependencies
✅ CodeQL analysis passed with 0 alerts
✅ All sprites are static SVG files
✅ Route handlers include proper error handling

## Documentation

- **EXPORT_USAGE.md** - Comprehensive usage guide
- **examples/exported-usage-example.tsx** - Complete example component
- **examples/app-routes-setup.md** - Route setup instructions

## Benefits Over Previous Approach

**Before:**
- Users had to manage their own SVG files
- Required sprite generation setup
- Need to run build scripts
- Configure routes manually

**After:**
- Icons included in package
- No build step needed for users
- Simple route re-export
- Just import and use

## Backwards Compatibility

The package still includes:
- `nextjs-svgsprite.js` plugin for custom sprite generation
- Original components for local development
- Build scripts for adding custom icons

This allows both use cases:
1. **Library Mode** - Use pre-built icons (new feature)
2. **Plugin Mode** - Generate sprites from custom SVGs (original feature)

## Version

This feature is available starting from version 1.0.0
