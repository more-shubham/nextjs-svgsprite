# Project Structure

This document provides a detailed overview of the Next.js SVG Sprite plugin folder structure and explains the purpose of each file.

## Complete Folder Structure

```
nextjs-svgsprite/
├── app/                          # Next.js App Router directory
│   ├── icons/                    # Icons route handler
│   │   └── route.js              # Serves SVG sprite at /icons endpoint
│   ├── layout.jsx                # Root layout component
│   └── page.jsx                  # Example home page demonstrating Icon component
│
├── components/                   # Reusable React components
│   └── Icon.jsx                  # Main Icon component and IconWithLabel
│
├── scripts/                      # Build and utility scripts
│   └── build-sprite.js           # SVG sprite generation script
│
├── svg-icons/                    # Source SVG icon files
│   ├── home.svg                  # Example: Home icon
│   ├── user.svg                  # Example: User icon
│   ├── settings.svg              # Example: Settings icon
│   └── search.svg                # Example: Search icon
│
├── public/                       # Static assets
│   └── icons-sprite.svg          # Generated SVG sprite (gitignored by default)
│
├── .gitignore                    # Git ignore file
├── INTEGRATION.md                # Integration guide for existing projects
├── next.config.js                # Next.js configuration with plugin
├── nextjs-svgsprite.js           # Plugin implementation
├── package.json                  # NPM package configuration
├── README.md                     # Main documentation
├── STRUCTURE.md                  # This file
└── USAGE_EXAMPLES.md             # Detailed usage examples
```

## File Descriptions

### Core Plugin Files

#### `nextjs-svgsprite.js`

**Purpose**: Main plugin file that integrates with Next.js configuration

**Key Features**:

- Exports `withSvgSprite()` function that wraps Next.js config
- Triggers sprite generation during webpack compilation
- Accepts configuration options (svgDir, outputPath)
- Preserves existing Next.js webpack configuration

**Configuration Options**:

```javascript
{
  svgDir: 'svg-icons',              // Directory with SVG files
  outputPath: 'public/icons-sprite.svg',  // Output path for sprite
}
```

#### `scripts/build-sprite.js`

**Purpose**: Generates the SVG sprite from individual icon files

**Key Features**:

- Reads all `.svg` files from the configured directory
- Uses `svgstore` library to combine them into a single sprite
- Each icon becomes a `<symbol>` element with id matching filename
- Creates output directory if it doesn't exist
- Provides detailed console output during generation

**Usage**:

```bash
node scripts/build-sprite.js
npm run build:sprite
```

#### `app/icons/route.js`

**Purpose**: Next.js route handler that serves the sprite at `/icons`

**Key Features**:

- Returns the generated sprite with proper MIME type
- Sets aggressive caching headers for performance
- Handles missing sprite gracefully with empty SVG
- Uses `force-static` export for static optimization

**HTTP Headers**:

- `Content-Type: image/svg+xml`
- `Cache-Control: public, max-age=31536000, immutable`

#### `components/Icon.jsx`

**Purpose**: Reusable React component for displaying icons

**Exports**:

1. `Icon` - Basic icon component
2. `IconWithLabel` - Accessible icon with label

**Props**:

- `name` (required): Icon name matching SVG filename
- `size`: Width and height in pixels (default: 24)
- `color`: Icon color (default: 'currentColor')
- `className`: CSS classes
- `style`: Inline styles
- `label`: Accessible label (IconWithLabel only)

### Configuration Files

#### `next.config.js`

**Purpose**: Next.js configuration integrating the plugin

**Structure**:

```javascript
const withSvgSprite = require('./nextjs-svgsprite');

const nextConfig = {
  // Your Next.js config
};

module.exports = withSvgSprite({
  svgDir: 'svg-icons',
  outputPath: 'public/icons-sprite.svg',
})(nextConfig);
```

#### `package.json`

**Purpose**: NPM package configuration

**Key Scripts**:

