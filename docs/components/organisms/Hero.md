# Hero

## Intention
Large banner for homepage/landing pages with image and call-to-action.

## Description
Hero displays prominent banners with images, headings, descriptions, and CTAs. Used for homepage heroes, promotional banners, and landing page headers.

## Import
```tsx
import { Hero } from '@faststore/components'
```

## Sub-components
- `HeroImage` - Background/banner image
- `HeroHeader` - Title and description

## Examples

```tsx
<Hero>
  <HeroImage>
    <img src="/hero-banner.jpg" alt="Summer Sale" />
  </HeroImage>
  <HeroHeader
    title="Summer Sale"
    subtitle="Up to 50% off on selected items"
    link={{ href: '/sale', children: 'Shop Now' }}
  />
</Hero>
```
