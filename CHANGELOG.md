# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Added

- Comprehensive ESLint configuration with recommended rules for code quality
- Prettier configuration for consistent code formatting across the project
- EditorConfig file for consistent editor settings
- Centralized configuration constants in `lib/config.ts`
- Utility functions module in `lib/utils.ts` with input validation and sanitization
- Comprehensive JSDoc documentation for all functions and components
- Code quality scripts: `format`, `format:check`, `type-check`, `validate`
- CONTRIBUTING.md with detailed coding standards and contribution guidelines
- CODE_OF_CONDUCT.md for community standards
- SECURITY.md with security policies and best practices
- Enhanced error handling with detailed error messages
- Input validation for icon names and file paths
- Security improvements: path traversal prevention, input sanitization

### Changed

- Improved .gitignore to exclude more build artifacts and temporary files
- Enhanced build scripts with better documentation and error handling
- Improved Icon component with comprehensive JSDoc comments
- Enhanced route handlers with detailed documentation
- Updated plugin file with extensive documentation
- Formatted all code files with Prettier for consistency
- Improved TypeScript type coverage

### Fixed

- Fixed tsconfig.json to properly exclude cypress files
- Fixed package.json syntax (removed trailing comma)

## [1.0.0] - Previous Release

### Added

- Initial release of Next.js SVG Sprite Plugin
- Automatic SVG sprite generation from individual icon files
- Namespace support for organizing icons in folders
- TypeScript support with auto-generated type definitions
- Icon component with accessibility support (IconWithLabel)
- Static routes for serving sprite files with caching
- Hot reload support in development mode
- File watcher for automatic sprite regeneration
- Comprehensive documentation and examples
- Cypress E2E tests for all features
- Support for Next.js 15+ and Next.js 16 (Turbopack)

### Features

- Type-safe icon names with IDE autocomplete
- Automatic name normalization to kebab-case
- Duplicate icon detection and reporting
- Separate sprite files per namespace
- Performance optimization with long-term caching
- Zero configuration with sensible defaults

[Unreleased]: https://github.com/more-shubham/nextjs-svgsprite/compare/v1.0.0...HEAD
[1.0.0]: https://github.com/more-shubham/nextjs-svgsprite/releases/tag/v1.0.0
