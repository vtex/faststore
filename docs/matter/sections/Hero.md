# Hero Section (Matter)

## Intention
CMS-configurable hero banner section.

## Description
Hero section component with CMS schema for content management. Supports custom images, titles, CTAs, and layout options.

## Import
```tsx
import Hero from 'src/components/sections/Hero'
```

## CMS Configuration

```tsx
export const schema = {
  title: 'Hero',
  description: 'Hero banner section',
  type: 'object',
  properties: {
    title: { type: 'string', title: 'Title' },
    subtitle: { type: 'string', title: 'Subtitle' },
    image: { type: 'image', title: 'Background Image' },
    link: {
      type: 'object',
      properties: {
        text: { type: 'string' },
        url: { type: 'string' }
      }
    }
  }
}
```

## Extends

[Hero (Foundational)](../../components/organisms/Hero.md)

## Examples

```tsx
<Hero
  title="Summer Sale"
  subtitle="Up to 50% off"
  image="/hero.jpg"
  link={{ text: 'Shop Now', url: '/sale' }}
/>
```
