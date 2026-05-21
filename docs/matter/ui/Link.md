# Link (Matter)

## Intention
Next.js Link wrapper for client-side navigation.

## Description
Link wrapper for next/link with automatic prefetching and client-side routing.

## Import
```tsx
import { Link } from 'src/components/ui/Link'
```

## Architecture

```
Link (Matter)
├── next/link (Next.js routing)
└── UILink (foundational)
```

## Features

- Client-side navigation
- Automatic prefetching
- Scroll restoration
- Route preloading

## Extends

[Link (Foundational)](../../components/atoms/Link.md)

## Examples

```tsx
<Link href="/products">
  Shop Now
</Link>
```
