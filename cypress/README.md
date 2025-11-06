# Cypress E2E Testing

This project includes comprehensive end-to-end (E2E) testing using Cypress to ensure all features work correctly.

## Test Coverage

### 1. Icon Component Tests (`icon-component.cy.ts`)

- **Basic Rendering**: Tests icon rendering with default props
- **Different Sizes**: Validates icons render correctly at 16px, 24px, 32px, and 48px
- **Custom Colors**: Tests custom color application (red, blue, green, purple, gold)
- **Error Handling**: Validates graceful handling of missing icon names

### 2. IconWithLabel Component Tests (`icon-with-label.cy.ts`)

- **Accessibility**: Tests role="img" and aria-label attributes
- **Screen Reader Support**: Validates meaningful labels for assistive technologies
- **Keyboard Navigation**: Ensures icons are keyboard accessible
- **Differentiation**: Tests distinction between basic and labeled icons

### 3. Namespaced Icons Tests (`namespaced-icons.cy.ts`)

- **Social Namespace**: Tests `social:facebook` and `social:twitter` icons
- **Brands Namespace**: Tests `brands:apple` and `brands:google` icons
- **Sprite Separation**: Validates icons load from correct sprite files
- **Display**: Tests namespace label rendering

### 4. Server Routes Tests (`server-routes.cy.ts`)

- **Default Route**: Tests `/icons` endpoint serving default sprite
- **Namespace Routes**: Tests `/icons/social` and `/icons/brands` endpoints
- **Content Validation**: Validates SVG content and symbol elements
- **Cache Headers**: Tests proper caching configuration
- **Error Handling**: Tests graceful handling of non-existent namespaces
- **SSG Integration**: Validates static generation and fast responses

### 5. Normalized Names Tests (`normalized-names.cy.ts`)

- **Kebab-case Normalization**: Tests sun-moon icon normalization
- **Consistency**: Validates all icon names use kebab-case format
- **Sprite Content**: Tests normalized names in sprite files
- **Documentation**: Validates normalization examples are shown

### 6. Next.js 16 Integration Tests (`nextjs-integration.cy.ts`)

- **Framework Features**: Tests Next.js 16 app router functionality
- **React 19 Compatibility**: Validates React 19 component rendering
- **TypeScript Support**: Tests TypeScript integration and type safety
- **Performance**: Validates fast loading and static generation
- **SSG/SSR**: Tests static site generation features

### 7. Full Integration Tests (`integration.cy.js`) - JavaScript Version

- **Complete Flow**: Tests full application workflow
- **JavaScript Compatibility**: Ensures tests work with plain JavaScript
- **Cross-browser Support**: Tests SVG rendering across browsers
- **Performance**: Validates loading and caching
- **Accessibility**: Tests semantic HTML and keyboard navigation

## Running Tests

### Interactive Mode (Development)

```bash
# Start dev server and open Cypress
npm run test:e2e:dev
```

### Headless Mode (CI/CD)

```bash
# Build and test production build
npm run build
npm run test:e2e
```

### Manual Control

```bash
# Start the application
npm run dev  # or npm start for production

# In another terminal, run Cypress
npm run cypress              # Interactive mode
npm run cypress:headless     # Headless mode
```

## Test Structure

```
cypress/
├── e2e/                          # Test files
│   ├── icon-component.cy.ts     # Icon component tests (TypeScript)
│   ├── icon-with-label.cy.ts    # IconWithLabel tests (TypeScript)
│   ├── namespaced-icons.cy.ts   # Namespaced icons tests (TypeScript)
│   ├── server-routes.cy.ts      # Server routes tests (TypeScript)
│   ├── normalized-names.cy.ts   # Normalized names tests (TypeScript)
│   ├── nextjs-integration.cy.ts # Next.js 16 tests (TypeScript)
│   └── integration.cy.js        # Full integration tests (JavaScript)
├── fixtures/                     # Test data
├── support/                      # Support files
│   ├── commands.ts              # Custom commands
│   └── e2e.ts                   # Setup file
└── tsconfig.json                # TypeScript config for Cypress
```

## Custom Commands

### `cy.checkIconRendered(iconName, size)`

Checks if an SVG icon is rendered correctly with the specified name and size.

**Example:**

```typescript
cy.checkIconRendered('home', 24);
```

### `cy.verifySpriteRoute(route)`

Verifies a sprite route returns valid SVG content with proper headers.

**Example:**

```typescript
cy.verifySpriteRoute('/icons/social');
```

## Technology Stack

- **Cypress**: ^15.6.0 - E2E testing framework
- **TypeScript**: ^5.9.3 - Type-safe test development
- **Next.js**: ^16.0.1 - Framework being tested
- **React**: ^19.2.0 - UI library being tested
- **start-server-and-test**: Utility for running tests against a server

## Test Philosophy

1. **Comprehensive Coverage**: Tests cover all components, routes, and features
2. **TypeScript & JavaScript**: Both TS and JS test files ensure broad compatibility
3. **Accessibility First**: Extensive testing of ARIA attributes and screen reader support
4. **Real User Scenarios**: Tests simulate actual user interactions
5. **Performance Aware**: Tests validate loading times and caching
6. **Framework Integration**: Tests verify Next.js 16 and React 19 features

## CI/CD Integration

The tests are designed to run in CI/CD pipelines:

```bash
# Example CI workflow
npm ci                    # Install dependencies
npm run build:sprite      # Build sprites
npm run build            # Build application
npm run test:e2e         # Run E2E tests
```

## Troubleshooting

### Tests Fail to Start

- Ensure the server is running on port 3000
- Check that sprites are built: `npm run build:sprite`

### Video/Screenshot Issues

- Videos and screenshots are stored in `cypress/videos/` and `cypress/screenshots/`
- These folders are gitignored

### TypeScript Errors

- Ensure `cypress/tsconfig.json` is present
- Check that type definitions are installed

## Future Enhancements

- [ ] Add visual regression testing
- [ ] Add component testing with Cypress Component Testing
- [ ] Add performance benchmarks
- [ ] Add mobile viewport tests
- [ ] Add dark mode testing

## Contributing

When adding new features:

1. Write tests first (TDD approach)
2. Ensure tests cover both TypeScript and JavaScript scenarios
3. Test accessibility features
4. Verify framework integration
5. Update this README with new test descriptions
