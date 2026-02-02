# NavbarSlider (Matter)

## Intention
Mobile navigation drawer with Next.js routing.

## Description
Matter NavbarSlider extends foundational component with Next.js Link and navigation state management.

## Import
```tsx
import NavbarSlider from 'src/components/navigation/NavbarSlider'
```

## Extends

[NavbarSlider (Foundational)](../../components/organisms/NavbarSlider.md) from `@faststore/ui`

## Examples

```tsx
<NavbarSlider
  isOpen={isMobileMenuOpen}
  onClose={() => setMobileMenuOpen(false)}
/>
```
