# Next.js SVG Sprite Plugin

A complete Next.js 15+ plugin scaffold that automatically generates SVG sprites from individual icon files, provides a `/icons` route to serve them, and includes a reusable `<Icon>` React component.

## Features

- 🎨 **Automatic SVG Sprite Generation** - Generates separate sprite files per namespace
- 🚀 **Built-in Static Routes** - Serves sprites with proper caching headers (SSG/Static)
- ⚛️ **Reusable Icon Component** - Easy-to-use React component with automatic namespace detection
- 🔄 **Hot Reload Support** - Regenerates sprites during development (with file watcher)
- 📦 **Zero Configuration** - Works out of the box with sensible defaults
- ♿ **Accessible** - Includes `IconWithLabel` component for accessibility
- 🔷 **TypeScript Support** - Full type safety with autocomplete for icon names
- 💡 **IntelliSense** - Get icon name suggestions as you type
- 🔧 **Automatic Name Normalization** - Converts all naming conventions to kebab-case
- 📁 **Namespace Support** - Separate sprite files per folder (e.g., `social/` → `icons-social.svg`)
- 🔍 **Duplicate Detection** - Shows build-time errors when multiple files normalize to the same name
- ⚡ **Performance Optimized** - Each namespace loads only its own icons
- 🚀 **NEW: Dynamic Loading** - Client-side lazy loading with intelligent caching (no route setup needed!)

## Quick Start

### 1. Installation

```bash
npm install
```

### 2. Add Your Icons

Place your SVG icon files in the `svg-icons/` directory:

```
svg-icons/
  ├── home.svg
  ├── user.svg
  ├── settings.svg
  └── search.svg
```

**With Namespaces (optional):**
Organize icons in subdirectories for namespacing:

```
svg-icons/
  ├── home.svg
  ├── user.svg
  ├── social/
  │   ├── facebook.svg
  │   └── twitter.svg
  └── brands/
      ├── apple.svg
      └── google.svg
```

This creates:

- Namespaced icons: `social:facebook`, `social:twitter`, `brands:apple`, `brands:google`
- Separate sprite files: `icons-social.svg`, `icons-brands.svg`
- Root level icons in: `icons-sprite.svg` (default namespace)

### 3. Build the Sprite

```bash
npm run build:sprite
```

This generates separate sprite files in `public/`:

- `public/icons-sprite.svg` - Default/root level icons
- `public/icons-social.svg` - Social namespace icons
- `public/icons-brands.svg` - Brands namespace icons

### 4. Use the Icon Component

**JavaScript:**

```jsx
import Icon from '@/components/Icon';

export default function MyComponent() {
  return (
    <div>
      <Icon name="home" size={24} />
      <Icon name="user" size={32} color="blue" />
      <Icon name="settings" size={24} className="my-icon" />
    </div>
  );
}
```

**TypeScript (with autocomplete!):**

```tsx
import Icon from '@/components/Icon';

export default function MyComponent() {
  return (
    <div>
      {/* Your IDE will autocomplete icon names: home, user, settings, search */}
      <Icon name="home" size={24} />
      <Icon name="user" size={32} color="blue" />
      <Icon name="settings" size={24} className="my-icon" />
    </div>
  );
}
```

> 📘 **TypeScript Users**: See [TYPESCRIPT.md](./TYPESCRIPT.md) for complete TypeScript documentation including type-safe icon names and autocomplete features.

## Folder Structure

```
nextjs-svgsprite/
├── app/
│   ├── icons/
│   │   └── route.ts           # Route handler for /icons endpoint
│   ├── layout.tsx             # Root layout
│   └── page.tsx               # Example page
├── components/
│   ├── Icon.tsx               # Reusable Icon component (TypeScript)
│   └── icon-types.ts          # Auto-generated icon types
├── scripts/
│   └── build-sprite.js        # Sprite generation script
├── svg-icons/                 # Place your SVG files here
│   ├── home.svg
│   ├── user.svg
│   ├── settings.svg
│   └── search.svg
├── public/
│   └── icons-sprite.svg       # Generated sprite (gitignored)
├── next.config.js             # Next.js config with plugin
├── nextjs-svgsprite.js        # Plugin implementation
├── tsconfig.json              # TypeScript configuration
└── package.json
```

