/**
 * Next.js SVG Sprite Plugin
 *
 * A webpack-based Next.js plugin that automatically generates and manages SVG sprites.
 * This plugin provides seamless integration for SVG icon management in Next.js applications.
 *
 * Features:
 * - Automatic SVG sprite generation from source files
 * - Separate sprite files per namespace (folder-based organization)
 * - Hot reload support in development mode
 * - File watcher for automatic regeneration on changes
 * - Compatible with Next.js 15+ and Next.js 16+ (including Turbopack)
 * - Zero configuration required (sensible defaults)
 *
 * @module nextjs-svgsprite
 * @author Next.js SVG Sprite Plugin Team
 * @version 1.0.0
 *
 * @example Basic usage
 * ```javascript
 * // next.config.js
 * const withSvgSprite = require('./nextjs-svgsprite');
 *
 * const nextConfig = {
 *   // Your Next.js config
 * };
 *
 * module.exports = withSvgSprite()(nextConfig);
 * ```
 *
 * @example Custom configuration
 * ```javascript
 * // next.config.js
 * const withSvgSprite = require('./nextjs-svgsprite');
 *
 * module.exports = withSvgSprite({
 *   svgDir: 'svg-icons',
 *   outputPath: 'public/icons-sprite.svg',
 * })(nextConfig);
 * ```
 */

const path = require('path');
const { execSync } = require('child_process');
const fs = require('fs');

/**
 * Global flag to track watcher initialization
 * Ensures the file watcher is only set up once
 * @type {boolean}
 */
let watcherInitialized = false;

/**
 * Default plugin options
 * @type {Object}
 * @property {string} svgDir - Directory containing SVG source files
 * @property {string} outputPath - Output path for the generated sprite
 */
const DEFAULT_OPTIONS = {
  svgDir: 'svg-icons',
  outputPath: 'public/icons-sprite.svg',
};

/**
 * Create the SVG Sprite plugin wrapper
 *
 * This is the main plugin factory function. It returns a higher-order function
 * that wraps the Next.js configuration.
 *
 * @param {Object} pluginOptions - Plugin configuration options
 * @param {string} [pluginOptions.svgDir='svg-icons'] - Directory containing SVG files
 * @param {string} [pluginOptions.outputPath='public/icons-sprite.svg'] - Output path for the sprite
 * @returns {Function} Next.js config wrapper function
 *
 * @example
 * ```javascript
 * const withSvgSprite = require('./nextjs-svgsprite');
 *
 * // With default options
 * module.exports = withSvgSprite()(nextConfig);
 *
 * // With custom options
 * module.exports = withSvgSprite({
 *   svgDir: 'assets/icons',
 *   outputPath: 'public/sprite.svg',
 * })(nextConfig);
 * ```
 */
function withSvgSprite(pluginOptions = {}) {
  // Merge user options with defaults
  const options = { ...DEFAULT_OPTIONS, ...pluginOptions };

  /**
   * Next.js config wrapper
   *
   * This function wraps the Next.js configuration and adds sprite generation
   * functionality via webpack hooks.
   *
   * @param {Object} [nextConfig={}] - Next.js configuration object
   * @returns {Object} Modified Next.js configuration
   */
  return (nextConfig = {}) => {
    return {
      ...nextConfig,

      // Add empty turbopack config to support Next.js 16+
      // This ensures compatibility with the new Turbopack bundler
      turbopack: nextConfig.turbopack || {},

      /**
       * Custom webpack configuration
       *
       * Extends the Next.js webpack config to include sprite generation.
       * Runs the sprite build script during compilation and sets up file watching.
       *
       * @param {Object} config - Webpack configuration object
       * @param {Object} context - Next.js build context
       * @param {boolean} context.isServer - Whether this is a server build
       * @param {boolean} context.dev - Whether this is a development build
       * @returns {Object} Modified webpack configuration
       */
      webpack(config, context) {
        // Only run sprite generation in development mode on client builds
        // This prevents duplicate builds and unnecessary server-side processing
        if (!context.isServer && context.dev) {
          try {
            // Run the sprite build script
            console.log('🎨 Generating SVG sprites...');
            execSync('node scripts/build-sprite.js', {
              stdio: 'inherit',
              cwd: process.cwd(),
            });

            // Set up file watcher for svg-icons directory (only once)
            if (!watcherInitialized) {
              watcherInitialized = true;
              const svgDirPath = path.join(process.cwd(), options.svgDir);

              if (fs.existsSync(svgDirPath)) {
                console.log('👀 Watching svg-icons directory for changes...');

                // Watch recursively for file and folder changes
                fs.watch(svgDirPath, { recursive: true }, (eventType, filename) => {
                  if (filename) {
                    console.log(`\n🔄 SVG icons changed (${filename}), rebuilding sprites...`);
                    try {
                      execSync('node scripts/build-sprite.js', {
                        stdio: 'inherit',
                        cwd: process.cwd(),
                      });
                    } catch (error) {
                      console.error('❌ Error rebuilding sprites:', error.message);
                    }
                  }
                });
              } else {
                console.warn(`⚠️  SVG directory not found at: ${svgDirPath}`);
                console.warn(
                  '   Create the directory and add SVG files to enable sprite generation.',
                );
              }
            }
          } catch (error) {
            console.warn('⚠️  SVG sprite generation failed:', error.message);
            console.warn('   Run "npm run build:sprite" manually to generate sprites.');
          }
        }

        // Call the original webpack config function if it exists
        // This ensures compatibility with other plugins
        if (typeof nextConfig.webpack === 'function') {
          return nextConfig.webpack(config, context);
        }

        return config;
      },
    };
  };
}

// Export the plugin
module.exports = withSvgSprite;
