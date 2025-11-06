# Cypress E2E Testing Documentation

## Overview

This project now includes comprehensive end-to-end (E2E) testing using **Cypress** to ensure all components, routes, and features work correctly across the Next.js 16 framework with React 19.

## ✨ Features

- ✅ **Full Icon Component Coverage** - Tests basic Icon and IconWithLabel components
- ✅ **Server Route Testing** - Tests `/icons`, `/icons/social`, and `/icons/brands` endpoints
- ✅ **Namespace Support** - Tests namespaced icons (social:, brands:)
- ✅ **Accessibility Testing** - Comprehensive ARIA and screen reader support tests
- ✅ **Next.js 16 Integration** - Tests framework-specific features and SSG
- ✅ **React 19 Compatibility** - Validates React 19 component rendering
- ✅ **TypeScript & JavaScript** - Tests support both TS and JS
- ✅ **Normalization Testing** - Tests kebab-case icon name normalization
- ✅ **Performance Testing** - Validates loading times and caching

## 📦 Installation

Cypress and related dependencies are already installed. To verify:

```bash
npm install
```

## 🚀 Running Tests

### Quick Start - Interactive Mode

```bash
# Start dev server and open Cypress UI
npm run test:e2e:dev
```

This command:
1. Starts the Next.js development server on `http://localhost:3000`
2. Opens the Cypress Test Runner
3. Allows you to select and run tests interactively

### Headless Mode (CI/CD)

```bash
# Build production and run all tests headlessly
npm run build
npm run test:e2e
```

### Manual Control

```bash
# Terminal 1: Start the application
npm run dev

# Terminal 2: Run Cypress
npm run cypress              # Opens Cypress UI
npm run cypress:headless     # Runs tests in headless mode
```

## 📁 Test Structure

```
cypress/
├── e2e/                              # E2E test files
│   ├── icon-component.cy.ts         # Icon component tests (TypeScript)
│   ├── icon-with-label.cy.ts        # IconWithLabel tests (TypeScript)
│   ├── namespaced-icons.cy.ts       # Namespaced icons tests (TypeScript)
│   ├── server-routes.cy.ts          # Server routes tests (TypeScript)
│   ├── normalized-names.cy.ts       # Normalized names tests (TypeScript)
│   ├── nextjs-integration.cy.ts     # Next.js 16 integration tests (TypeScript)
│   └── integration.cy.js            # Full integration tests (JavaScript)
├── fixtures/                         # Test data (optional)
├── support/
│   ├── commands.ts                  # Custom Cypress commands
│   └── e2e.ts                       # Global setup
├── tsconfig.json                    # TypeScript config for Cypress
└── README.md                        # This file
```

## 🧪 Test Coverage

### 1. **Icon Component Tests** (`icon-component.cy.ts`)
Tests the basic Icon component functionality:
- ✅ Basic rendering with default props
- ✅ Different sizes (16px, 24px, 32px, 48px)
- ✅ Custom colors (red, blue, green, purple, gold)
- ✅ Correct href attributes
- ✅ aria-hidden attribute
- ✅ Error handling for missing icons

### 2. **IconWithLabel Component Tests** (`icon-with-label.cy.ts`)
Tests accessibility features:
- ✅ `role="img"` attribute
- ✅ `aria-label` attributes
- ✅ Screen reader support
- ✅ Keyboard accessibility
- ✅ Distinction from basic Icon component

### 3. **Namespaced Icons Tests** (`namespaced-icons.cy.ts`)
Tests namespace organization:
- ✅ Social namespace (`social:facebook`, `social:twitter`)
- ✅ Brands namespace (`brands:apple`, `brands:google`)
- ✅ Sprite separation (different files for different namespaces)
- ✅ Correct sprite URLs for each namespace
- ✅ No cross-contamination between namespaces

### 4. **Server Routes Tests** (`server-routes.cy.ts`)
Tests API route handlers:
- ✅ Default sprite route (`/icons`)
- ✅ Namespace routes (`/icons/social`, `/icons/brands`)
- ✅ Valid SVG content
- ✅ Correct Content-Type headers
- ✅ Cache-Control headers
- ✅ Symbol elements and IDs
- ✅ Static generation (SSG)
- ✅ Error handling for non-existent namespaces
- ✅ Integration with frontend components

### 5. **Normalized Names Tests** (`normalized-names.cy.ts`)
Tests icon name normalization:
- ✅ Kebab-case normalization (`sun-moon`)
- ✅ Consistency across all icons
- ✅ Sprite content uses normalized names
- ✅ Documentation of normalization

### 6. **Next.js 16 Integration Tests** (`nextjs-integration.cy.ts`)
Tests framework features:
- ✅ Next.js 16 app router
- ✅ Static Site Generation (SSG)
- ✅ Route handlers
- ✅ Dynamic routes (`[namespace]`)
- ✅ React 19 component rendering
- ✅ TypeScript type safety
- ✅ Performance and loading times
- ✅ Client-side navigation

### 7. **Full Integration Tests** (`integration.cy.js`)
JavaScript version testing complete application flow:
- ✅ Complete application workflow
- ✅ JavaScript compatibility
- ✅ Cross-browser support
- ✅ Performance and caching
- ✅ Visual verification
- ✅ Error handling
- ✅ Accessibility features

## 🛠 Custom Cypress Commands

### `cy.checkIconRendered(iconName, size)`
Verifies an SVG icon is rendered correctly.

