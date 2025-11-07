# Dynamic Icon Loading

This document describes the new dynamic icon loading feature that eliminates the need for manual route setup and provides lazy loading with intelligent caching.

## Overview

The dynamic icon loading system allows you to use icons without setting up route handlers (`app/icons/route.ts`). Icons are loaded on-demand per namespace and cached intelligently for optimal performance.

## Key Features

### 1. **No Route Setup Required**
- Just import and use the `IconDynamic` component
- No need to copy route handler files
- Works out of the box in any Next.js project

### 2. **Lazy Loading**
- Sprites are loaded only when needed
- Each namespace is loaded independently
- No upfront loading of unused icons

### 3. **Intelligent Caching**
- **In-Memory Cache**: Loaded sprites stay in memory during the session
- **Session Storage Cache**: Persists across page reloads
- **Version Management**: Automatic cache invalidation when version changes

### 4. **Namespace Support**
- Each namespace (e.g., `social`, `brands`) is loaded separately
- Only load what you use
- Better performance and smaller initial bundle

## Usage

### Basic Usage

```tsx
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

### With Accessibility

```tsx
import { IconDynamicWithLabel } from '@/components/IconDynamic';

<IconDynamicWithLabel 
  name="home" 
  label="Go to homepage" 
  size={24} 
/>
```

### For Published Package

```tsx
import IconDynamic from 'nextjs-svgsprite/IconDynamic';

export default function MyComponent() {
  return <IconDynamic name="home" size={24} />;
}
```

## Advanced Features

### Preloading Sprites

Preload commonly used namespaces for better performance:

```tsx
import { preloadSprites } from '@/components/IconDynamic';

// In your root layout or component
useEffect(() => {
  // Preload commonly used namespaces
  preloadSprites(['default', 'social', 'brands']);
}, []);
```

### Version Management

The sprite version is automatically managed. When you update your icons and bump the version:

```tsx
import { getSpriteVersion } from '@/components/IconDynamic';

console.log('Current sprite version:', getSpriteVersion());
// Output: "1.0.0"
```

To update the version, edit `components/sprite-loader.ts`:

```ts
const SPRITE_VERSION = '1.1.0'; // Bump this when icons change
```

### Manual Cache Control

Clear all caches if needed:

```tsx
import { clearSpriteCache } from '@/components/IconDynamic';

// Clear all sprite caches
clearSpriteCache();
```

## How It Works

### Loading Flow

1. **Component Renders**: `IconDynamic` component is used in your app
2. **Parse Icon Name**: Extracts namespace from icon name (e.g., `social:facebook` → namespace: `social`)
3. **Check In-Memory Cache**: If sprite already loaded in memory, use it immediately
4. **Check Session Storage**: If found in session storage with matching version, load from there
5. **Fetch from Server**: If not cached, fetch from `/icons` or `/icons/{namespace}`
6. **Cache & Inject**: Store in both caches and inject SVG into DOM
7. **Render Icon**: Display the icon using SVG `<use>` element

### Caching Strategy

```
┌─────────────────────────────────────────┐
│         Icon Component Renders          │
└────────────────┬────────────────────────┘
                 │
                 ▼
┌─────────────────────────────────────────┐
│      Check In-Memory Cache              │
│      (fastest, runtime only)            │
└────────┬──────────────┬─────────────────┘
         │ Found        │ Not Found
         │              ▼
         │     ┌─────────────────────────┐
         │     │  Check Session Storage  │
         │     │  (persistent, versioned)│
         │     └────┬──────────┬─────────┘
         │          │ Found    │ Not Found
         │          │          ▼
         │          │   ┌─────────────────┐
         │          │   │  Fetch from     │
         │          │   │  Server         │
         │          │   └────┬────────────┘
         │          │        │
         │          ▼        ▼
         │     ┌─────────────────────────┐
         │     │  Store in Both Caches   │
         │     └────┬────────────────────┘
         │          │
         ▼          ▼
┌─────────────────────────────────────────┐
│     Inject SVG & Render Icon            │
└─────────────────────────────────────────┘
```

### Version Management

Version tracking ensures users get fresh icons when you update them:

```typescript
Session Storage Entry:
{
  "version": "1.0.0",
  "content": "<svg>...</svg>",
  "timestamp": 1699350000000
}

// When SPRITE_VERSION changes to "1.1.0":
// → Old cache is invalidated
// → Fresh sprite is fetched
// → New cache is created
```

## Comparison: Static vs Dynamic

### Static Icon Component (Original)

**Pros:**
- Simpler implementation
- Static routes are fast
- Pre-rendered at build time

**Cons:**
- Requires manual route setup (`app/icons/route.ts`)
- All routes must be configured
- Less flexible for dynamic scenarios

**Usage:**
```tsx
import Icon from '@/components/Icon';

