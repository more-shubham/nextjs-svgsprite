/** @type {import('next').NextConfig} */
const withSvgSprite = require('./nextjs-svgsprite');

const nextConfig = {
  // Your custom Next.js config here
};

// Wrap the config with the SVG sprite plugin
module.exports = withSvgSprite({
  svgDir: 'svg-icons',
  outputPath: 'public/icons-sprite.svg',
})(nextConfig);
