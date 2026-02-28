# Tooltip

## Intention
Display contextual information on hover or focus.

## Description
Tooltip shows additional information when users hover or focus on an element. Use for supplementary details, definitions, or help text. Tooltips are non-essential information that enhances understanding but isn't required for operation.

In ecommerce, used for shipping info icons, size guides, feature explanations.

## Import
```tsx
import { Tooltip } from '@faststore/components'
```

## Props

| Name | Type | Default | Required | Description |
|------|------|---------|----------|-------------|
| `testId` | `string` | `'fs-tooltip'` | No | ID for testing tools |
| `text` | `string` | - | Yes | Tooltip content |
| `children` | `ReactElement` | - | Yes | Trigger element |

## Accessibility

- Trigger has `aria-describedby` pointing to tooltip
- Tooltip has unique ID
- Keyboard accessible (shows on focus)
- Screen readers announce tooltip content

## CSS Custom Properties

```scss
--fs-tooltip-padding: var(--fs-spacing-1) var(--fs-spacing-2)
--fs-tooltip-bkg-color: var(--fs-color-neutral-7)
--fs-tooltip-text-color: var(--fs-color-text-inverse)
--fs-tooltip-text-size: var(--fs-text-size-tiny)
--fs-tooltip-border-radius: var(--fs-border-radius-small)
```

## Examples

### Basic Usage
```tsx
<Tooltip text="Free shipping on orders over $50">
  <Icon name="Info" />
</Tooltip>
```

### With Button
```tsx
<Tooltip text="Add to wishlist">
  <IconButton
    icon={<Icon name="Heart" />}
    aria-label="Add to wishlist"
    onClick={handleFavorite}
  />
</Tooltip>
```

### Help Text
```tsx
<label>
  Password
  <Tooltip text="Must be at least 8 characters">
    <Icon name="HelpCircle" />
  </Tooltip>
</label>
```