- `dev`: Start development server
- `build:sprite`: Generate SVG sprite
- `build`: Build sprite then build Next.js app
- `start`: Start production server
- `lint`: Run Next.js linter

**Dependencies**:

- `next`: Next.js framework (^15.0.0)
- `react`: React library (^18.3.1)
- `react-dom`: React DOM (^18.3.1)

**Dev Dependencies**:

- `svgstore`: SVG sprite generator (^3.0.1)

#### `.gitignore`

**Purpose**: Specifies files Git should ignore

**Key Exclusions**:

- `node_modules/`: Dependencies
- `.next/`: Next.js build output
- `public/icons-sprite.svg`: Generated sprite (regenerated on build)
- IDE and OS specific files

### Example/Demo Files

#### `app/layout.jsx`

**Purpose**: Root layout for the Next.js application

**Features**:

- Sets HTML metadata (title, description)
- Wraps all pages with consistent layout
- Minimal implementation for maximum flexibility

#### `app/page.jsx`

**Purpose**: Example home page demonstrating Icon usage

**Demonstrates**:

- Basic icon usage
- Different sizes
- Custom colors
- Accessible icons with labels
- Link to view the sprite

### SVG Icon Files

#### `svg-icons/`

**Purpose**: Directory containing source SVG icon files

**Included Examples**:

- `home.svg`: House icon
- `user.svg`: User profile icon
- `settings.svg`: Settings/gear icon
- `search.svg`: Search/magnifying glass icon

**Guidelines for Adding Icons**:

1. Use simple, clean SVG files
2. Name files descriptively using kebab-case
3. Remove unnecessary attributes (id, class, etc.)
4. Use `currentColor` for fills/strokes when possible
5. Optimize SVGs before adding (use SVGO)

**Example SVG Structure**:

```xml
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
  <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/>
</svg>
```

### Documentation Files

#### `README.md`

**Purpose**: Main documentation and getting started guide

**Sections**:

- Features overview
- Quick start guide
- Folder structure
- Plugin configuration
- Icon component API
- Build scripts
- Integration instructions
- Troubleshooting

#### `INTEGRATION.md`

**Purpose**: Detailed integration guide for existing projects

**Sections**:

- Step-by-step integration
- TypeScript conversion examples
- Usage examples
- Configuration options
- Build integration
- CI/CD examples
- Migration from other icon libraries

#### `USAGE_EXAMPLES.md`

**Purpose**: Comprehensive usage examples and patterns

**Sections**:

- Basic usage examples
- Component examples (navigation, buttons, cards)
- Styling examples (CSS modules, Tailwind, inline)
- Advanced patterns (loading, badges, toggles)
- Real-world scenarios (search bar, profile, menus)
- Best practices and tips

#### `STRUCTURE.md`

**Purpose**: Documentation of project structure (this file)

## File Relationships

### Build Process Flow

```
1. svg-icons/*.svg
   ↓
2. scripts/build-sprite.js
   ↓
3. public/icons-sprite.svg
   ↓
4. app/icons/route.js → Serves at /icons
   ↓
5. components/Icon.jsx → References /icons#icon-name
```

### Component Usage Flow

```
1. User imports Icon component
   ↓
2. Icon component renders <svg> with <use href="/icons#name">
   ↓
3. Browser fetches /icons (once, cached)
   ↓
4. Browser displays the requested icon
```

### Build Time Flow

```
1. npm run build
   ↓
2. npm run build:sprite (generates sprite)
   ↓
3. next build (builds Next.js app)
   ↓
4. Output: .next/ and public/icons-sprite.svg
```

## Directory Purposes

### `/app`

- Contains Next.js App Router pages and routes
- `icons/route.js` is a special route handler (not a page)
- `layout.jsx` and `page.jsx` are example implementations

### `/components`

- Reusable React components
- `Icon.jsx` is the main export users will import
- Can be extended with additional icon-related components

### `/scripts`

- Build-time scripts
- `build-sprite.js` runs before the Next.js build
- Can be extended with additional build utilities

### `/svg-icons`

