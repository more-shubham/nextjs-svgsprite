/**
 * Dynamic SVG Sprite Loader
 *
 * This module provides client-side dynamic loading and caching of SVG sprites
 * with namespace support, version management, and session-based persistence.
 *
 * Features:
 * - Lazy loading: Sprites are loaded on-demand per namespace
 * - In-memory caching: Loaded sprites are cached to avoid redundant requests
 * - Session storage: Persistent cache across page reloads with version tracking
 * - Version management: Cache is invalidated when sprite version changes
 * - Namespace support: Each namespace is loaded independently
 *
 * @module components/sprite-loader
 */

// Version identifier for cache busting
const SPRITE_VERSION = '1.0.0';
const CACHE_KEY_PREFIX = 'nextjs-svgsprite';

/**
 * In-memory cache for loaded sprites
 * Structure: { namespace: { version: string, content: string, promise?: Promise<string> } }
 */
const spriteCache: Map<
  string,
  {
    version: string;
    content: string;
    promise?: Promise<string>;
  }
> = new Map();

/**
 * Track sprite keys in session storage for efficient cleanup
 */
const sessionStorageKeys: Set<string> = new Set();

/**
 * Get cache key for session storage
 */
function getCacheKey(namespace: string): string {
  return `${CACHE_KEY_PREFIX}-${namespace}`;
}

/**
 * Load sprite content from session storage
 */
function loadFromSessionStorage(namespace: string): string | null {
  if (typeof window === 'undefined' || !window.sessionStorage) {
    return null;
  }

  try {
    const cacheKey = getCacheKey(namespace);
    const cached = window.sessionStorage.getItem(cacheKey);

    if (!cached) {
      return null;
    }

    const parsed = JSON.parse(cached);

    // Check if version matches
    if (parsed.version !== SPRITE_VERSION) {
      // Version mismatch, clear cache
      window.sessionStorage.removeItem(cacheKey);
      sessionStorageKeys.delete(cacheKey);
      return null;
    }

    // Track the key
    sessionStorageKeys.add(cacheKey);
    return parsed.content;
  } catch (error) {
    console.warn(`Failed to load sprite from session storage: ${namespace}`, error);
    return null;
  }
}

/**
 * Save sprite content to session storage
 */
function saveToSessionStorage(namespace: string, content: string): void {
  if (typeof window === 'undefined' || !window.sessionStorage) {
    return;
  }

  try {
    const cacheKey = getCacheKey(namespace);
    const data = JSON.stringify({
      version: SPRITE_VERSION,
      content,
      timestamp: Date.now(),
    });

    window.sessionStorage.setItem(cacheKey, data);
    sessionStorageKeys.add(cacheKey); // Track the key for efficient cleanup
  } catch (error) {
    console.warn(`Failed to save sprite to session storage: ${namespace}`, error);
  }
}

/**
 * Fetch sprite content from the server
 */
async function fetchSpriteFromServer(namespace: string): Promise<string> {
  const url = namespace === 'default' ? '/icons' : `/icons/${namespace}`;

  try {
    const response = await fetch(url, {
      cache: 'default', // Use default browser caching strategy
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch sprite: ${response.status} ${response.statusText}`);
    }

    const content = await response.text();
    return content;
  } catch (error) {
    console.error(`Error fetching sprite for namespace: ${namespace}`, error);
    throw error;
  }
}

/**
 * Validate that content is a valid SVG string
 */
function isValidSvgContent(content: string): boolean {
  // Basic validation: check if it's an SVG element
  return typeof content === 'string' && 
         content.trim().startsWith('<svg') && 
         content.includes('</svg>');
}

/**
 * Inject sprite SVG into the DOM
 */
function injectSprite(namespace: string, content: string): void {
  if (typeof document === 'undefined') {
    return;
  }

  // Validate content before injection to prevent XSS
  if (!isValidSvgContent(content)) {
    console.error(`Invalid SVG content for namespace: ${namespace}`);
    return;
  }

  // Check if sprite container already exists
  let container = document.getElementById(`sprite-container-${namespace}`);

  if (!container) {
    // Create a new container
    container = document.createElement('div');
    container.id = `sprite-container-${namespace}`;
    container.style.display = 'none';
    container.setAttribute('aria-hidden', 'true');
    document.body.appendChild(container);
  }

  // Set the sprite content (validated as SVG above)
  container.innerHTML = content;
}

/**
 * Load a sprite for a specific namespace
 *
 * This function:
 * 1. Checks in-memory cache first
 * 2. Falls back to session storage cache
 * 3. Fetches from server if not cached
 * 4. Injects sprite into DOM
 * 5. Caches the result
 *
 * @param namespace - The namespace to load (e.g., 'default', 'social', 'brands')
 * @returns Promise that resolves when sprite is loaded
 */
export async function loadSprite(namespace: string = 'default'): Promise<void> {
  // Check in-memory cache
  const cached = spriteCache.get(namespace);

  if (cached) {
    // If we're already loading, wait for it
    if (cached.promise) {
      await cached.promise;
      return;
    }

    // Already loaded and cached
    if (cached.version === SPRITE_VERSION && cached.content) {
      injectSprite(namespace, cached.content);
      return;
    }
  }

  // Try loading from session storage
  const sessionCached = loadFromSessionStorage(namespace);
  if (sessionCached) {
    // Cache in memory and inject
    spriteCache.set(namespace, {
      version: SPRITE_VERSION,
      content: sessionCached,
    });
    injectSprite(namespace, sessionCached);
    return;
  }

  // Need to fetch from server
  const loadPromise = (async () => {
    try {
      const content = await fetchSpriteFromServer(namespace);

      // Save to both caches
      saveToSessionStorage(namespace, content);
      spriteCache.set(namespace, {
        version: SPRITE_VERSION,
        content,
      });

      // Inject into DOM
      injectSprite(namespace, content);

      return content;
    } catch (error) {
      // Remove failed promise from cache
      spriteCache.delete(namespace);
      throw error;
    }
  })();

  // Store the promise to prevent duplicate requests
  spriteCache.set(namespace, {
    version: SPRITE_VERSION,
    content: '',
    promise: loadPromise,
  });

  await loadPromise;
}

/**
 * Preload sprites for multiple namespaces
 *
 * Useful for preloading commonly used namespaces to improve performance
 *
 * @param namespaces - Array of namespace names to preload
 */
export async function preloadSprites(namespaces: string[]): Promise<void> {
  await Promise.all(namespaces.map((ns) => loadSprite(ns)));
}

/**
 * Clear all sprite caches (in-memory and session storage)
 *
 * Useful for forcing a reload of all sprites
 */
export function clearSpriteCache(): void {
  spriteCache.clear();

  if (typeof window !== 'undefined' && window.sessionStorage) {
    // Clear only tracked sprite keys for efficiency
    sessionStorageKeys.forEach((key) => {
      window.sessionStorage.removeItem(key);
    });
    sessionStorageKeys.clear();
  }
}

/**
 * Get the current sprite version
 */
export function getSpriteVersion(): string {
  return SPRITE_VERSION;
}
