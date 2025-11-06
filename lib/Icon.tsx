/**
 * Icon Component
 * 
 * A reusable React component for displaying SVG icons from bundled sprites
 * This component works standalone and includes all icons from the package
 * 
 * @example
 * import Icon from 'nextjs-svgsprite/Icon';
 * <Icon name="home" size={24} className="text-blue-500" />
 * <Icon name="user" size={32} color="red" />
 */

import { CSSProperties, SVGProps } from 'react';
import { IconName } from './icon-types';

export interface IconProps extends Omit<SVGProps<SVGSVGElement>, 'name'> {
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
 * Parse icon name to determine sprite URL and icon ID
 * @param name - Icon name (e.g., "home" or "social:facebook")
 * @returns Object with spriteUrl and iconId
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

export default function Icon({
  name,
  size = 24,
  color = 'currentColor',
  className = '',
  style = {},
  ...props
}: IconProps) {
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
 * Icon component with label for accessibility
 */
export interface IconWithLabelProps extends Omit<SVGProps<SVGSVGElement>, 'name'> {
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

export function IconWithLabel({
  name,
  label,
  size = 24,
  color = 'currentColor',
  className = '',
  style = {},
  ...props
}: IconWithLabelProps) {
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

// Export icon names for convenience
export * from './icon-types';
