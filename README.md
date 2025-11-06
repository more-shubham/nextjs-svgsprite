# Next.js SVG Sprite Plugin

A complete Next.js 15+ plugin scaffold that automatically generates SVG sprites from individual icon files, provides a `/icons` route to serve them, and includes a reusable `<Icon>` React component.

## Features

- 🎨 **Automatic SVG Sprite Generation** - Combines all `.svg` files from `/svg-icons` into a single sprite
- 🚀 **Built-in `/icons` Route** - Serves the sprite with proper caching headers
- ⚛️ **Reusable Icon Component** - Easy-to-use React component for displaying icons
- 🔄 **Hot Reload Support** - Regenerates sprite during development
- 📦 **Zero Configuration** - Works out of the box with sensible defaults
- ♿ **Accessible** - Includes `IconWithLabel` component for accessibility
- 🔷 **TypeScript Support** - Full type safety with autocomplete for icon names
- 💡 **IntelliSense** - Get icon name suggestions as you type

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

### 3. Build the Sprite

```bash
npm run build:sprite
```

This generates `public/icons-sprite.svg` from all SVG files in `svg-icons/`.

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
  svgDir: 'svg-icons',              // Directory with SVG files
  outputPath: 'public/icons-sprite.svg',  // Output path for sprite
})(nextConfig);
```

## Icon Component API

### Basic Icon

```jsx
<Icon 
  name="home"           // Required: icon name (without .svg extension)
  size={24}             // Optional: icon size in pixels (default: 24)
  color="currentColor"  // Optional: icon color (default: currentColor)
  className=""          // Optional: CSS classes
  style={{}}            // Optional: inline styles
/>
```

### Icon with Label (Accessible)

```jsx
import { IconWithLabel } from '@/components/Icon';

<IconWithLabel 
  name="home"
  label="Home page"     // Accessible label for screen readers
  size={24}
/>
```

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

## How It Works

### 1. Sprite Generation

The `scripts/build-sprite.js` script:
- Reads all `.svg` files from the `svg-icons/` directory
- Uses `svgstore` to combine them into a single sprite
- Each icon becomes a `<symbol>` with an `id` matching its filename (without extension)
- Outputs to `public/icons-sprite.svg`

### 2. The `/icons` Route

The route handler at `app/icons/route.js`:
- Serves the generated sprite at `/icons`
- Sets appropriate caching headers for performance
- Returns an empty SVG if the sprite doesn't exist

### 3. The Icon Component

The `Icon` component:
- Uses SVG `<use>` to reference symbols in the sprite
- Loads the sprite via `href="/icons#icon-name"`
- Provides props for easy customization (size, color, className)

## Integration with Existing Projects

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

{icons.map(iconName => (
  <Icon key={iconName} name={iconName} size={24} />
))}
```

### Inline Styles

```jsx
<Icon 
  name="home" 
  size={24} 
  style={{ 
    marginRight: '8px',
    verticalAlign: 'middle'
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