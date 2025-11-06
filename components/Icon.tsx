/**
 * Icon Component
 * 
 * A reusable React component for displaying SVG icons from the sprite
 * 
 * @example
 * <Icon name="home" size={24} className="text-blue-500" />
 * <Icon name="user" size={32} color="red" />
 */

import React, { CSSProperties, SVGProps } from 'react';
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
      <use href={`/icons#${name}`} />
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
      <use href={`/icons#${name}`} />
    </svg>
  );
}
