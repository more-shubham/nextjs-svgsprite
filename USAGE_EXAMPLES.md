# Usage Examples

This document provides practical examples of using the Next.js SVG Sprite plugin in various scenarios.

## Table of Contents

- [Basic Usage](#basic-usage)
- [Component Examples](#component-examples)
- [Styling Examples](#styling-examples)
- [Advanced Patterns](#advanced-patterns)
- [Real-World Scenarios](#real-world-scenarios)

## Basic Usage

### Simple Icon Display

```jsx
import Icon from '@/components/Icon';

export default function MyPage() {
  return (
    <div>
      <Icon name="home" size={24} />
    </div>
  );
}
```

### Icon with Color

```jsx
<Icon name="user" size={32} color="#3b82f6" />
<Icon name="settings" size={24} color="red" />
<Icon name="search" size={20} color="currentColor" />
```

### Icon with CSS Classes

```jsx
<Icon name="home" size={24} className="text-blue-500 hover:text-blue-700 transition-colors" />
```

## Component Examples

### Navigation Bar

```jsx
import Icon from '@/components/Icon';

export default function Navigation() {
  const navItems = [
    { name: 'home', label: 'Home', href: '/' },
    { name: 'user', label: 'Profile', href: '/profile' },
    { name: 'settings', label: 'Settings', href: '/settings' },
  ];

  return (
    <nav className="flex gap-6">
      {navItems.map((item) => (
        <a key={item.name} href={item.href} className="flex items-center gap-2 hover:text-blue-500">
          <Icon name={item.name} size={20} />
          <span>{item.label}</span>
        </a>
      ))}
    </nav>
  );
}
```

### Icon Button Component

```jsx
import Icon from '@/components/Icon';

export function IconButton({ icon, label, onClick, variant = 'primary' }) {
  const variants = {
    primary: 'bg-blue-500 text-white hover:bg-blue-600',
    secondary: 'bg-gray-200 text-gray-800 hover:bg-gray-300',
    danger: 'bg-red-500 text-white hover:bg-red-600',
  };

  return (
    <button
      onClick={onClick}
      className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${variants[variant]}`}
    >
      <Icon name={icon} size={20} />
      {label && <span>{label}</span>}
    </button>
  );
}

// Usage
<IconButton icon="home" label="Go Home" onClick={() => router.push('/')} />
<IconButton icon="settings" label="Settings" variant="secondary" />
<IconButton icon="search" variant="primary" />
```

### Card with Icon

```jsx
import Icon from '@/components/Icon';

export function FeatureCard({ icon, title, description }) {
  return (
    <div className="p-6 bg-white rounded-lg shadow-md">
      <div className="flex items-center gap-3 mb-4">
        <div className="p-3 bg-blue-100 rounded-full">
          <Icon name={icon} size={24} color="#3b82f6" />
        </div>
        <h3 className="text-xl font-bold">{title}</h3>
      </div>
      <p className="text-gray-600">{description}</p>
    </div>
  );
}

// Usage
<FeatureCard
  icon="home"
  title="Easy Setup"
  description="Get started in minutes with zero configuration"
/>;
```

### Icon List

```jsx
import Icon from '@/components/Icon';

export function IconList({ items }) {
  return (
    <ul className="space-y-2">
      {items.map((item, index) => (
        <li key={index} className="flex items-center gap-3">
          <Icon name={item.icon} size={20} color="#22c55e" />
          <span>{item.text}</span>
        </li>
      ))}
    </ul>
  );
}

// Usage
<IconList
  items={[
    { icon: 'home', text: 'Built-in routing' },
    { icon: 'user', text: 'User authentication' },
    { icon: 'settings', text: 'Customizable settings' },
  ]}
/>;
```

## Styling Examples

### CSS Modules

```css
/* styles.module.css */
.icon {
  color: #3b82f6;
  transition: all 0.3s ease;
}

.icon:hover {
  color: #1d4ed8;
  transform: scale(1.1);
}

.iconLarge {
  width: 48px;
  height: 48px;
}
```

```jsx
import Icon from '@/components/Icon';
import styles from './styles.module.css';

<Icon name="home" size={24} className={styles.icon} />
<Icon name="user" size={48} className={`${styles.icon} ${styles.iconLarge}`} />
```

### Tailwind CSS

```jsx
import Icon from '@/components/Icon';

// Hover effects
<Icon
  name="home"
  size={24}
  className="text-gray-600 hover:text-blue-500 transition-colors duration-200"
/>

// Animated icon
<Icon
  name="settings"
  size={24}
  className="text-gray-600 hover:rotate-180 transition-transform duration-500"
/>

// Icon with background
<div className="p-3 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full inline-block">
  <Icon name="user" size={24} color="white" />
</div>

// Responsive sizes
<Icon
  name="home"
  size={24}
  className="w-6 h-6 md:w-8 md:h-8 lg:w-10 lg:h-10"
/>
```

### Inline Styles

```jsx
<Icon
  name="home"
  size={24}
  style={{
    color: '#3b82f6',
    marginRight: '8px',
    verticalAlign: 'middle',
    filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.1))',
  }}