// Requires app/icons/route.ts and app/icons/[namespace]/route.ts
<Icon name="home" size={24} />
```

### Dynamic Icon Component (New)

**Pros:**
- ✅ No route setup required
- ✅ Lazy loading per namespace
- ✅ Intelligent caching system
- ✅ Version management built-in
- ✅ Better for client-side apps
- ✅ Easier to use as open source package

**Cons:**
- Client-side only (`'use client'`)
- Initial render shows empty icon briefly
- Slightly more complex implementation

**Usage:**
```tsx
import IconDynamic from '@/components/IconDynamic';

// Just works - no setup needed!
<IconDynamic name="home" size={24} />
```

## Migration Guide

### For Existing Users

You can use both components side by side:

```tsx
// Keep using static Icon where it works
import Icon from '@/components/Icon';

// Use dynamic Icon where you need flexibility
import IconDynamic from '@/components/IconDynamic';

export default function MyComponent() {
  return (
    <>
      {/* Static - requires route setup */}
      <Icon name="home" size={24} />
      
      {/* Dynamic - no route setup needed */}
      <IconDynamic name="social:facebook" size={24} />
    </>
  );
}
```

### For New Projects

Just use `IconDynamic` from the start:

```tsx
import IconDynamic from 'nextjs-svgsprite/IconDynamic';

export default function App() {
  return <IconDynamic name="home" size={24} />;
}
```

## Performance Considerations

### Initial Load
- First icon from a namespace loads the entire namespace sprite
- Subsequent icons from the same namespace use cached sprite
- No performance impact after initial load

### Memory Usage
- Each namespace sprite is ~2-50KB depending on icon count
- Session storage has ~5-10MB limit (plenty for sprites)
- In-memory cache is cleared on page close

### Best Practices

1. **Group Related Icons**: Use namespaces to group related icons together
2. **Preload Common Namespaces**: Preload namespaces used on every page
3. **Monitor Cache Size**: Keep sprite files optimized and small
4. **Version Carefully**: Only bump version when icons actually change

## Troubleshooting

### Icons Not Showing

1. Check browser console for errors
2. Verify sprite files exist in `/public` directory
3. Check that routes `/icons` and `/icons/{namespace}` are accessible
4. Clear cache with `clearSpriteCache()`

### Cache Not Working

1. Check browser session storage is enabled
2. Verify version hasn't changed unexpectedly
3. Check for storage quota errors in console

### Performance Issues

1. Check if sprites are too large (optimize with SVGO)
2. Reduce number of namespaces if possible
3. Preload commonly used namespaces
4. Monitor network tab for duplicate requests

## API Reference

### IconDynamic Component

```tsx
interface IconDynamicProps {
  name: IconName;        // Icon name (required)
  size?: number;         // Icon size (default: 24)
  color?: string;        // Icon color (default: 'currentColor')
  className?: string;    // CSS classes
  style?: CSSProperties; // Inline styles
}
```

### IconDynamicWithLabel Component

```tsx
interface IconDynamicWithLabelProps {
  name: IconName;        // Icon name (required)
  label?: string;        // Accessible label
  size?: number;         // Icon size (default: 24)
  color?: string;        // Icon color (default: 'currentColor')
  className?: string;    // CSS classes
  style?: CSSProperties; // Inline styles
}
```

### Utility Functions

```tsx
// Load a specific namespace sprite
await loadSprite('social');

// Preload multiple namespaces
await preloadSprites(['default', 'social', 'brands']);

// Clear all caches
clearSpriteCache();

// Get current version
const version = getSpriteVersion();
```

## Future Enhancements

Potential improvements for future versions:

- [ ] Add loading indicators/placeholders
- [ ] Support custom cache strategies
- [ ] Add metrics and monitoring
- [ ] Support for IndexedDB for larger sprites
- [ ] Server-side rendering support with hydration
- [ ] Automatic version detection from build process

## Conclusion

The dynamic icon loading system provides a more flexible, easier-to-use approach to SVG sprites in Next.js applications. It eliminates manual setup while providing intelligent caching and lazy loading for optimal performance.

Choose **`Icon`** (static) when:
- You're using server components
- You need maximum performance with static routes
- You don't mind the route setup

Choose **`IconDynamic`** (dynamic) when:
- You want zero configuration
- You're building a client-heavy application
- You're publishing an open source package
- You need lazy loading and intelligent caching
- You want version management built-in
