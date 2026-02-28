# Button

## Intention
Primary interactive element for triggering actions and submitting forms.

## Description
Button is the fundamental interactive component for user actions. It supports multiple visual variants (primary, secondary, tertiary), sizes, loading states, and icon positioning. The component provides comprehensive accessibility features and flexibility for various use cases.

In ecommerce, buttons are used for critical actions like "Add to Cart", "Buy Now", "Apply Filters", form submissions, and navigation.

## Import
```tsx
import { Button } from '@faststore/components'
```

## Props

| Name | Type | Default | Required | Description |
|------|------|---------|----------|-------------|
| `testId` | `string` | `'fs-button'` | No | ID for testing tools |
| `variant` | `'primary' \| 'secondary' \| 'tertiary'` | - | No | Color variant for visual hierarchy |
| `size` | `'small' \| 'regular'` | `'regular'` | No | Size variant |
| `inverse` | `boolean` | `false` | No | Inverts colors for dark backgrounds |
| `disabled` | `boolean` | `false` | No | Disables button interaction |
| `icon` | `ReactNode` | - | No | Icon component to display |
| `iconPosition` | `'left' \| 'right'` | `'left'` | No | Position of the icon relative to text |
| `loading` | `boolean` | `false` | No | Shows loading state |
| `loadingLabel` | `string` | - | No | Text to display during loading |
| `children` | `ReactNode` | - | No | Button label text |

Extends `ButtonHTMLAttributes<HTMLButtonElement>` for additional native button props.

## Variants

### Visual Hierarchy

- **`primary`**: High-emphasis actions (e.g., "Add to Cart", "Buy Now")
  - Filled background with primary color
  - Use for main call-to-action

- **`secondary`**: Medium-emphasis actions
  - Outlined or alternative styling
  - Use for secondary actions

- **`tertiary`**: Low-emphasis actions  
  - Minimal styling, text-only
  - Use for cancel, back, or subtle actions

### Size Variants

- **`regular`** (default): Standard button size
- **`small`**: Compact size for tight spaces or dense layouts

### State Variants

- **`inverse`**: Inverted colors for dark backgrounds
- **`disabled`**: Non-interactive state with reduced opacity
- **`loading`**: Shows loader with optional loading label

## Accessibility

- Uses semantic `<button>` element
- Supports all standard button ARIA attributes
- **Disabled state**: Sets `disabled` attribute (keyboard & screen reader aware)
- **Loading state**: Shows loading indicator without disabling interaction detection
- **Icon-only buttons**: Should include aria-label or visually hidden text
- Keyboard accessible: Space and Enter keys trigger click

## CSS Custom Properties

```scss
// Layout & Spacing
--fs-button-padding: var(--fs-spacing-2) var(--fs-spacing-3)
--fs-button-border-radius: var(--fs-border-radius)
--fs-button-gap: var(--fs-spacing-1)

// Typography
--fs-button-text-size: var(--fs-text-size-base)
--fs-button-text-weight: var(--fs-text-weight-bold)

// Colors - Primary
--fs-button-primary-bkg-color: var(--fs-color-primary)
--fs-button-primary-text-color: var(--fs-color-text-inverse)
--fs-button-primary-bkg-color-hover: var(--fs-color-primary-hover)

// Colors - Secondary  
--fs-button-secondary-bkg-color: var(--fs-color-secondary)
--fs-button-secondary-text-color: var(--fs-color-text)
--fs-button-secondary-border-color: var(--fs-border-color)

// Colors - Tertiary
--fs-button-tertiary-bkg-color: transparent
--fs-button-tertiary-text-color: var(--fs-color-link)

// Loading
--fs-button-loading-bkg-color: var(--fs-color-neutral-bkg)

// Disabled
--fs-button-disabled-bkg-color: var(--fs-color-disabled-bkg)
--fs-button-disabled-text-color: var(--fs-color-disabled-text)

// Transitions
--fs-button-transition-timing: var(--fs-transition-timing)
```

## Data Attributes

```tsx
<button
  data-fs-button
  data-fs-button-variant="primary"      // Variant: primary, secondary, tertiary
  data-fs-button-size="regular"         // Size: small, regular
  data-fs-button-inverse="false"        // Inverse colors
  data-fs-button-loading="false"        // Loading state
>
  <div data-fs-button-wrapper>
    <span data-fs-button-icon>{icon}</span>
    <span>{children}</span>
  </div>
</button>
```

## Best Practices

### Do's
✅ Use primary variant sparingly for main actions  
✅ Provide clear, action-oriented labels ("Add to Cart" not "Click Here")  
✅ Include loading states for async actions  
✅ Use appropriate size for context  
✅ Ensure sufficient color contrast  
✅ Disable buttons only when action is truly unavailable

### Don'ts
❌ Don't use multiple primary buttons in the same view  
❌ Don't disable buttons without explanation  
❌ Don't use long text that wraps to multiple lines  
❌ Don't nest interactive elements inside buttons  
❌ Don't rely on color alone to indicate state  
❌ Don't use buttons for navigation (use Link instead)

### Performance Considerations
- Loading state shows visual feedback without disabling the button element
- Icons should be lightweight SVG components
- Avoid creating new icon components on every render

## Related Components

- [IconButton](../molecules/IconButton.md) - Button with icon only
- [LinkButton](../molecules/LinkButton.md) - Button styled as a link
- [BuyButton](../molecules/BuyButton.md) - Specialized add-to-cart button
- [Link](./Link.md) - For navigation instead of actions

## Examples

### Basic Usage
```tsx
<Button>Click me</Button>
<Button variant="primary">Primary Action</Button>
<Button variant="secondary">Secondary Action</Button>
<Button variant="tertiary">Tertiary Action</Button>
```

### With Icons
```tsx
import { Icon } from '@faststore/components'

<Button icon={<Icon name="ShoppingCart" />} iconPosition="left">
  Add to Cart
</Button>

<Button icon={<Icon name="Heart" />} iconPosition="right">
  Save
</Button>
```

### Loading State
```tsx
<Button loading loadingLabel="Adding to cart...">
  Add to Cart
</Button>
```

### Sizes
```tsx
<Button size="small">Small Button</Button>
<Button size="regular">Regular Button</Button>
```

### Disabled State
```tsx
<Button disabled>Unavailable</Button>
```

### Inverse (for dark backgrounds)
```tsx
<div style={{ background: '#000', padding: '20px' }}>
  <Button variant="primary" inverse>
    Inverse Button
  </Button>
</div>
```

### Form Submit
```tsx
<form onSubmit={handleSubmit}>
  <Button type="submit" variant="primary">
    Submit Form
  </Button>
</form>
```