/>
```

## Advanced Patterns

### Animated Loading Icon

```jsx
import Icon from '@/components/Icon';

export function LoadingSpinner({ size = 24 }) {
  return (
    <div className="inline-block animate-spin">
      <Icon name="settings" size={size} />
    </div>
  );
}
```

### Icon with Badge

```jsx
import Icon from '@/components/Icon';

export function IconWithBadge({ icon, badge, size = 24 }) {
  return (
    <div className="relative inline-block">
      <Icon name={icon} size={size} />
      {badge && (
        <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
          {badge}
        </span>
      )}
    </div>
  );
}

// Usage
<IconWithBadge icon="user" badge="3" />;
```

### Icon Toggle Button

```jsx
'use client';

import { useState } from 'react';
import Icon from '@/components/Icon';

export function IconToggle({ onIcon, offIcon, defaultOn = false }) {
  const [isOn, setIsOn] = useState(defaultOn);

  return (
    <button
      onClick={() => setIsOn(!isOn)}
      className="p-2 rounded hover:bg-gray-100 transition-colors"
    >
      <Icon name={isOn ? onIcon : offIcon} size={24} color={isOn ? '#3b82f6' : '#6b7280'} />
    </button>
  );
}

// Usage
<IconToggle onIcon="home" offIcon="user" />;
```

### Conditional Icon Rendering

```jsx
import Icon from '@/components/Icon';

export function StatusIcon({ status, size = 24 }) {
  const iconMap = {
    success: { name: 'home', color: '#22c55e' },
    warning: { name: 'settings', color: '#f59e0b' },
    error: { name: 'user', color: '#ef4444' },
    info: { name: 'search', color: '#3b82f6' },
  };

  const config = iconMap[status] || iconMap.info;

  return <Icon name={config.name} size={size} color={config.color} />;
}

// Usage
<StatusIcon status="success" />
<StatusIcon status="error" />
```

### Icon Grid

```jsx
import Icon from '@/components/Icon';

export function IconGrid({ icons, size = 32 }) {
  return (
    <div className="grid grid-cols-4 gap-4">
      {icons.map((iconName) => (
        <div
          key={iconName}
          className="flex flex-col items-center gap-2 p-4 border rounded hover:bg-gray-50 cursor-pointer"
        >
          <Icon name={iconName} size={size} />
          <span className="text-xs text-gray-600">{iconName}</span>
        </div>
      ))}
    </div>
  );
}

// Usage
<IconGrid icons={['home', 'user', 'settings', 'search']} />;
```

## Real-World Scenarios

### Search Bar

```jsx
import Icon from '@/components/Icon';

export function SearchBar() {
  return (
    <div className="relative">
      <div className="absolute left-3 top-1/2 -translate-y-1/2">
        <Icon name="search" size={20} color="#9ca3af" />
      </div>
      <input
        type="text"
        placeholder="Search..."
        className="w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
      />
    </div>
  );
}
```

### User Profile Header

```jsx
import Icon from '@/components/Icon';

export function ProfileHeader({ user }) {
  return (
    <div className="flex items-center gap-4 p-6 bg-white rounded-lg shadow">
      <div className="w-16 h-16 bg-gradient-to-br from-blue-400 to-blue-600 rounded-full flex items-center justify-center">
        <Icon name="user" size={32} color="white" />
      </div>
      <div>
        <h2 className="text-2xl font-bold">{user.name}</h2>
        <p className="text-gray-600 flex items-center gap-2">
          <Icon name="home" size={16} />
          {user.location}
        </p>
      </div>
    </div>
  );
}
```

### Action Menu

```jsx
import Icon from '@/components/Icon';

export function ActionMenu({ actions }) {
  return (
    <div className="bg-white rounded-lg shadow-lg p-2">
      {actions.map((action, index) => (
        <button
          key={index}
          onClick={action.onClick}
          className="w-full flex items-center gap-3 px-4 py-2 hover:bg-gray-100 rounded transition-colors"
        >
          <Icon name={action.icon} size={20} color={action.color || 'currentColor'} />
          <span>{action.label}</span>
        </button>
      ))}
    </div>
  );
}

