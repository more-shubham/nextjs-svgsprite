/**
 * Icon Component
 *
 * A reusable, type-safe React component for displaying SVG icons from sprite files.
 * Supports namespaced icons and provides full TypeScript autocomplete.
 *
 * Features:
 * - Type-safe icon names with IDE autocomplete
 * - Automatic namespace detection and sprite loading
 * - Customizable size, color, and styling
 * - Accessibility support via IconWithLabel variant
 * - Performance optimized with SVG sprites
 *
 * @module components/Icon
 * @author Next.js SVG Sprite Plugin Team
 *
 * @example Basic usage
 * ```tsx
 * import Icon from '@/components/Icon';
 *
 * export default function MyComponent() {
 *   return (
 *     <div>
 *       <Icon name="home" size={24} />
 *       <Icon name="user" size={32} color="blue" />
 *       <Icon name="social:facebook" size={24} />
 *     </div>
 *   );
 * }
 * ```
 *
 * @example With accessibility
 * ```tsx
 * import { IconWithLabel } from '@/components/Icon';
 *
 * <IconWithLabel name="home" label="Go to homepage" size={24} />
 * ```
 */

import { CSSProperties, SVGProps } from 'react';
import { IconName } from './icon-types';

/**
 * Props for the Icon component
 *
 * @interface IconProps
 * @extends {Omit<SVGProps<SVGSVGElement>, 'name'>}
 */
export interface IconProps extends Omit<SVGProps<SVGSVGElement>, 'name'> {
  /**
   * Name of the icon from the sprite
   * Supports namespaced icons (e.g., 'social:facebook')
   * Type-safe with autocomplete based on available icons
   */
  name: IconName;

  /**
   * Size of the icon in pixels
   * @default 24
   */
  size?: number;

  /**
   * Color of the icon
   * Supports any valid CSS color value
   * @default 'currentColor'
   */
  color?: string;

  /**
   * Additional CSS classes to apply to the icon
   */
  className?: string;

  /**
   * Inline styles to apply to the icon
   */
  style?: CSSProperties;
}

/**
 * Parse icon name to determine sprite URL and icon ID
 *
 * This function extracts the namespace from an icon name and constructs
 * the appropriate sprite URL and icon ID for SVG use element.
 *
 * @param {string} name - Icon name (e.g., "home" or "social:facebook")
 * @returns {Object} Object with spriteUrl and iconId
 * @returns {string} returns.spriteUrl - URL to the sprite file
 * @returns {string} returns.iconId - ID of the icon within the sprite
 *
 * @example
 * ```ts
 * parseSpriteUrl('home')
 * // Returns: { spriteUrl: '/icons', iconId: 'home' }
 *
 * parseSpriteUrl('social:facebook')
 * // Returns: { spriteUrl: '/icons/social', iconId: 'facebook' }
 * ```
 *
 * @internal
 */
function parseSpriteUrl(name: string): { spriteUrl: string; iconId: string } {
  const colonIndex = name.indexOf(':');
  let spriteUrl = '/icons'; // Default sprite
  let iconId: string = name;

  if (colonIndex > 0) {
    const namespace = name.substring(0, colonIndex);
    iconId = name.substring(colonIndex + 1);
    spriteUrl = `/icons/${namespace}`;
  }

  return { spriteUrl, iconId };
}

/**
 * Icon Component
 *
 * Display an SVG icon from the sprite file with customizable properties.
 * The component automatically handles namespace detection and sprite loading.
 *
 * @param {IconProps} props - Component props
 * @returns {JSX.Element | null} SVG element or null if name is invalid
 *
 * @example
 * ```tsx
 * // Basic icon
 * <Icon name="home" size={24} />
 *
 * // Colored icon
 * <Icon name="user" size={32} color="blue" />
 *
 * // Namespaced icon
 * <Icon name="social:facebook" size={24} />
 *
 * // With custom styling
 * <Icon name="settings" size={24} className="rotate-icon" style={{ opacity: 0.8 }} />
 * ```
 */
export default function Icon({
  name,
  size = 24,
  color = 'currentColor',
  className = '',
  style = {},
  ...props
}: IconProps) {
  // Validate icon name
  if (!name) {
    console.warn('Icon component requires a "name" prop');
    return null;
  }

  const { spriteUrl, iconId } = parseSpriteUrl(name);

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
      <use href={`${spriteUrl}#${iconId}`} />
    </svg>
  );
}

/**
 * Props for the IconWithLabel component
 *
 * @interface IconWithLabelProps
 * @extends {Omit<SVGProps<SVGSVGElement>, 'name'>}
 */
export interface IconWithLabelProps extends Omit<SVGProps<SVGSVGElement>, 'name'> {
  /**
   * Name of the icon from the sprite
   * Supports namespaced icons (e.g., 'social:facebook')
   */
  name: IconName;

  /**
   * Accessible label for screen readers
   * If not provided, the icon name will be used
   */
  label?: string;

  /**
   * Size of the icon in pixels
   * @default 24
   */
  size?: number;

  /**
   * Color of the icon
   * @default 'currentColor'
   */
  color?: string;

  /**
   * Additional CSS classes
   */
  className?: string;

  /**
   * Inline styles
   */
  style?: CSSProperties;
}

/**
 * Icon component with accessibility label
 *
 * This variant of the Icon component includes proper accessibility attributes
 * for screen readers. Use this when the icon conveys meaningful information
 * or serves as a button/link.
 *
 * @param {IconWithLabelProps} props - Component props
 * @returns {JSX.Element | null} SVG element with aria-label or null if name is invalid
 *
 * @example
 * ```tsx
 * // Icon with custom label
 * <IconWithLabel name="home" label="Go to homepage" size={24} />
 *
 * // Icon as button
 * <button>
 *   <IconWithLabel name="user" label="Open user profile" size={20} />
 * </button>
 *
 * // Icon with context
 * <IconWithLabel name="settings" label="Application settings" size={24} />
 * ```
 */
export function IconWithLabel({
  name,
  label,
  size = 24,
  color = 'currentColor',
  className = '',
  style = {},
  ...props
}: IconWithLabelProps) {
  // Validate icon name
  if (!name) {
    console.warn('IconWithLabel component requires a "name" prop');
    return null;
  }

  const { spriteUrl, iconId } = parseSpriteUrl(name);

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
      <use href={`${spriteUrl}#${iconId}`} />
    </svg>
  );
}
