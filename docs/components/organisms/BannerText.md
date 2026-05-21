# BannerText

## Intention
Text-focused promotional banner with CTA.

## Description
BannerText displays text-based promotional content with optional background color/image. Includes heading, body text, and call-to-action button.

## Import
```tsx
import { BannerText } from '@faststore/components'
```

## Sub-components
- `BannerTextContent` - Content wrapper

## Examples

```tsx
<BannerText>
  <BannerTextContent
    title="Summer Sale"
    subtitle="Save up to 50% on summer collection"
    link={{ href: '/sale', children: 'Shop Now' }}
  />
</BannerText>
```
