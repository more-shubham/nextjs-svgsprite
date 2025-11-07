'use client';

import IconDynamic, { IconDynamicWithLabel } from '@/components/IconDynamic';
import { useEffect } from 'react';
import { preloadSprites, getSpriteVersion, clearSpriteCache } from '@/components/IconDynamic';

export default function DynamicIconsPage() {
  // Preload common namespaces on mount
  useEffect(() => {
    preloadSprites(['social', 'brands']);
  }, []);

  return (
    <div style={{ padding: '2rem', fontFamily: 'system-ui, sans-serif' }}>
      <h1>Dynamic Icon Loading Example</h1>
      <p style={{ color: '#666', marginBottom: '1rem' }}>
        Version: {getSpriteVersion()}
      </p>

      <section style={{ marginTop: '2rem' }}>
        <h2>Default Namespace Icons (Lazy Loaded)</h2>
        <div style={{ display: 'flex', gap: '1rem', alignItems: 'center', marginTop: '1rem' }}>
          <IconDynamic name="home" size={24} />
          <IconDynamic name="user" size={24} />
          <IconDynamic name="settings" size={24} />
          <IconDynamic name="search" size={24} />
          <IconDynamic name="star" size={24} />
        </div>
        <p style={{ fontSize: '0.875rem', color: '#666', marginTop: '0.5rem' }}>
          ✓ Default namespace loaded on first icon render
        </p>
      </section>

      <section style={{ marginTop: '2rem' }}>
        <h2>Social Icons (Preloaded)</h2>
        <div style={{ display: 'flex', gap: '1rem', alignItems: 'center', marginTop: '1rem' }}>
          <div style={{ textAlign: 'center' }}>
            <IconDynamic name="social:facebook" size={32} color="blue" />
            <div style={{ fontSize: '0.75rem', marginTop: '0.25rem' }}>social:facebook</div>
          </div>
          <div style={{ textAlign: 'center' }}>
            <IconDynamic name="social:twitter" size={32} color="#1DA1F2" />
            <div style={{ fontSize: '0.75rem', marginTop: '0.25rem' }}>social:twitter</div>
          </div>
        </div>
        <p style={{ fontSize: '0.875rem', color: '#666', marginTop: '0.5rem' }}>
          ✓ Social namespace preloaded on page mount
        </p>
      </section>

      <section style={{ marginTop: '2rem' }}>
        <h2>Brand Icons (Preloaded)</h2>
        <div style={{ display: 'flex', gap: '1rem', alignItems: 'center', marginTop: '1rem' }}>
          <div style={{ textAlign: 'center' }}>
            <IconDynamic name="brands:apple" size={32} />
            <div style={{ fontSize: '0.75rem', marginTop: '0.25rem' }}>brands:apple</div>
          </div>
          <div style={{ textAlign: 'center' }}>
            <IconDynamic name="brands:google" size={32} />
            <div style={{ fontSize: '0.75rem', marginTop: '0.25rem' }}>brands:google</div>
          </div>
        </div>
        <p style={{ fontSize: '0.875rem', color: '#666', marginTop: '0.5rem' }}>
          ✓ Brands namespace preloaded on page mount
        </p>
      </section>

      <section style={{ marginTop: '2rem' }}>
        <h2>With Accessibility Labels</h2>
        <div style={{ display: 'flex', gap: '1rem', alignItems: 'center', marginTop: '1rem' }}>
          <IconDynamicWithLabel name="home" label="Home page" size={24} />
          <IconDynamicWithLabel name="user" label="User profile" size={24} />
          <IconDynamicWithLabel name="settings" label="Settings" size={24} />
          <IconDynamicWithLabel name="search" label="Search" size={24} />
          <IconDynamicWithLabel name="star" label="Favorite" size={24} />
        </div>
        <p style={{ fontSize: '0.875rem', color: '#666', marginTop: '0.5rem' }}>
          ✓ Icons with aria-label for screen readers
        </p>
      </section>

      <section style={{ marginTop: '2rem' }}>
        <h2>Cache Control</h2>
        <button
          onClick={() => {
            clearSpriteCache();
            alert('Cache cleared! Refresh the page to reload sprites.');
          }}
          style={{
            padding: '0.5rem 1rem',
            backgroundColor: '#0070f3',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer',
            fontSize: '0.875rem',
          }}
        >
          Clear Sprite Cache
        </button>
        <p style={{ fontSize: '0.875rem', color: '#666', marginTop: '0.5rem' }}>
          Clear all cached sprites (in-memory and session storage)
        </p>
      </section>

      <section style={{ marginTop: '2rem' }}>
        <h2>Features</h2>
        <ul style={{ lineHeight: '1.8' }}>
          <li>
            <strong>No Route Setup Required:</strong> Just import and use - no need to copy route
            files
          </li>
          <li>
            <strong>Lazy Loading:</strong> Sprites loaded on-demand per namespace
          </li>
          <li>
            <strong>In-Memory Caching:</strong> Instant access after first load
          </li>
          <li>
            <strong>Session Storage:</strong> Persists across page reloads
          </li>
          <li>
            <strong>Version Management:</strong> Auto cache invalidation on version change
          </li>
          <li>
            <strong>Namespace Support:</strong> Independent loading per namespace
          </li>
        </ul>
      </section>

      <section style={{ marginTop: '2rem' }}>
        <h2>Performance Notes</h2>
        <p>Open your browser's DevTools Network tab and observe:</p>
        <ul style={{ lineHeight: '1.8' }}>
          <li>First render: Sprites are fetched from server</li>
          <li>Subsequent renders: Sprites loaded from cache (no network requests)</li>
          <li>Page reload: Sprites loaded from session storage (no network requests)</li>
          <li>Version change: Cache invalidated, sprites re-fetched</li>
        </ul>
      </section>

      <section style={{ marginTop: '2rem', padding: '1rem', backgroundColor: '#f0f0f0' }}>
        <h3>Try It!</h3>
        <ol style={{ lineHeight: '1.8' }}>
          <li>Watch the Network tab while this page loads</li>
          <li>Refresh the page and notice sprites load from session storage</li>
          <li>Click "Clear Cache" and refresh to see sprites re-fetch</li>
        </ol>
      </section>
    </div>
  );
}