// Usage
<ActionMenu
  actions={[
    { icon: 'home', label: 'Home', onClick: () => {} },
    { icon: 'user', label: 'Profile', onClick: () => {} },
    { icon: 'settings', label: 'Settings', onClick: () => {} },
  ]}
/>;
```

### Breadcrumb Navigation

```jsx
import Icon from '@/components/Icon';

export function Breadcrumb({ items }) {
  return (
    <nav className="flex items-center gap-2 text-sm">
      {items.map((item, index) => (
        <div key={index} className="flex items-center gap-2">
          {index > 0 && <Icon name="arrow-right" size={16} color="#9ca3af" />}
          <a
            href={item.href}
            className={`flex items-center gap-1 ${
              index === items.length - 1
                ? 'text-gray-900 font-medium'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            {item.icon && <Icon name={item.icon} size={16} />}
            <span>{item.label}</span>
          </a>
        </div>
      ))}
    </nav>
  );
}
```

### Notification Item

```jsx
import Icon from '@/components/Icon';

export function NotificationItem({ notification }) {
  const iconConfig = {
    info: { name: 'search', color: '#3b82f6' },
    success: { name: 'home', color: '#22c55e' },
    warning: { name: 'settings', color: '#f59e0b' },
    error: { name: 'user', color: '#ef4444' },
  };

  const config = iconConfig[notification.type] || iconConfig.info;

  return (
    <div className="flex items-start gap-3 p-4 bg-white rounded-lg shadow">
      <div className={`p-2 rounded-full bg-${config.color}-100`}>
        <Icon name={config.name} size={20} color={config.color} />
      </div>
      <div className="flex-1">
        <h4 className="font-semibold">{notification.title}</h4>
        <p className="text-sm text-gray-600">{notification.message}</p>
        <span className="text-xs text-gray-400">{notification.time}</span>
      </div>
    </div>
  );
}
```

### Settings Panel

```jsx
import Icon from '@/components/Icon';

export function SettingsPanel({ settings }) {
  return (
    <div className="bg-white rounded-lg shadow">
      {settings.map((section, index) => (
        <div key={index} className="border-b last:border-b-0">
          <div className="flex items-center gap-3 p-4">
            <div className="p-2 bg-gray-100 rounded">
              <Icon name={section.icon} size={20} />
            </div>
            <div className="flex-1">
              <h3 className="font-semibold">{section.title}</h3>
              <p className="text-sm text-gray-600">{section.description}</p>
            </div>
            <Icon name="arrow-right" size={20} color="#9ca3af" />
          </div>
        </div>
      ))}
    </div>
  );
}
```

## Tips and Best Practices

### 1. Icon Naming Convention

Keep icon names consistent and descriptive:

- Use kebab-case: `arrow-right.svg`, `user-profile.svg`
- Be specific: `home.svg` instead of `icon1.svg`
- Group related icons: `social-facebook.svg`, `social-twitter.svg`

### 2. Performance Optimization

```jsx
// Good: Icon component uses the sprite efficiently
<Icon name="home" size={24} />

// Avoid: Don't import individual SVG files when using the sprite
// import HomeIcon from './home.svg';  ❌
```

### 3. Accessibility

```jsx
// For decorative icons
<Icon name="home" size={24} aria-hidden="true" />

// For meaningful icons
import { IconWithLabel } from '@/components/Icon';
<IconWithLabel name="search" label="Search the site" size={24} />

// In buttons, provide text or aria-label
<button aria-label="Settings">
  <Icon name="settings" size={24} />
</button>
```

### 4. Responsive Sizing

```jsx
// Use Tailwind responsive classes
<Icon name="home" className="w-4 h-4 sm:w-6 sm:h-6 md:w-8 md:h-8" />;

// Or use size prop with responsive breakpoints
const size = useMediaQuery('(min-width: 768px)') ? 32 : 24;
<Icon name="home" size={size} />;
```

### 5. Dark Mode Support

```jsx
<Icon
  name="home"
  size={24}
  className="text-gray-900 dark:text-gray-100"
/>

// With custom colors
<Icon
  name="user"
  size={24}
  color={isDarkMode ? '#f3f4f6' : '#111827'}
/>
```

## Conclusion

This plugin provides a flexible and performant way to use SVG icons in your Next.js application. The sprite-based approach ensures that all icons are loaded in a single HTTP request, while the component API makes them easy to use and customize.

For more information, see the main [README.md](./README.md) and [INTEGRATION.md](./INTEGRATION.md).
