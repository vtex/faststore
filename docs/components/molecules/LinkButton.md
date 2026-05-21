# LinkButton

## Intention
Hyperlink styled as a button for navigation that looks like an action.

## Description
LinkButton renders an anchor (`<a>`) element with button styling. Use for navigation that should visually appear as a button. Inherits button appearance while maintaining link semantics and behavior. The component prevents focus when disabled but doesn't prevent click (use onClick handler to prevent navigation).

In ecommerce, used for "Shop Now", "View Products", and prominent navigation CTAs.

## Import
```tsx
import { LinkButton } from '@faststore/components'
```

## Props

Combines `AnchorHTMLAttributes<HTMLAnchorElement>` and `ButtonProps`:

| Name | Type | Default | Required | Description |
|------|------|---------|----------|-------------|
| `testId` | `string` | `'fs-link-button'` | No | ID for testing tools |
| `href` | `string` | - | Yes | Link destination |
| `variant` | `'primary' \| 'secondary' \| 'tertiary'` | `'primary'` | No | Button style variant |
| `size` | `'small' \| 'regular'` | `'regular'` | No | Button size |
| `icon` | `ReactNode` | - | No | Icon component |
| `iconPosition` | `'left' \| 'right'` | - | No | Icon position |
| `inverse` | `boolean` | `false` | No | Inverted colors |
| `disabled` | `boolean` | `false` | No | Disabled appearance (blur on focus) |
| `children` | `ReactNode` | - | Yes | Link text |

## Accessibility

- Uses semantic `<a>` element (not button)
- Keyboard: Enter triggers navigation (native link behavior)
- Screen readers announce as link, not button
- Disabled state blurs focus but doesn't prevent clicks (handle in onClick if needed)

## CSS Custom Properties

Inherits all Button CSS properties.

## Data Attributes

```tsx
<a
  data-fs-button
  data-fs-link-button
  data-fs-button-size="regular"
  data-fs-button-variant="primary"
  data-fs-button-disabled="false"
>
  {children}
</a>
```

## Best Practices

### Do's
✅ Use for navigation that should look like a button  
✅ Use action-oriented text ("Shop Now", "View Collection")  
✅ Ensure href is valid  
✅ Handle disabled clicks in onClick if needed

### Don'ts
❌ Don't use for actions (use Button instead)  
❌ Don't use without href  
❌ Don't forget that disabled doesn't prevent clicks

## Examples

### Basic Usage
```tsx
<LinkButton href="/products">
  Shop Now
</LinkButton>
```

### With Icon
```tsx
<LinkButton href="/sale" icon={<Icon name="ArrowRight" />} iconPosition="right">
  View Sale
</LinkButton>
```

### Variants
```tsx
<LinkButton href="/products" variant="primary">Primary CTA</LinkButton>
<LinkButton href="/products" variant="secondary">Secondary</LinkButton>
```

### Disabled
```tsx
<LinkButton href="/coming-soon" disabled>
  Coming Soon
</LinkButton>
```
