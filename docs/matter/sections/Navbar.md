# Navbar Section (Matter)

## Intention
CMS-configurable navigation section.

## Description
Navbar section with CMS configuration for navigation structure and links.

## Import
```tsx
import Navbar from 'src/components/sections/Navbar'
```

## CMS Configuration

```tsx
{
  links: { type: 'array', items: { type: 'link' } },
  logo: { type: 'image' }
}
```

## Examples

```tsx
<Navbar />
```
