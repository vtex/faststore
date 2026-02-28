# NavbarSlider

## Intention
Mobile navigation drawer menu.

## Description
NavbarSlider provides mobile navigation in slide-out panel. Displays navigation links, categories, and actions in responsive drawer.

## Import
```tsx
import { NavbarSlider } from '@faststore/components'
```

## Sub-components
- `NavbarSliderHeader` - Header with close button
- `NavbarSliderContent` - Navigation content
- `NavbarSliderFooter` - Footer actions

## Examples

```tsx
<NavbarSlider isOpen={isMobileMenuOpen} onClose={() => setMobileMenuOpen(false)}>
  <NavbarSliderHeader>
    <Logo />
  </NavbarSliderHeader>
  <NavbarSliderContent>
    <NavbarLinks />
  </NavbarSliderContent>
</NavbarSlider>
```
