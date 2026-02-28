# ProductPrice

## Intention
Display product pricing with automatic discount visualization.

## Description
ProductPrice is a smart component that displays product prices with automatic handling of list prices and discounts. It shows both listing (original) and selling (current) prices when they differ, or just the selling price when there's no discount. Screen reader support provides clear price context.

In ecommerce, ProductPrice is essential for product cards, PDPs, and anywhere product pricing is displayed.

## Import
```tsx
import { ProductPrice } from '@faststore/components'
```

## Props

| Name | Type | Default | Required | Description |
|------|------|---------|----------|-------------|
| `testId` | `string` | `'fs-product-price'` | No | ID for testing tools |
| `value` | `number` | - | Yes | Current selling price |
| `listPrice` | `number` | - | Yes | Original/list price before discount |
| `formatter` | `PriceFormatter` | - | No | Custom price formatting function |

Extends `HTMLAttributes<HTMLDivElement>` for additional div attributes.

## Pricing Logic

The component automatically determines what to display:

- **No Discount**: Shows only selling price
  - `value === listPrice` OR `listPrice === 0`
  
- **With Discount**: Shows both listing (strikethrough) and selling prices
  - `value !== listPrice` AND `listPrice !== 0`

## Sub-components

Composed of [Price](../atoms/Price.md) components:
- **Listing Price**: `variant="listing"` (strikethrough styling)
- **Selling Price**: `variant="spot"` (prominent display)

## Accessibility

- Uses semantic HTML structure
- **Screen Reader Text**:
  - Listing price: "Original price: $X"
  - Selling price: "Price: $X"
- Both prices announced for discounted products
- Single price announced when no discount

## CSS Custom Properties

```scss
--fs-product-price-gap: var(--fs-spacing-1)

// Listing Price (strikethrough)
--fs-product-price-listing-color: var(--fs-color-text-light)
--fs-product-price-listing-size: var(--fs-text-size-small)
--fs-product-price-listing-decoration: line-through

// Selling Price (current)
--fs-product-price-value-color: var(--fs-color-text)
--fs-product-price-value-size: var(--fs-text-size-lead)
--fs-product-price-value-weight: var(--fs-text-weight-bold)
```

## Data Attributes

```tsx
<div data-fs-product-price data-testid="fs-product-price">
  {/* With discount */}
  <Price variant="listing" data-value={listPrice} />
  <Price variant="spot" data-value={sellingPrice} />
  
  {/* OR without discount */}
  <Price variant="spot" data-value={sellingPrice} />
</div>
```

## Best Practices

### Do's
✅ Always provide both value and listPrice  
✅ Use custom formatter for consistent currency display  
✅ Show savings amount/percentage nearby  
✅ Use appropriate parent spacing/layout  
✅ Pair with DiscountBadge for visual discount indicator

### Don'ts
❌ Don't pass 0 for both values  
❌ Don't make selling price higher than list price  
❌ Don't use different formatters in same UI context  
❌ Don't forget to show currency symbol

## Related Components

- [Price](../atoms/Price.md) - Base price component
- [DiscountBadge](./DiscountBadge.md) - Shows discount percentage
- [ProductCard](./ProductCard.md) - Uses ProductPrice for display

## Examples

### Basic Usage (No Discount)
```tsx
const formatUSD = (price) => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  }).format(price)
}

<ProductPrice
  value={29.99}
  listPrice={29.99}
  formatter={formatUSD}
/>
// Displays: $29.99
```

### With Discount
```tsx
<ProductPrice
  value={24.99}
  listPrice={39.99}
  formatter={formatUSD}
/>
// Displays: $39.99 (strikethrough) $24.99
```

### On Product Card
```tsx
<article>
  <img src={productImage} alt={productName} />
  <h3>{productName}</h3>
  
  <ProductPrice
    value={product.price}
    listPrice={product.listPrice}
    formatter={formatPrice}
  />
  
  {product.price < product.listPrice && (
    <DiscountBadge
      listPrice={product.listPrice}
      spotPrice={product.price}
    />
  )}
  
  <Button>Add to Cart</Button>
</article>
```

### International Formatting
```tsx
const formatEUR = (price) => {
  return new Intl.NumberFormat('de-DE', {
    style: 'currency',
    currency: 'EUR',
  }).format(price)
}

<ProductPrice
  value={24.99}
  listPrice={39.99}
  formatter={formatEUR}
/>
// Displays: 39,99 € 24,99 €
```

### In Product Grid
```tsx
{products.map((product) => (
  <div key={product.id}>
    <Link href={`/product/${product.slug}`}>
      {product.name}
    </Link>
    <ProductPrice
      value={product.price}
      listPrice={product.listPrice}
      formatter={formatPrice}
    />
  </div>
))}
```

### With Layout Styling
```tsx
<ProductPrice
  value={99.99}
  listPrice={149.99}
  formatter={formatUSD}
  style={{
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'flex-start',
    gap: '4px',
  }}
/>
```

### Out of Stock (Special Price Display)
```tsx
{product.inStock ? (
  <ProductPrice
    value={product.price}
    listPrice={product.listPrice}
    formatter={formatPrice}
  />
) : (
  <span>Out of Stock</span>
)}
```

### Price Range (use multiple Price components instead)
```tsx
{/* For price ranges, use Price components directly */}
<div>
  <Price value={19.99} formatter={formatUSD} />
  {' - '}
  <Price value={49.99} formatter={formatUSD} />
</div>
```

### With Taxes Label
```tsx
<div>
  <ProductPrice
    value={29.99}
    listPrice={39.99}
    formatter={formatUSD}
  />
  <small>Tax included</small>
</div>
```