## Plugin Configuration

### Basic Usage

In `next.config.js`:

```javascript
const withSvgSprite = require('./nextjs-svgsprite');

const nextConfig = {
  // Your Next.js config
};

module.exports = withSvgSprite()(nextConfig);
```

### Custom Configuration

```javascript
const withSvgSprite = require('./nextjs-svgsprite');

const nextConfig = {
  // Your Next.js config
};

module.exports = withSvgSprite({
  svgDir: 'svg-icons', // Directory with SVG files
  outputPath: 'public/icons-sprite.svg', // Output path for sprite
})(nextConfig);
```

## Icon Component API

### Basic Icon

```jsx
<Icon
  name="home" // Required: icon name (without .svg extension)
  size={24} // Optional: icon size in pixels (default: 24)
  color="currentColor" // Optional: icon color (default: currentColor)
  className="" // Optional: CSS classes
  style={{}} // Optional: inline styles
/>
```

### Icon with Label (Accessible)

```jsx
import { IconWithLabel } from '@/components/Icon';

<IconWithLabel
  name="home"
  label="Home page" // Accessible label for screen readers
  size={24}
/>;
```

## Dynamic Icon Loading (NEW!)

The new `IconDynamic` component provides client-side lazy loading with intelligent caching, eliminating the need for manual route setup. Perfect for client-heavy applications and npm packages!

### Key Benefits

- ✅ **No Route Setup Required** - Just import and use, no need to copy route files
- ✅ **Lazy Loading** - Sprites loaded on-demand per namespace
- ✅ **Smart Caching** - In-memory + session storage with version management
- ✅ **Easy Integration** - Works out of the box in any Next.js project
- ✅ **Version Management** - Automatic cache invalidation on version changes

### Usage

```tsx
'use client';

import IconDynamic from '@/components/IconDynamic';

export default function MyComponent() {
  return (
    <div>
      {/* Default namespace icon */}
      <IconDynamic name="home" size={24} />
      
      {/* Namespaced icon - loads 'social' sprite on first use */}
      <IconDynamic name="social:facebook" size={32} />
      
      {/* Another namespaced icon - reuses cached 'social' sprite */}
      <IconDynamic name="social:twitter" size={32} />
    </div>
  );
}
```

### Advanced Features

**Preload Namespaces:**
```tsx
import { preloadSprites } from '@/components/IconDynamic';

useEffect(() => {
  preloadSprites(['social', 'brands']); // Preload common namespaces
}, []);
```

**Clear Cache:**
```tsx
import { clearSpriteCache } from '@/components/IconDynamic';

clearSpriteCache(); // Clear all cached sprites
```

**Check Version:**
```tsx
import { getSpriteVersion } from '@/components/IconDynamic';

console.log('Sprite version:', getSpriteVersion());
```

### When to Use Dynamic vs Static

**Use `Icon` (Static)** when:
- You're using server components
- You need maximum performance with static routes
- You don't mind setting up route handlers

**Use `IconDynamic` (Dynamic)** when:
- You want zero configuration
- You're building a client-heavy application
- You're publishing an npm package
- You need lazy loading and intelligent caching
- You want built-in version management

> 📘 **Full Documentation**: See [DYNAMIC_LOADING.md](./DYNAMIC_LOADING.md) for complete documentation on dynamic loading, caching strategies, and advanced usage.

## Build Scripts

### `npm run dev`

Starts the development server with hot reload. The sprite is regenerated automatically when SVG files change.

### `npm run build:sprite`

Manually generates the SVG sprite from all files in `svg-icons/`.

### `npm run build`

Builds the sprite and then builds the Next.js application for production.

### `npm start`

Starts the production server.

## TypeScript Support

This package provides full TypeScript support with **type-safe icon names** and **autocomplete suggestions**!

When you run `npm run build:sprite`, the script automatically:

1. ✅ Generates TypeScript type definitions from your SVG files
2. ✅ Creates a union type of all available icon names
3. ✅ Enables IDE autocomplete for icon names

### Example with TypeScript

