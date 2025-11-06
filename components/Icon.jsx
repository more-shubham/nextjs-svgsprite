/**
 * Icon Component
 * 
 * A reusable React component for displaying SVG icons from the sprite
 * 
 * @example
 * <Icon name="home" size={24} className="text-blue-500" />
 * <Icon name="user" size={32} color="red" />
 */

import React from 'react';

export default function Icon({
  name,
  size = 24,
  color = 'currentColor',
  className = '',
  style = {},
  ...props
}) {
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
export function IconWithLabel({
  name,
  label,
  size = 24,
  color = 'currentColor',
  className = '',
  style = {},
  ...props
}) {
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
