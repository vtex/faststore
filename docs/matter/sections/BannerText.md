# BannerText Section (Matter)

## Intention
CMS-configurable text banner with CTA.

## Description
Text banner section with CMS configuration for promotional content.

## Import
```tsx
import BannerText from 'src/components/sections/BannerText'
```

## CMS Configuration

```tsx
{
  title: { type: 'string' },
  caption: { type: 'string' },
  link: { type: 'link' },
  colorVariant: { type: 'string', enum: ['main', 'light', 'accent'] }
}
```

## Extends

[BannerText (Foundational)](../../components/organisms/BannerText.md)

## Examples

```tsx
<BannerText
  title="Summer Sale"
  caption="Save up to 50%"
  link={{ text: 'Shop Now', url: '/sale' }}
/>
```
