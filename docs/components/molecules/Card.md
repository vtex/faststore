# Card

## Intention
Container for grouped content with optional interactivity.

## Description
Card provides a bordered, elevated container for related content. Supports clickable areas, images, and various content layouts. Base component for building more specific cards like ProductCard.

In ecommerce, used for product cards, category cards, promotional blocks.

## Import
```tsx
import { Card } from '@faststore/components'
```

## Props

| Name | Type | Default | Required | Description |
|------|------|---------|----------|-------------|
| `testId` | `string` | `'fs-card'` | No | ID for testing tools |
| `children` | `ReactNode` | - | Yes | Card content |

Extends `HTMLAttributes<HTMLDivElement>`.

## Accessibility

- Uses semantic `<article>` or `<div>`
- Ensure clickable cards have proper keyboard access
- Headings provide structure

## CSS Custom Properties

```scss
--fs-card-padding: var(--fs-spacing-3)
--fs-card-border-radius: var(--fs-border-radius)
--fs-card-border-width: var(--fs-border-width)
--fs-card-border-color: var(--fs-border-color)
--fs-card-shadow: var(--fs-shadow)
--fs-card-bkg-color: var(--fs-color-body-bkg)
```

## Examples

```tsx
<Card>
  <h3>Card Title</h3>
  <p>Card content goes here</p>
</Card>

{/* Clickable Card */}
<Card as="article">
  <img src={image} alt={title} />
  <h3><Link href={url}>{title}</Link></h3>
  <p>{description}</p>
</Card>
```
