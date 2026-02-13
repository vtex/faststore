# Popover

## Intention
Contextual overlay anchored to trigger element.

## Description
Popover displays floating content anchored to a trigger element. Unlike tooltips (hover-only), popovers can contain interactive content and remain open until dismissed.

In ecommerce, used for size guides, shipping info, mini carts, filters.

## Import
```tsx
import { Popover } from '@faststore/components'
```

## Examples

```tsx
<Popover>
  <PopoverTrigger>
    <Button>Show Details</Button>
  </PopoverTrigger>
  <PopoverContent>
    <h3>Size Guide</h3>
    <Table>
      {/* Size chart */}
    </Table>
  </PopoverContent>
</Popover>
```
