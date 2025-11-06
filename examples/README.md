# TypeScript Examples

This directory contains comprehensive examples demonstrating type-safe icon usage with TypeScript.

## File Overview

### `typescript-example.tsx`

Contains 10 practical examples showing:

1. **Basic Usage** - Simple type-safe icon rendering
2. **Function Parameters** - Using `IconName` type in function signatures
3. **Type-Safe Data Structures** - Defining interfaces with icon names
4. **Conditional Rendering** - Dynamic icon selection with type safety
5. **Icon Gallery** - Iterating over all available icons
6. **Runtime Validation** - Type guards for external data
7. **Accessible Icons** - Using `IconWithLabel` component
8. **Custom Props** - Extending icon components with SVG props
9. **Reusable Components** - Building icon button components
10. **React Hooks** - State management with type-safe icons

## Running the Examples

These examples are meant to be referenced and copied into your own components. They demonstrate TypeScript patterns and best practices.

### Copy an Example

```bash
# Copy the example you want to use
cp examples/typescript-example.tsx app/components/
```

### Import in Your App

```tsx
import { IconGallery, IconSelector } from './components/typescript-example';

export default function Page() {
  return (
    <div>
      <IconGallery />
      <IconSelector />
    </div>
  );
}
```

## Key Concepts Demonstrated

### Type Safety

All examples show how TypeScript prevents invalid icon names at compile time:

```tsx
// ✅ Valid
<Icon name="home" />

// ❌ TypeScript Error
<Icon name="invalid" />
```

### Autocomplete

Your IDE will suggest available icon names as you type:

```tsx
<Icon name="..." />
//          ^ Autocomplete shows: home | user | settings | search
```

### Type Guards

Safely handle icon names from external sources:

```tsx
function isValidIconName(name: string): name is IconName {
  return iconNames.includes(name as IconName);
}
```

### Reusable Components

Build type-safe wrapper components:

```tsx
interface IconButtonProps {
  icon: IconName; // Only valid icons allowed
  label: string;
  onClick: () => void;
}
```

## Learn More

- [TYPESCRIPT.md](../TYPESCRIPT.md) - Complete TypeScript documentation
- [README.md](../README.md) - Main project documentation
- [components/Icon.tsx](../components/Icon.tsx) - Icon component source
- [components/icon-types.ts](../components/icon-types.ts) - Generated types

## Tips

1. **Use the examples as templates** - Copy and modify them for your use case
2. **Check for type errors** - Run `npx tsc --noEmit` to check for errors
3. **Regenerate types when adding icons** - Run `npm run build:sprite` after adding new SVG files
4. **Leverage autocomplete** - Let your IDE suggest icon names as you type
