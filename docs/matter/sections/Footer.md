# Footer Section (Matter)

## Intention
Site footer with links, social, and info.

## Description
Footer section with CMS-configurable links, social media, payment methods, and legal info.

## Import
```tsx
import Footer from 'src/components/sections/Footer'
```

## CMS Configuration

```tsx
{
  sections: { type: 'array', items: { type: 'object' } },
  socialLinks: { type: 'array' },
  paymentMethods: { type: 'array' }
}
```

## Examples

```tsx
<Footer sections={footerSections} />
```
