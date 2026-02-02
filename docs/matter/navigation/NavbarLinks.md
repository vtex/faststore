# NavbarLinks (Matter)

## Intention
Navigation menu with Next.js routing.

## Description
Matter NavbarLinks extends foundational component with Next.js Link for client-side navigation.

## Import
```tsx
import NavbarLinks from 'src/components/navigation/NavbarLinks'
```

## Extends

[NavbarLinks (Foundational)](../../components/molecules/NavbarLinks.md) from `@faststore/ui`

## Examples

```tsx
<NavbarLinks
  links={[
    { href: '/new', label: 'New Arrivals' },
    { href: '/sale', label: 'Sale' },
    { href: '/categories', label: 'Categories' }
  ]}
/>
```
