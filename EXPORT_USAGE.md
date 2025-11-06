# Using Exported Icon Component

This guide shows how to use the pre-built Icon component exported from the `nextjs-svgsprite` package.

## Installation

```bash
npm install nextjs-svgsprite
```

## Setup

### Step 1: Copy Route Handlers

Copy the route handlers to your Next.js app to serve the bundled sprites:

**app/icons/route.ts:**

```typescript
export { GET, dynamic } from 'nextjs-svgsprite/icons/route';
```

**app/icons/[namespace]/route.ts:**

```typescript
export { GET, dynamic, generateStaticParams } from 'nextjs-svgsprite/icons/[namespace]/route';
```

That's it! The routes will serve the pre-built sprites included with the package.

### Step 2: Use the Icon Component

Import and use the Icon component directly from the package:

```tsx
import Icon from 'nextjs-svgsprite/Icon';

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

## Available Icons

The package includes the following pre-built icons:

### Default Icons

- `home` - Home icon
- `user` - User profile icon
- `settings` - Settings/gear icon
- `search` - Search/magnifying glass icon
- `star` - Star icon
- `sun-moon` - Theme toggle icon

### Social Icons (namespace: social)

- `social:facebook` - Facebook logo
- `social:twitter` - Twitter logo

### Brand Icons (namespace: brands)

- `brands:apple` - Apple logo
- `brands:google` - Google logo

## Usage Examples

### Basic Icon

```tsx
<Icon name="home" size={24} />
```

### Icon with Color

```tsx
<Icon name="star" size={32} color="#fbbf24" />
```

### Icon with Custom Styling

```tsx
<Icon name="user" size={24} className="text-blue-500 hover:text-blue-700" />
```

### Namespaced Icons

```tsx
<Icon name="social:facebook" size={24} />
<Icon name="brands:apple" size={32} />
```

### Accessible Icon with Label

```tsx
import { IconWithLabel } from 'nextjs-svgsprite/Icon';

<IconWithLabel name="search" label="Search the site" size={24} />;
```

## TypeScript Support

The package includes full TypeScript support with autocomplete for icon names:

```tsx
import Icon, { IconName } from 'nextjs-svgsprite/Icon';

// TypeScript will validate the icon name
<Icon name="home" size={24} />  // ✅ Valid

// TypeScript will show an error for invalid names
<Icon name="invalid" size={24} />  // ❌ Type error

// Get all available icon names
import { iconNames } from 'nextjs-svgsprite/Icon';
console.log(iconNames); // ['home', 'user', 'settings', ...]
```

## Props

### Icon Component

| Prop        | Type            | Default          | Description                 |
| ----------- | --------------- | ---------------- | --------------------------- |
| `name`      | `IconName`      | required         | Name of the icon to display |
| `size`      | `number`        | `24`             | Size of the icon in pixels  |
| `color`     | `string`        | `"currentColor"` | Color of the icon           |
| `className` | `string`        | `""`             | Additional CSS classes      |
| `style`     | `CSSProperties` | `{}`             | Inline styles               |

### IconWithLabel Component

Same as Icon, plus:

| Prop    | Type     | Default | Description                         |
| ------- | -------- | ------- | ----------------------------------- |
| `label` | `string` | `name`  | Accessible label for screen readers |

## Advanced Usage

### Dynamic Icon Selection

```tsx
const icons = ['home', 'user', 'settings'] as const;

{
  icons.map((iconName) => <Icon key={iconName} name={iconName} size={24} />);
}
```

### Custom Styling with CSS

```css
.my-icon {
  color: blue;
  transition: color 0.3s;
}

.my-icon:hover {
  color: red;
}
```

```tsx
<Icon name="home" size={24} className="my-icon" />
```

### Inline Styles

```tsx
<Icon
  name="user"
  size={24}
  style={{
    marginRight: '8px',
    verticalAlign: 'middle',
  }}
/>
```

## Benefits

✅ **Zero Configuration** - No need to manage your own SVG files
✅ **Pre-built Icons** - All icons included and ready to use
✅ **TypeScript Support** - Full type safety with autocomplete
✅ **Optimized Performance** - Sprite-based approach for minimal HTTP requests
✅ **Namespace Support** - Organized icon sets (social, brands, etc.)
✅ **Accessible** - Includes IconWithLabel for screen reader support

## Notes

- Icons are served as SVG sprites for optimal performance
- All sprites are statically generated and cached
- The Icon component uses `<use>` elements to reference sprites
- Icons inherit the current text color by default (can be overridden with `color` prop)
