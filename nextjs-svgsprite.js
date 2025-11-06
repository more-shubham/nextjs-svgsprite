/**
 * Next.js SVG Sprite Plugin
 * 
 * This plugin automatically:
 * - Generates an SVG sprite from all .svg files in /svg-icons
 * - Adds a /icons route to serve the sprite
 * - Provides configuration for the sprite generation
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
      webpack(config, context) {
        // Run the sprite build script during webpack compilation
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
      
      // Store options for use by other parts of the app
      svgSpriteOptions: options,
    };
  };
}

module.exports = withSvgSprite;