```tsx
import Icon from '@/components/Icon';

export default function MyComponent() {
  return (
    <>
      {/* ✅ Valid - TypeScript knows "home" exists */}
      <Icon name="home" size={24} />

      {/* ❌ TypeScript error - "invalid" icon doesn't exist */}
      <Icon name="invalid" size={24} />

      {/* 💡 Your IDE will suggest: "home" | "user" | "settings" | "search" */}
      <Icon name="" size={24} />
    </>
  );
}
```

### Auto-Generated Types

The build script creates `components/icon-types.ts`:

```typescript
export type IconName = 'home' | 'search' | 'settings' | 'user';
export const iconNames = ['home', 'search', 'settings', 'user'] as const;
```

### Benefits

- 🔷 **Type Safety**: Catch invalid icon names at compile time
- 💡 **Autocomplete**: Your IDE suggests available icon names as you type
- 📝 **Self-Documenting**: Types serve as inline documentation
- 🔄 **Always in Sync**: Types update automatically when you add/remove icons

### Full TypeScript Documentation

For complete TypeScript documentation, including:

- Advanced type usage
- Migration from JavaScript
- IDE setup and configuration
- Troubleshooting

See **[TYPESCRIPT.md](./TYPESCRIPT.md)**

## Naming Conventions & Normalization

All icon names are automatically normalized to **kebab-case** format. This means you can use any naming convention in your SVG files, and they'll be standardized:

### Supported Naming Patterns

| Original Filename | Normalized Name              |
| ----------------- | ---------------------------- |
| `sunMoon.svg`     | `sun-moon`                   |
| `SunMoon.svg`     | `sun-moon`                   |
| `sun_moon.svg`    | `sun-moon`                   |
| `sun moon.svg`    | `sun-moon`                   |
| `sun-moon.svg`    | `sun-moon`                   |
| `sun  moon.svg`   | `sun-moon` (multiple spaces) |

### Duplicate Detection

If multiple files normalize to the same name, the plugin will:

1. ⚠️ Show a warning listing all duplicate files
2. Keep only the first occurrence
3. Remove the duplicates from the final sprite

Example warning:

```
⚠️  Warning: Duplicate icon names detected after normalization:
   "sun-moon" found in: [SunMoon, sun-moon, sunMoon, sun_moon]
   These duplicates have been removed. Only the first occurrence is kept.
```

### Namespace Support

Organize icons using folders. The folder structure becomes the namespace:

**Simple Namespace:**

```
svg-icons/
  └── social/
      ├── facebook.svg  → social:facebook
      └── twitter.svg   → social:twitter
```

**Nested Namespace:**

```
svg-icons/
  └── sidebar/
      └── nav items/
          └── user menu.svg  → sidebar:nav-items:user-menu
```

**Using Namespaced Icons:**

```tsx
<Icon name="social:facebook" size={24} />
<Icon name="sidebar:nav-items:user-menu" size={24} />
```

> **Note:** Folder names are also normalized to kebab-case, just like file names.

## How It Works

### 1. Sprite Generation (Per Namespace)

The `scripts/build-sprite.js` script:

- Reads all `.svg` files from the `svg-icons/` directory (including subdirectories)
- Normalizes all file and folder names to kebab-case
- Groups icons by namespace based on folder structure
- Generates **separate sprite files** for each namespace:
  - Root level icons → `icons-sprite.svg` (default namespace)
  - `social/` folder → `icons-social.svg`
  - `brands/` folder → `icons-brands.svg`
- Each icon becomes a `<symbol>` with an `id` (without namespace prefix in the file)
- Shows build errors when duplicate normalized names are detected

**Example Build Output:**

```
📦 Building sprite for namespace: brands
  ✓ brands:apple (from brands/apple)
  ✓ brands:google (from brands/google)
  ✅ Sprite saved: icons-brands.svg (2 icons)

📦 Building sprite for namespace: default
  ✓ home (from home)
  ✓ user (from user)
  ✅ Sprite saved: icons-sprite.svg (6 icons)
```

### 2. Static Routes for Sprites

**Default Route** (`app/icons/route.ts`):

- Serves the default sprite at `/icons`
- Static generation with `force-static`

**Namespace Routes** (`app/icons/[namespace]/route.ts`):

- Serves namespace sprites at `/icons/{namespace}`
- Static generation with `generateStaticParams()`
- Examples: `/icons/social`, `/icons/brands`
- All routes have proper caching headers for performance

