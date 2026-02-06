# EmptyState Section (Matter)

## Intention
CMS-configurable empty state section.

## Description
Empty state section for no results, empty lists, etc. with CMS configuration.

## Import
```tsx
import EmptyState from 'src/components/sections/EmptyState'
```

## CMS Configuration

```tsx
{
  title: { type: 'string' },
  description: { type: 'string' },
  buttonText: { type: 'string' },
  buttonLink: { type: 'string' }
}
```

## Examples

```tsx
<EmptyState
  title="No results found"
  description="Try adjusting your filters"
/>
```
