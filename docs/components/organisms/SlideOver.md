# SlideOver

## Intention
Slide-out panel for secondary content and actions.

## Description
SlideOver provides slide-out panel from screen edge. Used for filters, menus, forms, and secondary navigation. Similar to modal but anchored to screen edge.

## Import
```tsx
import { SlideOver } from '@faststore/components'
```

## Sub-components
- `SlideOverHeader` - Header with close button

## Examples

```tsx
<SlideOver isOpen={isOpen} onClose={() => setIsOpen(false)} direction="right">
  <SlideOverHeader>
    <h2>Filters</h2>
  </SlideOverHeader>
  <div>
    <Filter />
  </div>
</SlideOver>
```
