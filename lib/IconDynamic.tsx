/**
 * Dynamic Icon Component
 *
 * A client-side icon component that dynamically loads SVG sprites on demand.
 * This component eliminates the need for setting up route handlers manually.
 *
 * Features:
 * - Dynamic sprite loading on first use
 * - Namespace-aware lazy loading
 * - Session-based caching with version management
 * - Automatic cache invalidation on version changes
 * - In-memory caching for optimal performance
 *
 * @module components/IconDynamic
 */

'use client';

import { CSSProperties, SVGProps, useEffect, useState } from 'react';
import { IconName } from './icon-types';
import { loadSprite } from './sprite-loader';

export interface IconDynamicProps extends Omit<SVGProps<SVGSVGElement>, 'name'> {
  /** Name of the icon from the sprite */
  name: IconName;
  /** Size of the icon in pixels (default: 24) */
  size?: number;
  /** Color of the icon (default: currentColor) */
  color?: string;
  /** Additional CSS classes */
  className?: string;
  /** Inline styles */
  style?: CSSProperties;
}

/**
 * Parse icon name to determine namespace and icon ID
 */
function parseIconName(name: string): { namespace: string; iconId: string } {
  const colonIndex = name.indexOf(':');

  if (colonIndex > 0) {
    const namespace = name.substring(0, colonIndex);
    const iconId = name.substring(colonIndex + 1);
    return { namespace, iconId };
  }

  return { namespace: 'default', iconId: name };
}

/**
 * Custom hook to load sprite for a given namespace
 * Handles loading state and error state
 */
function useLoadSprite(namespace: string) {
  const [isLoaded, setIsLoaded] = useState(false);
  const [hasError, setHasError] = useState(false);

  useEffect(() => {
    let mounted = true;

    // Load the sprite for this namespace
    loadSprite(namespace)
      .then(() => {
        if (mounted) {
          setIsLoaded(true);
        }
      })
      .catch((error) => {
        console.error(`Failed to load sprite for namespace: ${namespace}`, error);
        if (mounted) {
          setHasError(true);
        }
      });

    return () => {
      mounted = false;
    };
  }, [namespace]);

  return { isLoaded, hasError };
}

/**
 * Dynamic Icon Component
 *
 * This component dynamically loads the required sprite on first use and caches it
 * for subsequent renders. No manual route setup required!
 *
 * @example
 * ```tsx
 * import IconDynamic from '@/components/IconDynamic';
 *
 * // Default namespace icon
 * <IconDynamic name="home" size={24} />
 *
 * // Namespaced icon
 * <IconDynamic name="social:facebook" size={32} color="blue" />
 * ```
 */
export default function IconDynamic({
  name,
  size = 24,
  color = 'currentColor',
  className = '',
  style = {},
  ...props
}: IconDynamicProps) {
  if (!name) {
    console.warn('IconDynamic component requires a "name" prop');
    return null;
  }

  const { namespace, iconId } = parseIconName(name);
  const { isLoaded, hasError } = useLoadSprite(namespace);

  // Show placeholder while loading to avoid layout shifts
  if (!isLoaded && !hasError) {
    return (
      <svg
        width={size}
        height={size}
        fill={color}
        className={className}
        style={style}
        aria-hidden="true"
        {...props}
      >
        {/* Empty placeholder maintains layout */}
      </svg>
    );
  }

  // Show error state
  if (hasError) {
    console.warn(`Icon "${name}" failed to load`);
    return null;
  }

  return (
    <svg
      width={size}
      height={size}
      fill={color}
      className={className}
      style={style}
      aria-hidden="true"
      {...props}
    >
      <use href={`#${iconId}`} />
    </svg>
  );
}

/**
 * Props for the IconDynamicWithLabel component
 */
export interface IconDynamicWithLabelProps extends Omit<SVGProps<SVGSVGElement>, 'name'> {
  /** Name of the icon from the sprite */
  name: IconName;
  /** Accessible label for screen readers */
  label?: string;
  /** Size of the icon in pixels (default: 24) */
  size?: number;
  /** Color of the icon (default: currentColor) */
  color?: string;
  /** Additional CSS classes */
  className?: string;
  /** Inline styles */
  style?: CSSProperties;
}

/**
 * Dynamic Icon component with accessibility label
 *
 * @example
 * ```tsx
 * <IconDynamicWithLabel name="home" label="Go to homepage" size={24} />
 * ```
 */
export function IconDynamicWithLabel({
  name,
  label,
  size = 24,
  color = 'currentColor',
  className = '',
  style = {},
  ...props
}: IconDynamicWithLabelProps) {
  if (!name) {
    console.warn('IconDynamicWithLabel component requires a "name" prop');
    return null;
  }

  const { namespace, iconId } = parseIconName(name);
  const { isLoaded, hasError } = useLoadSprite(namespace);

  // Show placeholder while loading to avoid layout shifts
  if (!isLoaded && !hasError) {
    return (
      <svg
        width={size}
        height={size}
        fill={color}
        className={className}
        style={style}
        role="img"
        aria-label={label || name}
        {...props}
      >
        {/* Empty placeholder maintains layout */}
      </svg>
    );
  }

  // Show error state
  if (hasError) {
    console.warn(`Icon "${name}" with label failed to load`);
    return null;
  }

  return (
    <svg
      width={size}
      height={size}
      fill={color}
      className={className}
      style={style}
      role="img"
      aria-label={label || name}
      {...props}
    >
      <use href={`#${iconId}`} />
    </svg>
  );
}

// Export sprite loader utilities for advanced use cases
export { loadSprite, preloadSprites, clearSpriteCache, getSpriteVersion } from './sprite-loader';
