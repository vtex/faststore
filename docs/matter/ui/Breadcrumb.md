# Breadcrumb (Matter UI)

## Intention
Breadcrumb with Next.js Link integration.

## Description
UI wrapper for Breadcrumb using Next.js Link for client-side navigation.

## Import
```tsx
import { Breadcrumb } from 'src/components/ui/Breadcrumb'
```

## Extends

[Breadcrumb (Foundational)](../../components/molecules/Breadcrumb.md)

## Examples

```tsx
<Breadcrumb
  breadcrumbList={[
    { item: '/', name: 'Home', position: 1 },
    { item: '/category', name: 'Category', position: 2 }
  ]}
/>
```
