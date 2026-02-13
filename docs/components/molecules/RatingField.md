# RatingField

## Intention
Interactive rating input with label for forms.

## Description
RatingField combines Rating component with Label for collecting user ratings in forms. Provides proper field structure for rating input.

## Import
```tsx
import { RatingField } from '@faststore/components'
```

## Props

| Name | Type | Default | Required | Description |
|------|------|---------|----------|-------------|
| `id` | `string` | - | Yes | Field identifier |
| `label` | `string` | - | Yes | Label text |
| `value` | `number` | - | Yes | Current rating |
| `onChange` | `(value: number) => void` | - | Yes | Change callback |

## Examples

```tsx
const [rating, setRating] = useState(0)

<form>
  <RatingField
    id="product-rating"
    label="Rate this product"
    value={rating}
    onChange={setRating}
  />
</form>
```