### 3. Smart Icon Component

The `Icon` component automatically:

- Detects namespace from icon name (e.g., `social:facebook`)
- Loads from the correct sprite file:
  - `<Icon name="home" />` → loads from `/icons#home`
  - `<Icon name="social:facebook" />` → loads from `/icons/social#facebook`
- Uses SVG `<use>` to reference symbols
- Provides props for easy customization (size, color, className)

**Performance Benefits:**

- Each page only loads the sprite files it needs
- Namespaced icons don't pollute the default sprite
- Better code splitting and faster page loads

## Integration with Existing Projects

### Option 1: Dynamic Loading (Easiest - Recommended)

**No route setup required!** Just copy the components and start using them:

1. **Copy files:**
   - `components/IconDynamic.tsx` - Dynamic icon component
   - `components/sprite-loader.ts` - Sprite loader utility

2. **Use in your project:**
   ```tsx
   'use client';
   import IconDynamic from '@/components/IconDynamic';
   
   <IconDynamic name="home" size={24} />
   ```

3. **That's it!** Icons will be loaded dynamically with caching.

> 💡 **Perfect for**: Client-side apps, npm packages, projects where you want zero configuration

### Option 2: Static Routes (Traditional)

If you prefer static routes with SSG:

### Step 1: Copy Files

Copy these files to your project:

- `nextjs-svgsprite.js` - Plugin
- `scripts/build-sprite.js` - Build script
- `app/icons/route.js` - Route handler
- `components/Icon.jsx` - Icon component

### Step 2: Update Configuration

Update `next.config.js`:

```javascript
const withSvgSprite = require('./nextjs-svgsprite');

const nextConfig = {
  // Your existing config
};

module.exports = withSvgSprite()(nextConfig);
```

### Step 3: Update package.json

Add scripts and dependencies:

```json
{
  "scripts": {
    "build:sprite": "node scripts/build-sprite.js",
    "build": "npm run build:sprite && next build"
  },
  "devDependencies": {
    "svgstore": "^3.0.1"
  }
}
```

### Step 4: Add SVG Icons

Create a `svg-icons/` directory and add your SVG files.

### Step 5: Generate Sprite

```bash
npm install
npm run build:sprite
```

## Advanced Usage

### Custom Styling

Icons inherit the current text color by default. You can style them with CSS:

```css
.my-icon {
  color: blue;
  transition: color 0.3s;
}

.my-icon:hover {
  color: red;
}
```

```jsx
<Icon name="home" size={24} className="my-icon" />
```

### Dynamic Icon Names

```jsx
const icons = ['home', 'user', 'settings'];

{
  icons.map((iconName) => <Icon key={iconName} name={iconName} size={24} />);
}
```

### Inline Styles

```jsx
<Icon
  name="home"
  size={24}
  style={{
    marginRight: '8px',
    verticalAlign: 'middle',
  }}
/>
```

## Build Output

After running `npm run build:sprite`, you'll see output like:

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

## Troubleshooting

### Icons Not Showing

1. **Check sprite generation**: Run `npm run build:sprite` manually
2. **Verify route**: Visit `/icons` in your browser to see if the sprite loads
3. **Check icon names**: Ensure the `name` prop matches the SVG filename (without .svg)

### Sprite Not Updating

1. **Delete the old sprite**: Remove `public/icons-sprite.svg`
2. **Rebuild**: Run `npm run build:sprite`
3. **Clear Next.js cache**: Delete `.next/` directory and restart

### Icons Missing Styles

- Check that your SVG files don't have hardcoded `fill` or `stroke` attributes
- Use `currentColor` in your SVG files for inheritable colors
- The build script copies these attributes: `fill`, `stroke`, `stroke-width`, `stroke-linecap`, `stroke-linejoin`

## Production Deployment

Before deploying:

1. Run `npm run build:sprite` to generate the sprite
2. Commit the sprite to git if needed (or regenerate during build)
3. The `/icons` route will serve the sprite with proper caching headers

## Browser Support

Works in all modern browsers that support:

- SVG `<use>` element
- ES6+ JavaScript (via Next.js transpilation)

## License

MIT

## Contributing

Feel free to submit issues and pull requests!