**Parameters:**
- `iconName` (string): The name of the icon (e.g., "home")
- `size` (number, optional): Expected size in pixels (default: 24)

**Example:**
```typescript
cy.checkIconRendered('home', 24);
```

### `cy.verifySpriteRoute(route)`
Verifies a sprite route returns valid SVG content.

**Parameters:**
- `route` (string): The route to verify (e.g., "/icons/social")

**Example:**
```typescript
cy.verifySpriteRoute('/icons/social');
```

## 📊 Test Results

When you run the tests, you'll see output like:

```
  Icon Component - Basic Rendering
    ✓ should render basic icons on the homepage (245ms)
    ✓ should render icons with correct href attributes (123ms)
    ✓ should render icons with default size of 24px (98ms)
    ✓ should render icons with correct fill color (105ms)
    ✓ should render icons with aria-hidden attribute (87ms)

  Server Routes - Default Sprite Route
    ✓ should serve the default sprite at /icons (45ms)
    ✓ should return valid SVG content (32ms)
    ✓ should contain symbol elements for icons (38ms)
    ...
```

## 🔧 Configuration

### Cypress Configuration (`cypress.config.ts`)

```typescript
import { defineConfig } from 'cypress';

export default defineConfig({
  e2e: {
    baseUrl: 'http://localhost:3000',
    specPattern: 'cypress/e2e/**/*.{cy,spec}.{js,jsx,ts,tsx}',
    supportFile: 'cypress/support/e2e.ts',
    video: false, // Disabled for faster runs
  },
});
```

### TypeScript Support

Cypress tests are written in TypeScript and have full type checking:

```typescript
/// <reference types="cypress" />

describe('My Test', () => {
  it('works', () => {
    cy.visit('/');
    // TypeScript autocomplete works here!
  });
});
```

## 🔍 Debugging Tests

### Visual Debugging

```bash
npm run cypress
```

This opens the Cypress Test Runner where you can:
- See tests run in real-time
- Inspect elements
- View screenshots
- Time-travel through test steps

### Headless Debugging

```bash
# Run specific test file
npx cypress run --spec "cypress/e2e/icon-component.cy.ts"

# Run with video recording
npx cypress run --video
```

## 📝 Writing New Tests

### Example Test File

Create a new file in `cypress/e2e/`:

```typescript
/// <reference types="cypress" />

describe('My New Feature', () => {
  beforeEach(() => {
    cy.visit('/');
  });

  it('should work correctly', () => {
    // Your test code here
    cy.get('[data-testid="my-element"]').should('be.visible');
  });
});
```

### Best Practices

1. **Use data-testid attributes** for stable selectors
2. **Group related tests** in describe blocks
3. **Use beforeEach** for common setup
4. **Write descriptive test names** (should...)
5. **Test user behavior**, not implementation
6. **Keep tests independent** - don't rely on test order

## 🚨 Troubleshooting

### Tests Fail to Start

**Problem:** Server not running or wrong port

**Solution:**
```bash
# Make sure the dev server is running
npm run dev

# Or use the combined command
npm run test:e2e:dev
```

### Timeouts

**Problem:** Tests timeout waiting for elements

**Solution:** Increase timeout in `cypress.config.ts`:

```typescript
e2e: {
  defaultCommandTimeout: 10000, // 10 seconds
}
```

### TypeScript Errors

**Problem:** Type errors in test files

**Solution:** Make sure `cypress/tsconfig.json` exists and includes:

```json
{
  "compilerOptions": {
    "types": ["cypress", "node"]
  }
}
```

### Sprite Not Found

**Problem:** Tests fail because sprites don't exist

**Solution:**
```bash
# Build sprites first
npm run build:sprite

# Then run tests
npm run test:e2e
```

## 📦 CI/CD Integration

### GitHub Actions Example

```yaml
name: E2E Tests

on: [push, pull_request]

jobs:
  cypress:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: '20'
      
      - name: Install dependencies
        run: npm ci
      
      - name: Build sprites
        run: npm run build:sprite
      
      - name: Build application
        run: npm run build
      
      - name: Run E2E tests
        run: npm run test:e2e
      
      - uses: actions/upload-artifact@v3
        if: failure()
        with:
          name: cypress-screenshots
          path: cypress/screenshots
```

## 📈 Test Statistics

- **Total Test Files:** 7
- **Test Coverage Areas:** 7
- **Total Test Cases:** 80+
- **Languages:** TypeScript (6 files) + JavaScript (1 file)
- **Frameworks Tested:** Next.js 16, React 19

## 🎯 Next Steps

- [ ] Add visual regression testing
- [ ] Add component testing with Cypress Component Testing
- [ ] Add performance benchmarks
- [ ] Add mobile viewport tests
- [ ] Add dark mode testing
- [ ] Integrate with CI/CD pipeline

## 📚 Resources

- [Cypress Documentation](https://docs.cypress.io/)
- [Cypress Best Practices](https://docs.cypress.io/guides/references/best-practices)
- [Next.js Testing](https://nextjs.org/docs/testing)
- [TypeScript with Cypress](https://docs.cypress.io/guides/tooling/typescript-support)

## 🤝 Contributing

When adding new features to the project:

1. **Write tests first** (TDD approach)
2. Ensure tests cover both **TypeScript and JavaScript**
3. Test **accessibility features** (ARIA, screen readers)
4. Verify **framework integration** (Next.js, React)
5. Update this README with new test descriptions

---

**Happy Testing! 🎉**
