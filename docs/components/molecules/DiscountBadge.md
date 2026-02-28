# DiscountBadge

## Intention
Display discount percentage with dynamic severity styling.

## Description
DiscountBadge calculates and displays the discount percentage between list and spot prices. It automatically categorizes discounts as low, medium, or high based on configurable thresholds, applying appropriate styling. Returns empty if no discount exists.

In ecommerce, discount badges highlight savings on product cards, search results, and promotional sections.

## Import
```tsx
import { DiscountBadge } from '@faststore/components'
```

## Props

| Name | Type | Default | Required | Description |
|------|------|---------|----------|-------------|
| `testId` | `string` | `'fs-discount-badge'` | No | ID for testing tools |
| `listPrice` | `number` | - | Yes | Original price before discount |
| `spotPrice` | `number` | - | Yes | Current discounted price |
| `thresholdLow` | `number` | `15` | No | Percentage threshold for low discount |
| `thresholdHigh` | `number` | `40` | No | Percentage threshold for high discount |
| `size` | `'small' \| 'big'` | - | No | Badge size variant |

Extends `BadgeProps` excluding variant, counter, and aria-label.

## Discount Calculation

```tsx
discountPercent = Math.floor(((listPrice - spotPrice) / listPrice) * 100)
```

Returns empty fragment (`<></>`) if discount is 0.

## Variants

Discount severity variants (applied automatically):

- **`low`**: ≤ thresholdLow (default ≤15%)
  - Subtle emphasis
  
- **`medium`**: > thresholdLow and ≤ thresholdHigh (16-40%)
  - Moderate emphasis
  
- **`high`**: > thresholdHigh (>40%)
  - Strong emphasis for significant discounts

## Sub-components

Uses [Badge](../atoms/Badge.md) component internally.

## Accessibility

- Uses Badge accessibility features
- Percentage value provides clear context
- Color-coded but not relying on color alone (text always visible)
- Consider adding ARIA label for screen readers if needed

## CSS Custom Properties

Inherits from Badge with additional custom variants:

```scss
// Low Discount (≤15%)
--fs-discount-badge-low-bkg-color: var(--fs-color-warning-bkg)
--fs-discount-badge-low-text-color: var(--fs-color-warning-text)

// Medium Discount (16-40%)
--fs-discount-badge-medium-bkg-color: var(--fs-color-success-bkg)
--fs-discount-badge-medium-text-color: var(--fs-color-success-text)

// High Discount (>40%)
--fs-discount-badge-high-bkg-color: var(--fs-color-highlighted-bkg)
--fs-discount-badge-high-text-color: var(--fs-color-highlighted-text)
```

## Data Attributes

```tsx
<Badge
  data-fs-discount-badge
  data-fs-discount-badge-variant="medium"  // low, medium, high
  data-testid="fs-discount-badge"
>
  25% off
</Badge>
```

## Best Practices

### Do's
✅ Display near product price for context  
✅ Use consistent thresholds across the site  
✅ Show with ProductPrice component  
✅ Hide when no discount exists (automatic)  
✅ Consider badge size based on layout

### Don'ts
❌ Don't show when discount is 0 or negative  
❌ Don't use different thresholds inconsistently  
❌ Don't show without nearby price information  
❌ Don't calculate manually (component handles it)

### Threshold Guidelines

**Default Thresholds (recommended):**
- Low: ≤15% (modest savings)
- Medium: 16-40% (good deal)
- High: >40% (exceptional value)

**Adjust based on industry:**
- Fashion: Lower thresholds (frequent sales)
- Electronics: Higher thresholds (less discounting)
- Luxury: Very high thresholds (rare discounts)

## Related Components

- [Badge](../atoms/Badge.md) - Base badge component
- [ProductPrice](./ProductPrice.md) - Shows prices with discounts
- [ProductCard](./ProductCard.md) - Often includes discount badges

## Examples

### Basic Usage
```tsx
<DiscountBadge
  listPrice={100}
  spotPrice={80}
/>
// Displays: 20% off (medium variant)
```

### With Custom Thresholds
```tsx
<DiscountBadge
  listPrice={100}
  spotPrice={90}
  thresholdLow={10}
  thresholdHigh={30}
/>
// 10% discount = low variant (≤10%)
```

### No Discount (Returns Empty)
```tsx
<DiscountBadge
  listPrice={50}
  spotPrice={50}
/>
// Renders nothing
```

### On Product Card
```tsx
<article>
  <div style={{ position: 'relative' }}>
    <img src={product.image} alt={product.name} />
    <DiscountBadge
      listPrice={product.listPrice}
      spotPrice={product.price}
      style={{
        position: 'absolute',
        top: '8px',
        right: '8px',
      }}
    />
  </div>
  
  <h3>{product.name}</h3>
  
  <ProductPrice
    value={product.price}
    listPrice={product.listPrice}
    formatter={formatPrice}
  />
</article>
```

### Size Variants
```tsx
<DiscountBadge
  listPrice={200}
  spotPrice={120}
  size="small"
/>

<DiscountBadge
  listPrice={200}
  spotPrice={120}
  size="big"
/>
```

### Discount Severity Examples
```tsx
{/* Low Discount (10%) */}
<DiscountBadge
  listPrice={100}
  spotPrice={90}
/>

{/* Medium Discount (25%) */}
<DiscountBadge
  listPrice={100}
  spotPrice={75}
/>

{/* High Discount (50%) */}
<DiscountBadge
  listPrice={100}
  spotPrice={50}
/>
```

### In Product Grid
```tsx
{products.map((product) => (
  <div key={product.id}>
    <DiscountBadge
      listPrice={product.listPrice}
      spotPrice={product.price}
    />
    <img src={product.image} alt={product.name} />
    <h4>{product.name}</h4>
    <ProductPrice
      value={product.price}
      listPrice={product.listPrice}
      formatter={formatPrice}
    />
  </div>
))}
```

### With Conditional Rendering
```tsx
{product.price < product.listPrice && (
  <DiscountBadge
    listPrice={product.listPrice}
    spotPrice={product.price}
  />
)}
```

### Flash Sale Badge
```tsx
<DiscountBadge
  listPrice={299.99}
  spotPrice={149.99}
  thresholdHigh={30}
  size="big"
/>
// 50% off - Displays as high variant
```

### Clearance Section
```tsx
<section aria-label="Clearance Items">
  <h2>Up to 70% Off</h2>
  {clearanceProducts.map((product) => (
    <article key={product.id}>
      <DiscountBadge
        listPrice={product.listPrice}
        spotPrice={product.price}
        thresholdHigh={50}  // Higher threshold for clearance
      />
      {/* Product details */}
    </article>
  ))}
</section>
```
