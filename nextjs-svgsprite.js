/**
 * Next.js SVG Sprite Plugin
 * 
 * This plugin automatically:
 * - Generates an SVG sprite from all .svg files in /svg-icons
 * - Adds a /icons route to serve the sprite
 * - Provides configuration for the sprite generation
 * 
 * Compatible with Next.js 15+ (including Turbopack in Next.js 16+)
 */

const path = require('path');
const { execSync } = require('child_process');

/**
 * @param {Object} pluginOptions - Plugin configuration options
 * @param {string} pluginOptions.svgDir - Directory containing SVG files (default: 'svg-icons')
 * @param {string} pluginOptions.outputPath - Output path for the sprite (default: 'public/icons-sprite.svg')
 * @returns {Function} Next.js config wrapper
 */
function withSvgSprite(pluginOptions = {}) {
  const defaultOptions = {
    svgDir: 'svg-icons',
    outputPath: 'public/icons-sprite.svg',
  };

  const options = { ...defaultOptions, ...pluginOptions };

  return (nextConfig = {}) => {
    return {
      ...nextConfig,
      
      // Add empty turbopack config to support Next.js 16+
      turbopack: nextConfig.turbopack || {},
      
      webpack(config, context) {
        // Run the sprite build script during webpack compilation (Next.js 15 and webpack mode)
        if (!context.isServer && context.dev) {
          try {
            execSync('node scripts/build-sprite.js', {
              stdio: 'inherit',
              cwd: process.cwd(),
            });
          } catch (error) {
            console.warn('SVG sprite generation failed:', error.message);
          }
        }

        // Call the original webpack config if it exists
        if (typeof nextConfig.webpack === 'function') {
          return nextConfig.webpack(config, context);
        }

        return config;
      },
    };
  };
}

module.exports = withSvgSprite;
