# Image (Matter)

## Intention
Next.js Image component wrapper with optimization.

## Description
Image wrapper for next/image with automatic optimization, lazy loading, and blur placeholder support.

## Import
```tsx
import { Image } from 'src/components/ui/Image'
```

## Architecture

```
Image (Matter)
└── next/image (Next.js optimization)
```

## Features

- Automatic image optimization
- Responsive srcset generation
- Lazy loading
- Blur placeholder
- WebP format support

## Examples

```tsx
<Image
  src="/product.jpg"
  alt="Product name"
  width={800}
  height={800}
  loading="lazy"
/>
```
