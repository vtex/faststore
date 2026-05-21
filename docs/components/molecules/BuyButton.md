# BuyButton

## Intention
Specialized button for add-to-cart and purchase actions.

## Description
BuyButton is a semantic wrapper around the Button component, specifically designed for product purchase actions. It provides consistent styling and icon positioning for "Add to Cart", "Buy Now", and similar ecommerce actions. The component ensures purchase buttons are easily identifiable across the site.

In ecommerce, BuyButtons are the primary conversion element on product pages and cards.

## Import
```tsx
import { BuyButton } from '@faststore/components'
```

## Props

| Name | Type | Default | Required | Description |
|------|------|---------|----------|-------------|
| `testId` | `string` | `'fs-buy-button'` | No | ID for testing tools |
| `icon` | `ReactNode` | - | No | Icon component (typically shopping cart) |
| `children` | `ReactNode` | - | Yes | Button text (e.g., "Add to Cart") |

Inherits all props from [Button](../atoms/Button.md) component including `variant`, `size`, `loading`, `disabled`, `onClick`, etc.

## Default Behavior

- **Icon Position**: Always `left` (enforced)
- **Variant**: Inherits from Button (typically `primary`)
- **Accessibility**: Full button keyboard and screen reader support

## Sub-components

Extends [Button](../atoms/Button.md) component.

## Accessibility

- Uses semantic `<button>` element
- **Icon**: Should be decorative (aria-hidden) with text label
- **Loading state**: Use Button's `loading` prop
- Screen readers announce button text
- Keyboard accessible (Space/Enter)
- Should have clear, action-oriented text

## CSS Custom Properties

Inherits all Button CSS properties:

```scss
// Typically used with primary variant
--fs-buy-button-bkg-color: var(--fs-button-primary-bkg-color)
--fs-buy-button-text-color: var(--fs-button-primary-text-color)
--fs-buy-button-bkg-color-hover: var(--fs-button-primary-bkg-color-hover)
```

## Data Attributes

```tsx
<button
  data-fs-button
  data-fs-buy-button
  data-testid="fs-buy-button"
>
  {/* Icon */}
  {/* Text */}
</button>
```

## Best Practices

### Do's
✅ Use action-oriented text ("Add to Cart", "Buy Now")  
✅ Include shopping cart icon for visual consistency  
✅ Show loading state during async operations  
✅ Disable when product is unavailable  
✅ Place prominently near product info  
✅ Use primary variant for emphasis

### Don'ts
❌ Don't use vague text ("Click Here", "Submit")  
❌ Don't hide icon (important visual cue)  
❌ Don't forget loading state for cart additions  
❌ Don't use for non-purchase actions  
❌ Don't make too small (min touch target 44x44px)

### Button Text Guidelines

**Recommended:**
- "Add to Cart"
- "Buy Now"
- "Add to Bag"
- "Purchase"
- "Quick Add"

**Avoid:**
- "Click Here"
- "Submit"
- "Go"
- Single-word without context

## Related Components

- [Button](../atoms/Button.md) - Base button component
- [IconButton](./IconButton.md) - Icon-only button
- [Icon](../atoms/Icon.md) - For shopping cart icon

## Examples

### Basic Usage
```tsx
import { Icon } from '@faststore/components'

<BuyButton icon={<Icon name="ShoppingCart" />}>
  Add to Cart
</BuyButton>
```

### With Loading State
```tsx
const [isAdding, setIsAdding] = useState(false)

const handleAddToCart = async () => {
  setIsAdding(true)
  await addToCart(product)
  setIsAdding(false)
}

<BuyButton
  icon={<Icon name="ShoppingCart" />}
  loading={isAdding}
  loadingLabel="Adding..."
  onClick={handleAddToCart}
>
  Add to Cart
</BuyButton>
```

### Disabled (Out of Stock)
```tsx
<BuyButton
  icon={<Icon name="ShoppingCart" />}
  disabled
>
  Out of Stock
</BuyButton>
```

### Different Variants
```tsx
{/* Primary (most common) */}
<BuyButton
  icon={<Icon name="ShoppingCart" />}
  variant="primary"
>
  Add to Cart
</BuyButton>

{/* Secondary */}
<BuyButton
  icon={<Icon name="ShoppingCart" />}
  variant="secondary"
>
  Quick Add
</BuyButton>
```

### Size Variants
```tsx
{/* Small for product cards */}
<BuyButton
  icon={<Icon name="ShoppingCart" width={16} height={16} />}
  size="small"
>
  Add
</BuyButton>

{/* Regular for PDPs */}
<BuyButton
  icon={<Icon name="ShoppingCart" />}
  size="regular"
>
  Add to Cart
</BuyButton>
```

### Buy Now Button
```tsx
<BuyButton
  icon={<Icon name="Bolt" />}
  variant="primary"
  onClick={handleBuyNow}
>
  Buy Now
</BuyButton>
```

### On Product Card
```tsx
<article>
  <img src={product.image} alt={product.name} />
  <h3>{product.name}</h3>
  <ProductPrice
    value={product.price}
    listPrice={product.listPrice}
    formatter={formatPrice}
  />
  
  {product.inStock ? (
    <BuyButton
      icon={<Icon name="ShoppingCart" />}
      onClick={() => addToCart(product)}
    >
      Add to Cart
    </BuyButton>
  ) : (
    <Button disabled>
      Out of Stock
    </Button>
  )}
</article>
```

### With Quantity Selector
```tsx
const [quantity, setQuantity] = useState(1)

<div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
  <QuantitySelector
    min={1}
    max={product.stock}
    initial={1}
    onChange={setQuantity}
  />
  
  <BuyButton
    icon={<Icon name="ShoppingCart" />}
    onClick={() => addToCart(product, quantity)}
  >
    Add to Cart
  </BuyButton>
</div>
```

### Mobile Optimized
```tsx
<BuyButton
  icon={<Icon name="ShoppingCart" />}
  style={{
    width: '100%',  // Full width on mobile
    minHeight: '48px',  // Touch-friendly
  }}
>
  Add to Cart
</BuyButton>
```

### With Analytics
```tsx
<BuyButton
  icon={<Icon name="ShoppingCart" />}
  onClick={() => {
    trackEvent('add_to_cart', {
      product_id: product.id,
      product_name: product.name,
      price: product.price,
    })
    addToCart(product)
  }}
>
  Add to Cart
</BuyButton>
```

### Quick Add (Product Grid)
```tsx
<BuyButton
  icon={<Icon name="Plus" width={16} height={16} />}
  size="small"
  variant="secondary"
  onClick={() => quickAdd(product)}
>
  Quick Add
</BuyButton>
```
