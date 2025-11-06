/**
 * TypeScript Example: Type-Safe Icon Usage
 *
 * This file demonstrates how TypeScript provides:
 * 1. Type safety for icon names
 * 2. Autocomplete suggestions in your IDE
 * 3. Compile-time error checking
 */

import Icon, { IconWithLabel } from '@/components/Icon';
import { IconName, iconNames } from '@/components/icon-types';

// ✅ Example 1: Basic usage with type-safe icon names
export function BasicExample() {
  return (
    <div>
      {/* ✅ These are valid - TypeScript knows these icons exist */}
      <Icon name="home" size={24} />
      <Icon name="user" size={24} />
      <Icon name="settings" size={24} />
      <Icon name="search" size={24} />

      {/* ❌ This would cause a TypeScript error (uncomment to see) */}
      {/* <Icon name="invalid-icon" size={24} /> */}
      {/* Error: Type '"invalid-icon"' is not assignable to type 'IconName' */}
    </div>
  );
}

// ✅ Example 2: Using IconName type for function parameters
export function renderIcon(iconName: IconName, size: number = 24) {
  return <Icon name={iconName} size={size} />;
}

// Usage:
export function UseRenderIcon() {
  return (
    <div>
      {renderIcon('home', 32)}
      {renderIcon('user', 24)}
      {/* ❌ This would cause a TypeScript error */}
      {/* {renderIcon('invalid', 24)} */}
    </div>
  );
}

// ✅ Example 3: Type-safe data structures
interface MenuItem {
  id: string;
  label: string;
  icon: IconName; // Type-safe icon name
  href: string;
}

const menuItems: MenuItem[] = [
  { id: '1', label: 'Home', icon: 'home', href: '/' },
  { id: '2', label: 'Profile', icon: 'user', href: '/profile' },
  { id: '3', label: 'Settings', icon: 'settings', href: '/settings' },
  { id: '4', label: 'Search', icon: 'search', href: '/search' },
  // ❌ This would cause a TypeScript error
  // { id: '5', label: 'Invalid', icon: 'invalid', href: '/invalid' },
];

export function Navigation() {
  return (
    <nav>
      {menuItems.map((item) => (
        <a key={item.id} href={item.href}>
          <Icon name={item.icon} size={20} />
          <span>{item.label}</span>
        </a>
      ))}
    </nav>
  );
}

// ✅ Example 4: Dynamic icon rendering with conditional logic
export function StatusIcon({ isActive }: { isActive: boolean }) {
  // TypeScript ensures both options are valid icon names
  const iconName: IconName = isActive ? 'home' : 'settings';
  const color = isActive ? 'green' : 'gray';

  return <Icon name={iconName} color={color} size={24} />;
}

// ✅ Example 5: Iterating over all available icons
export function IconGallery() {
  return (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '1rem' }}>
      {iconNames.map((name) => (
        <div key={name} style={{ textAlign: 'center' }}>
          <Icon name={name} size={48} />
          <p style={{ fontSize: '12px', marginTop: '0.5rem' }}>{name}</p>
        </div>
      ))}
    </div>
  );
}

// ✅ Example 6: Type guard for runtime validation
// For better performance with large icon sets, use a Set
const iconNamesSet = new Set(iconNames);
export function isValidIconName(name: string): name is IconName {
  return iconNamesSet.has(name as IconName);
}

export function DynamicIconRenderer({ iconNameFromApi }: { iconNameFromApi: string }) {
  // Safely handle icon names from external sources
  if (!isValidIconName(iconNameFromApi)) {
    console.warn(`Invalid icon name: ${iconNameFromApi}`);
    return <Icon name="home" size={24} />; // Fallback to default
  }

  return <Icon name={iconNameFromApi} size={24} />;
}

// ✅ Example 7: Accessible icons with labels
export function AccessibleIcons() {
  return (
    <div>
      <IconWithLabel name="home" label="Go to home page" size={24} />
      <IconWithLabel name="user" label="View user profile" size={24} />
      <IconWithLabel name="settings" label="Open settings" size={24} />
      <IconWithLabel name="search" label="Search the site" size={24} />
    </div>
  );
}

// ✅ Example 8: Icon with custom props (inherits SVGProps)
export function CustomPropsExample() {
  return (
    <div>
      <Icon
        name="home"
        size={24}
        onClick={() => console.log('Clicked!')}
        style={{ cursor: 'pointer' }}
        className="hover:text-blue-500"
        aria-hidden={false}
      />
    </div>
  );
}

// ✅ Example 9: Reusable icon button component
interface IconButtonProps {
  icon: IconName;
  label: string;
  onClick: () => void;
  size?: number;
}

export function IconButton({ icon, label, onClick, size = 24 }: IconButtonProps) {
  return (
    <button
      onClick={onClick}
      aria-label={label}
      style={{
        padding: '0.5rem',
        border: 'none',
        background: 'transparent',
        cursor: 'pointer',
      }}
    >
      <Icon name={icon} size={size} />
    </button>
  );
}

// Usage:
export function IconButtonExample() {
  return (
    <div>
      <IconButton icon="home" label="Go home" onClick={() => console.log('Home clicked')} />
      <IconButton icon="search" label="Search" onClick={() => console.log('Search clicked')} />
    </div>
  );
}

// ✅ Example 10: Using with React hooks
import { useState } from 'react';

export function IconSelector() {
  const [selectedIcon, setSelectedIcon] = useState<IconName>('home');

  return (
    <div>
      <div style={{ marginBottom: '1rem' }}>
        <Icon name={selectedIcon} size={64} />
      </div>

      <div style={{ display: 'flex', gap: '0.5rem' }}>
        {iconNames.map((iconName) => (
          <button
            key={iconName}
            onClick={() => setSelectedIcon(iconName)}
            style={{
              padding: '0.5rem',
              border: selectedIcon === iconName ? '2px solid blue' : '1px solid gray',
              background: 'white',
              cursor: 'pointer',
            }}
          >
            <Icon name={iconName} size={24} />
          </button>
        ))}
      </div>

      <p style={{ marginTop: '1rem' }}>
        Selected: <code>{selectedIcon}</code>
      </p>
    </div>
  );
}