- Source of truth for all icons
- Add new SVG files here
- Files should be optimized and cleaned before adding

### `/public`

- Static assets served by Next.js
- `icons-sprite.svg` is generated, not committed
- Next.js serves this directory at the root path

## Customization Points

### Adding New Icons

1. Add SVG file to `svg-icons/`
2. Run `npm run build:sprite`
3. Use with `<Icon name="new-icon" />`

### Changing Icon Directory

1. Update `next.config.js`:
   ```javascript
   withSvgSprite({
     svgDir: 'assets/icons', // New directory
   })(nextConfig);
   ```
2. Move SVG files to new directory
3. Rebuild sprite

### Changing Output Path

1. Update `next.config.js`:
   ```javascript
   withSvgSprite({
     outputPath: 'public/my-sprite.svg', // New path
   })(nextConfig);
   ```
2. Update `app/icons/route.js` to read from new path
3. Update `Icon.jsx` to reference new route if needed

### Extending the Icon Component

```javascript
// components/Icon.jsx
export function AnimatedIcon({ name, ...props }) {
  return (
    <div className="animate-bounce">
      <Icon name={name} {...props} />
    </div>
  );
}

export function IconWithTooltip({ name, tooltip, ...props }) {
  return (
    <span title={tooltip}>
      <Icon name={name} {...props} />
    </span>
  );
}
```

## Best Practices

### File Organization

1. **Keep SVG files clean**: Remove unnecessary attributes
2. **Use semantic naming**: `arrow-right.svg` not `icon1.svg`
3. **Group related icons**: Use prefixes like `social-`, `ui-`, `brand-`
4. **Optimize before adding**: Use SVGO or similar tools

### Documentation

1. **Update README**: When adding major features
2. **Add examples**: For new usage patterns
3. **Comment complex code**: Especially in build scripts
4. **Keep structure docs current**: Update this file when changing structure

### Version Control

1. **Commit source files**: SVG files in `svg-icons/`
2. **Ignore generated files**: `public/icons-sprite.svg`
3. **Commit documentation**: All .md files
4. **Tag releases**: Use semantic versioning

## Deployment Considerations

### What to Deploy

**Required Files**:

- All source code files
- `svg-icons/` directory
- `package.json` and `package-lock.json`
- `next.config.js`
- Documentation files

**Generated During Build**:

- `public/icons-sprite.svg`
- `.next/` directory
- `node_modules/`

### Build Commands

**Development**:

```bash
npm install
npm run build:sprite
npm run dev
```

**Production**:

```bash
npm install
npm run build
npm start
```

### CI/CD

Ensure your CI/CD pipeline:

1. Installs dependencies: `npm ci`
2. Generates sprite: `npm run build:sprite`
3. Builds app: `npm run build`
4. Has access to `svg-icons/` directory

## Migration Path

### From Existing Project

1. Copy plugin files to your project
2. Update `next.config.js`
3. Add `build:sprite` script to `package.json`
4. Create `svg-icons/` directory
5. Add your SVG files
6. Generate sprite and test

### To TypeScript

1. Rename `.js` files to `.ts` or `.tsx`
2. Add type definitions
3. Update imports
4. Configure `tsconfig.json`

See [INTEGRATION.md](./INTEGRATION.md) for detailed instructions.

## Support and Maintenance

### Updating Dependencies

```bash
npm update next react react-dom
npm update svgstore
```

### Debugging

1. **Check sprite generation**: `npm run build:sprite`
2. **View generated sprite**: `cat public/icons-sprite.svg`
3. **Test route**: `curl http://localhost:3000/icons`
4. **Check console**: Browser developer tools

### Common Issues

See README.md "Troubleshooting" section for common issues and solutions.

## Conclusion

This structure provides a clean, maintainable organization for the SVG sprite plugin. Each file has a specific purpose, and the separation of concerns makes it easy to understand, extend, and maintain.

For usage instructions, see [README.md](./README.md) and [USAGE_EXAMPLES.md](./USAGE_EXAMPLES.md).
