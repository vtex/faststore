# Navbar (Matter)

## Intention
Site navigation with Next.js routing and scroll behavior.

## Description
Matter Navbar extends foundational Navbar with Next.js Link integration, scroll direction detection, and responsive behavior.

## Architecture

```
Navbar (Matter)
├── useScrollDirection hook
├── Next.js Link integration
└── UINavbar (foundational)
```

## Import
```tsx
import Navbar from 'src/components/navigation/Navbar'
```

## Extends

[Navbar (Foundational)](../../components/organisms/Navbar.md) from `@faststore/ui`

## Examples

```tsx
<Navbar />
// Automatically includes scroll behavior and Next.js routing
```
