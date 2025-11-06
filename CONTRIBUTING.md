# Contributing to Next.js SVG Sprite Plugin

Thank you for your interest in contributing to this project! This guide will help you understand our development process and coding standards.

## Table of Contents

- [Code of Conduct](#code-of-conduct)
- [Getting Started](#getting-started)
- [Development Workflow](#development-workflow)
- [Coding Standards](#coding-standards)
- [Commit Guidelines](#commit-guidelines)
- [Pull Request Process](#pull-request-process)

## Code of Conduct

This project follows a professional code of conduct. Be respectful, collaborative, and constructive in all interactions.

## Getting Started

### Prerequisites

- Node.js 18.x or higher
- npm 9.x or higher
- Git

### Setup

1. Fork and clone the repository:

```bash
git clone https://github.com/your-username/nextjs-svgsprite.git
cd nextjs-svgsprite
```

2. Install dependencies:

```bash
npm install
```

3. Build the sprite:

```bash
npm run build:sprite
```

4. Start the development server:

```bash
npm run dev
```

## Development Workflow

### Before Making Changes

1. **Create a new branch** from `main`:

```bash
git checkout -b feature/your-feature-name
```

2. **Run validation** to ensure everything works:

```bash
npm run validate
```

### During Development

1. **Write clean, documented code** following our coding standards
2. **Test your changes** thoroughly
3. **Run linting and formatting**:

```bash
npm run format
npm run lint:fix
```

4. **Check TypeScript types**:

```bash
npm run type-check
```

### Before Committing

Always run the validation script:

```bash
npm run validate
```

This runs:

- TypeScript type checking
- ESLint linting
- Prettier formatting check

## Coding Standards

### General Principles

1. **DRY (Don't Repeat Yourself)**: Extract reusable code into utility functions
2. **KISS (Keep It Simple, Stupid)**: Write simple, readable code
3. **SOLID Principles**: Follow object-oriented design principles
4. **Self-Documenting Code**: Use clear variable and function names

### File Organization

```
nextjs-svgsprite/
├── app/                    # Next.js app directory
│   ├── icons/             # API routes for serving sprites
│   ├── layout.tsx         # Root layout
│   └── page.tsx           # Example/demo page
├── components/            # React components
├── lib/                   # Core library code
│   ├── config.ts         # Configuration constants
│   ├── utils.ts          # Utility functions
│   └── Icon.tsx          # Icon component
├── scripts/              # Build scripts
├── svg-icons/            # Source SVG files
└── public/               # Generated sprites (gitignored)
```

### TypeScript Guidelines

1. **Use explicit types** for function parameters and return values
2. **Avoid `any` type** - use proper types or `unknown`
3. **Use interfaces** for object shapes
4. **Document types** with JSDoc comments

Example:

```typescript
/**
 * Normalize icon name to kebab-case
 * @param name - The original icon name
 * @returns The normalized kebab-case name
 */
export function normalizeIconName(name: string): string {
  // Implementation
}
```

### Naming Conventions

- **Files**: Use kebab-case (e.g., `build-sprite.js`, `icon-types.ts`)
- **Components**: Use PascalCase (e.g., `Icon.tsx`, `IconWithLabel`)
- **Functions**: Use camelCase (e.g., `normalizeIconName`, `buildSprite`)
- **Constants**: Use UPPER_SNAKE_CASE (e.g., `DEFAULT_SVG_DIR`)
- **Types/Interfaces**: Use PascalCase (e.g., `IconProps`, `IconName`)

### Code Style

We use Prettier for code formatting and ESLint for code quality. Configuration:

- **Indentation**: 2 spaces
- **Quotes**: Single quotes for JavaScript/TypeScript, double quotes for JSX
- **Semicolons**: Always
- **Line Length**: 100 characters max
- **Trailing Commas**: Always in multiline

### Documentation

1. **JSDoc comments** for all public functions and components
2. **Inline comments** for complex logic (sparingly)
3. **README updates** for new features
4. **Type documentation** for exported types

Example JSDoc:

```typescript
/**
 * Parse a namespaced icon name into its components
 *
 * @param name - Icon name (e.g., "home" or "social:facebook")
 * @returns Object with namespace and iconName
 * @throws {Error} If name is invalid
 *
 * @example
 * parseIconName('home') // { namespace: 'default', iconName: 'home' }
 * parseIconName('social:facebook') // { namespace: 'social', iconName: 'facebook' }
 */
```

### Error Handling

1. **Validate inputs** at function boundaries
2. **Throw meaningful errors** with descriptive messages
3. **Handle errors gracefully** in user-facing code
4. **Log errors** for debugging

Example:

```typescript
if (!name || typeof name !== 'string') {
  throw new Error('Icon name must be a non-empty string');
}
```

### Security

1. **Sanitize file paths** to prevent directory traversal
2. **Validate inputs** to prevent injection attacks
3. **Use secure dependencies** - run `npm audit` regularly
4. **Don't commit secrets** - use environment variables

## Commit Guidelines

We follow [Conventional Commits](https://www.conventionalcommits.org/):

### Commit Message Format

```
<type>(<scope>): <subject>

<body>

<footer>
```

### Types

- **feat**: New feature
- **fix**: Bug fix
- **docs**: Documentation changes
- **style**: Code style changes (formatting, no logic change)
- **refactor**: Code refactoring
- **perf**: Performance improvements
- **test**: Adding or updating tests
- **chore**: Maintenance tasks

### Examples

```bash
feat(icon): add IconWithLabel component for accessibility

docs(readme): update installation instructions

fix(build): handle missing svg-icons directory gracefully

refactor(utils): extract normalization logic to separate module
```

## Pull Request Process

### Before Submitting

1. **Update documentation** if needed
2. **Run all checks**:

```bash
npm run validate
npm run build:sprite
npm run build
```

3. **Test your changes** manually
4. **Update CHANGELOG.md** if applicable

### PR Title

Use the same format as commit messages:

```
feat(component): add new feature
```

### PR Description

Include:

- **What**: What changes were made
- **Why**: Why these changes were needed
- **How**: How the changes work
- **Testing**: How you tested the changes

### Review Process

1. At least one maintainer approval required
2. All CI checks must pass
3. Code must follow our standards
4. Documentation must be updated

## Questions?

If you have questions, please:

1. Check existing issues and discussions
2. Read the documentation thoroughly
3. Open a new issue with the "question" label

Thank you for contributing! 🎉
