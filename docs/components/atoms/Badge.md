# Badge

## Intention
Display status, labels, or numerical indicators with semantic color variants.

## Description
Badge is a compact UI element used to highlight an item's status, category, or count. It supports multiple semantic variants (info, success, warning, danger, etc.) and can function as both a label badge and a counter badge for displaying numerical values.

In ecommerce contexts, badges are commonly used for product tags (e.g., "New", "Sale"), stock status ("Out of Stock"), or cart item counts.

## Import
```tsx
import { Badge } from '@faststore/components'
```

## Props

| Name | Type | Default | Required | Description |
|------|------|---------|----------|-------------|
| `testId` | `string` | `'fs-badge'` | No | ID for testing tools (cypress, testing library, jest) |
| `size` | `'small' \| 'big'` | `'small'` | No | Specifies the size variant |
| `variant` | `'info' \| 'highlighted' \| 'success' \| 'neutral' \| 'warning' \| 'danger'` | `'neutral'` | No | Specifies the semantic color variant |
| `counter` | `boolean` | `false` | No | Enables counter badge mode with circular styling |
| `aria-label` | `string` | - | No | ARIA label for accessibility when using counter mode |
| `children` | `ReactNode` | - | Yes | Badge content (text or number) |

## Variants

### Semantic Variants

- **`neutral`** (default): General-purpose labels with neutral styling
  - Use for: Category tags, generic labels
  
- **`info`**: Informational messages
  - Use for: Product information, help indicators

- **`success`**: Positive states or confirmations
  - Use for: "In Stock", "Available", "Verified"

- **`warning`**: Caution or attention needed
  - Use for: "Low Stock", "Limited Time"

- **`danger`**: Error states or critical information
  - Use for: "Out of Stock", "Discontinued"

- **`highlighted`**: Emphasis or promotional content
  - Use for: "New", "Sale", "Featured"

### Size Variants

- **`small`** (default): Compact size for inline use
- **`big`**: Larger size for increased visibility

### Counter Mode

When `counter={true}`, the badge transforms into a circular counter badge:
- Positioned absolutely (top: 0.375rem, left: 1.625rem)
- Typically used on icons (e.g., cart, notifications)
- Requires `aria-label` for accessibility

## Accessibility

- Uses semantic HTML `<div>` with appropriate ARIA attributes
- **Counter Mode**: Must include `aria-label` prop to describe the count (e.g., "3 items in cart")
- Text is uppercase transformed for visual emphasis
- Color variants provide semantic meaning but should not be the only indicator

## CSS Custom Properties

```scss
// Layout
--fs-badge-padding: var(--fs-spacing-0) var(--fs-spacing-2)
--fs-badge-border-radius: var(--fs-border-radius-pill)

// Typography
--fs-badge-text-color: var(--fs-color-text)
--fs-badge-text-size: var(--fs-text-size-tiny)
--fs-badge-text-weight: var(--fs-text-weight-bold)

// Semantic Variants
--fs-badge-neutral-bkg-color: var(--fs-color-neutral-bkg)
--fs-badge-success-bkg-color: var(--fs-color-success-bkg)
--fs-badge-highlighted-bkg-color: var(--fs-color-highlighted-bkg)
--fs-badge-info-bkg-color: var(--fs-color-info-bkg)
--fs-badge-warning-bkg-color: var(--fs-color-warning-bkg)
--fs-badge-danger-bkg-color: var(--fs-color-danger-bkg)

// Big Size
--fs-badge-big-text-size: var(--fs-text-size-legend)
--fs-badge-big-padding: var(--fs-spacing-1) var(--fs-spacing-2)

// Counter Mode
--fs-badge-counter-size: var(--fs-spacing-3)
--fs-badge-counter-text-color: var(--fs-color-text-inverse)
--fs-badge-counter-bkg-color: var(--fs-color-link)
--fs-badge-counter-border-radius: var(--fs-border-radius-pill)
```

## Data Attributes

```tsx
<div
  data-fs-badge
  data-fs-badge-variant="success"    // Variant: info, success, warning, etc.
  data-fs-badge-size="small"         // Size: small, big
  data-fs-badge-counter="false"      // Counter mode: true, false
>
  <div data-fs-badge-wrapper>
    {children}
  </div>
</div>
```

## Best Practices

### Do's
✅ Use semantic variants that match the message intent  
✅ Keep badge text short (1-2 words)  
✅ Include `aria-label` when using counter mode  
✅ Use counter badges for numerical indicators on icons  
✅ Choose size based on context and visibility needs

### Don'ts
❌ Don't use color alone to convey meaning  
❌ Don't put long text in badges  
❌ Don't use counter mode for non-numeric content  
❌ Don't nest interactive elements inside badges  
❌ Don't use multiple badges when one clear label suffices

### Performance Considerations
- Lightweight component with minimal re-renders
- CSS-only styling with no JavaScript overhead
- Use `data-fs-badge-variant` for theme customization instead of inline styles

## Related Components

- [DiscountBadge](../molecules/DiscountBadge.md) - Specialized badge for displaying discount percentages
- [Tag](../molecules/Tag.md) - Similar to badge but with removal capability
- [ProductCard](../molecules/ProductCard.md) - Often uses badges for status indicators

## Examples

### Basic Label Badge
```tsx
<Badge>New</Badge>
<Badge variant="success">In Stock</Badge>
<Badge variant="danger">Out of Stock</Badge>
<Badge variant="highlighted">Sale</Badge>
```

### Size Variants
```tsx
<Badge size="small">Small</Badge>
<Badge size="big">Big</Badge>
```

### Counter Badge
```tsx
<div style={{ position: 'relative' }}>
  <Icon name="ShoppingCart" />
  <Badge counter aria-label="3 items in cart">
    3
  </Badge>
</div>
```

### All Variants
```tsx
<Badge variant="neutral">Neutral</Badge>
<Badge variant="info">Info</Badge>
<Badge variant="success">Success</Badge>
<Badge variant="warning">Warning</Badge>
<Badge variant="danger">Danger</Badge>
<Badge variant="highlighted">Highlighted</Badge>
```
