# Rating

## Intention
Display or collect star ratings for products and reviews.

## Description
Rating component displays star ratings (1-5) with support for partial stars, custom icons, and interactive rating input. Can be read-only (display) or actionable (input). Supports hover states for interactive mode.

In ecommerce, used for product ratings, review collection, and rating filters.

## Import
```tsx
import { Rating } from '@faststore/components'
```

## Props

| Name | Type | Default | Required | Description |
|------|------|---------|----------|-------------|
| `testId` | `string` | `'fs-rating'` | No | ID for testing tools |
| `length` | `number` | `5` | No | Number of rating items |
| `value` | `number` | `0` | Yes | Current rating (0-5, supports decimals) |
| `icon` | `ReactNode` | `<Icon name="Star" />` | No | Custom rating icon |
| `onChange` | `(value: number) => void` | - | No | Makes rating actionable/interactive |
| `disabled` | `boolean` | `false` | No | Disables interactive rating |

## Modes

### Display Mode (Read-only)
No `onChange` prop - shows static rating with partial stars.

### Interactive Mode
With `onChange` prop - allows user to select rating with hover preview.

## Sub-components

- [List](../atoms/List.md) - Container
- [Icon](../atoms/Icon.md) - Star icons
- [IconButton](./IconButton.md) - For interactive mode

## Accessibility

- Uses `<ul>` with proper list semantics
- Interactive mode: Each star is a button with `aria-label`
- Screen readers announce rating value
- Keyboard navigable in interactive mode

## CSS Custom Properties

```scss
--fs-rating-gap: var(--fs-spacing-0)
--fs-rating-icon-size: var(--fs-spacing-3)
--fs-rating-color-filled: var(--fs-color-warning)
--fs-rating-color-empty: var(--fs-color-neutral-3)
```

## Data Attributes

```tsx
<ul
  data-fs-rating
  data-fs-rating-actionable="false"
>
  <li data-fs-rating-item="full" />    // Filled star
  <li data-fs-rating-item="partial" /> // Half star
  <li data-fs-rating-item="empty" />   // Empty star
</ul>
```

## Examples

### Display Rating
```tsx
<Rating value={4.5} />
// Shows 4.5 stars
```

### Interactive Rating
```tsx
const [rating, setRating] = useState(0)

<Rating
  value={rating}
  onChange={setRating}
/>
```

### Custom Icon
```tsx
<Rating
  value={5}
  icon={<Icon name="Heart" />}
/>
```

### With Product
```tsx
<article>
  <h3>{product.name}</h3>
  <Rating value={product.averageRating} />
  <span>({product.reviewCount} reviews)</span>
</article>
```

### Review Form
```tsx
<form>
  <label>Rate this product:</label>
  <Rating
    value={userRating}
    onChange={setUserRating}
  />
</form>
```
