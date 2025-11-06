/**
 * Example: Using the Exported Icon Component
 * 
 * This example shows how to use the pre-built Icon component
 * when installing nextjs-svgsprite as an npm package
 */

// Import the Icon component from the package
import Icon from 'nextjs-svgsprite/Icon';
// Or import with TypeScript types
import { IconWithLabel, IconName, iconNames } from 'nextjs-svgsprite/Icon';

export default function ExportedUsageExample() {
  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold mb-6">
        Exported Icon Component Example
      </h1>

      {/* Basic Icons */}
      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-4">Basic Icons</h2>
        <div className="flex gap-4 items-center">
          <Icon name="home" size={24} />
          <Icon name="user" size={32} />
          <Icon name="settings" size={24} />
          <Icon name="search" size={20} />
          <Icon name="star" size={28} />
        </div>
      </section>

      {/* Icons with Colors */}
      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-4">Icons with Colors</h2>
        <div className="flex gap-4 items-center">
          <Icon name="home" size={24} color="blue" />
          <Icon name="user" size={32} color="#ef4444" />
          <Icon name="settings" size={24} color="green" />
          <Icon name="star" size={28} color="#fbbf24" />
        </div>
      </section>

      {/* Namespaced Icons */}
      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-4">Social Icons</h2>
        <div className="flex gap-4 items-center">
          <Icon name="social:facebook" size={32} color="#1877f2" />
          <Icon name="social:twitter" size={32} color="#1da1f2" />
        </div>
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-4">Brand Icons</h2>
        <div className="flex gap-4 items-center">
          <Icon name="brands:apple" size={32} />
          <Icon name="brands:google" size={32} />
        </div>
      </section>

      {/* Accessible Icons */}
      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-4">Accessible Icons</h2>
        <div className="flex gap-4 items-center">
          <IconWithLabel name="search" label="Search the site" size={24} />
          <IconWithLabel name="settings" label="Open settings" size={24} />
        </div>
      </section>

      {/* All Available Icons */}
      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-4">All Available Icons</h2>
        <p className="text-sm text-gray-600 mb-4">
          Total icons: {iconNames.length}
        </p>
        <div className="grid grid-cols-5 gap-4">
          {iconNames.map((iconName) => (
            <div 
              key={iconName} 
              className="flex flex-col items-center p-2 border rounded"
            >
              <Icon name={iconName as IconName} size={32} />
              <span className="text-xs mt-2 text-center">{iconName}</span>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}

/**
 * Setup Instructions:
 * 
 * 1. Install the package:
 *    npm install nextjs-svgsprite
 * 
 * 2. Create route handlers in your Next.js app:
 * 
 *    app/icons/route.ts:
 *    ```typescript
 *    export { GET, dynamic } from 'nextjs-svgsprite/icons/route';
 *    ```
 * 
 *    app/icons/[namespace]/route.ts:
 *    ```typescript
 *    export { GET, dynamic, generateStaticParams } from 'nextjs-svgsprite/icons/[namespace]/route';
 *    ```
 * 
 * 3. Use the Icon component:
 *    ```typescript
 *    import Icon from 'nextjs-svgsprite/Icon';
 *    
 *    <Icon name="home" size={24} />
 *    ```
 */
