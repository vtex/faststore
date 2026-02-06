# Icon

## Intention
Display SVG icons with consistent sizing and stroke weight.

## Description
Icon is a lightweight SVG wrapper component that renders icons from a sprite sheet. It provides consistent sizing, stroke weights, and accessibility features for icon usage throughout the application.

Icons are essential in ecommerce interfaces for visual communication, navigation affordances, and action indicators.

## Import
```tsx
import { Icon } from '@faststore/components'
```

## Props

| Name | Type | Default | Required | Description |
|------|------|---------|----------|-------------|
| `testId` | `string` | `'fs-icon'` | No | ID for testing tools |
| `name` | `string` | - | Yes | Symbol ID from icon sprite (e.g., "Bell", "ShoppingCart") |
| `weight` | `'thin' \| 'light' \| 'regular' \| 'bold'` | `'regular'` | No | SVG stroke weight |
| `width` | `number` | `24` | No | Icon width in pixels |
| `height` | `number` | `24` | No | Icon height in pixels |

Extends `SVGProps<SVGSVGElement>` for additional SVG attributes (className, style, etc.).

## Icon System

Icons are loaded from an SVG sprite sheet located at `/static/icons.svg`. Each icon is referenced by its symbol ID.

### Weight Mapping
- **`thin`**: strokeWidth = 8
- **`light`**: strokeWidth = 12  
- **`regular`**: strokeWidth = 16 (default)
- **`bold`**: strokeWidth = 24

## Accessibility

- Uses semantic `<svg>` element
- Should be paired with text labels or `aria-label` for context
- **Decorative icons**: Use `aria-hidden="true"`
- **Meaningful icons**: Provide accessible text via:
  - Adjacent text label
  - `aria-label` on icon
  - `aria-labelledby` referencing descriptive text

## CSS Custom Properties

```scss
// Icons inherit color from parent
--fs-icon-color: currentColor

// Size is controlled via width/height props
// Custom sizing can be applied via CSS
[data-fs-icon] {
  width: 24px;
  height: 24px;
}
```

## Data Attributes

```tsx
<svg
  data-fs-icon
  data-testid="fs-icon"
  width={24}
  height={24}
  strokeWidth={16}
>
  <use href="/icons.svg#IconName" />
</svg>
```

## Best Practices

### Do's
✅ Use consistent icon sizes within the same context  
✅ Provide text labels or aria-labels for meaningful icons  
✅ Use appropriate weight for visual hierarchy  
✅ Leverage color inheritance from parent elements  
✅ Use decorative icons with `aria-hidden="true"`

### Don'ts
❌ Don't use icons as the only means of conveying information  
❌ Don't use icons with low color contrast  
❌ Don't create custom icon components inline (use sprite sheet)  
❌ Don't make icons too small (minimum 16x16px for touch targets)  
❌ Don't use inconsistent weights within the same UI section

### Performance Considerations
- Icons load from a single sprite sheet (efficient HTTP request)
- SVG sprite is cached by the browser
- Lightweight component with minimal rendering overhead
- Use `React.memo` if passing icons as props frequently

## Related Components

- [IconButton](../molecules/IconButton.md) - Button with icon only
- [Button](./Button.md) - Can include icons alongside text
- [Badge](./Badge.md) - Often used with icons (e.g., notification count)

## Examples

### Basic Usage
```tsx
<Icon name="ShoppingCart" />
<Icon name="Heart" />
<Icon name="Search" />
<Icon name="User" />
```

### Custom Size
```tsx
<Icon name="Star" width={16} height={16} />
<Icon name="Star" width={32} height={32} />
```

### Weight Variants
```tsx
<Icon name="Bell" weight="thin" />
<Icon name="Bell" weight="light" />
<Icon name="Bell" weight="regular" />
<Icon name="Bell" weight="bold" />
```

### With Color
```tsx
<Icon name="Heart" style={{ color: 'red' }} />
<Icon name="CheckCircle" style={{ color: 'green' }} />
```

### In Button
```tsx
<Button icon={<Icon name="ShoppingCart" />}>
  Add to Cart
</Button>
```

### Decorative (hidden from screen readers)
```tsx
<Icon name="Star" aria-hidden="true" />
```

### With Accessible Label
```tsx
<button aria-label="Add to favorites">
  <Icon name="Heart" />
</button>

{/* Or with visible text */}
<button>
  <Icon name="Heart" aria-hidden="true" />
  <span>Add to favorites</span>
</button>
```

## Available Icons

Common ecommerce icons include:
- Navigation: `ArrowLeft`, `ArrowRight`, `Menu`, `X`
- Shopping: `ShoppingCart`, `ShoppingBag`, `CreditCard`
- User: `User`, `Heart`, `Star`
- Actions: `Plus`, `Minus`, `Trash`, `Edit`
- Status: `CheckCircle`, `XCircle`, `AlertTriangle`
- Social: `Facebook`, `Instagram`, `Twitter`

Refer to `/static/icons.svg` for the complete icon list.
