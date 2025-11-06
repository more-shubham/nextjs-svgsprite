/**
 * Next.js SVG Sprite Plugin
 * 
 * This plugin automatically:
 * - Generates SVG sprites from all .svg files in /svg-icons
 * - Separate sprite files per namespace (folder)
 * - Adds /icons routes to serve the sprites
 * - Provides configuration for the sprite generation
 * - Watches for file and folder changes in dev mode
 * 
 * Compatible with Next.js 15+ (including Turbopack in Next.js 16+)
 */

const path = require('path');
const { execSync } = require('child_process');
const fs = require('fs');

let watcherInitialized = false;

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
              }
            }
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
