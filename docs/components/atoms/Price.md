# Price

## Intention
Display formatted prices with semantic variants and accessibility support.

## Description
Price is a specialized component for displaying monetary values with proper formatting, currency symbols, and semantic meaning. It supports multiple price types (selling, listing, savings, installments) and accepts custom formatter functions for internationalization.

In ecommerce, prices are critical elements for product display, cart totals, discounts, and checkout flows.

## Import
```tsx
import { Price } from '@faststore/components'
```

## Props

| Name | Type | Default | Required | Description |
|------|------|---------|----------|-------------|
| `testId` | `string` | `'fs-price'` | No | ID for testing tools |
| `as` | `ElementType` | `'span'` | No | HTML element to render as |
| `value` | `number` | - | Yes | Raw price value (numeric) |
| `variant` | `'selling' \| 'listing' \| 'spot' \| 'savings' \| 'installment'` | `'selling'` | No | Semantic price variant |
| `formatter` | `function` | `(price) => price` | No | Function to format price (currency, locale, etc.) |
| `SRText` | `string` | - | No | Screen reader only text for context |

Note: `children` prop is not used - price is rendered via `formatter` function.

## Variants

### Price Types

- **`selling`**: Current selling price (primary price)
  - Use for: Main product price, cart item price

- **`listing`**: Original/list price before discount
  - Use for: Strike-through "was" price
  - Often shown alongside `selling` price

- **`spot`**: Cash/immediate payment price
  - Use for: Special cash price, quick payment discount

- **`savings`**: Amount saved from discount
  - Use for: "You save $X" messages
  - Calculated as (listing - selling)

- **`installment`**: Installment payment amount
  - Use for: "3x of $X" payment plans

## Formatting

### Custom Formatter Function

```tsx
type PriceFormatter = (price: number, variant: PriceVariant) => ReactNode

// Example formatter
const formatPrice = (price, variant) => {
  const formatted = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  }).format(price)
  
  return formatted
}

<Price value={29.99} formatter={formatPrice} />
```

## Accessibility

- Uses semantic HTML element (default `<span>`)
- **Screen readers**: Use `SRText` prop to provide context
  - Example: `SRText="Current price"`
  - Important for understanding price role
- Price variant provides semantic meaning via data attribute
- Ensure sufficient color contrast for discounted/savings prices

## CSS Custom Properties

```scss
// Selling Price (primary)
--fs-price-selling-text-color: var(--fs-color-text)
--fs-price-selling-text-size: var(--fs-text-size-base)
--fs-price-selling-text-weight: var(--fs-text-weight-bold)

// Listing Price (strikethrough)
--fs-price-listing-text-color: var(--fs-color-text-light)
--fs-price-listing-text-decoration: line-through
--fs-price-listing-text-size: var(--fs-text-size-small)

// Savings
--fs-price-savings-text-color: var(--fs-color-success-text)
--fs-price-savings-text-weight: var(--fs-text-weight-bold)

// Installment
--fs-price-installment-text-size: var(--fs-text-size-small)
--fs-price-installment-text-color: var(--fs-color-text-light)
```

## Data Attributes

```tsx
<span
  data-fs-price
  data-fs-price-variant="selling"
  data-testid="fs-price"
>
  {formattedPrice}
</span>
```

## Best Practices

### Do's
✅ Use appropriate variant for price type  
✅ Provide formatter for consistent currency display  
✅ Include SRText for screen reader context  
✅ Show both listing and selling prices for discounts  
✅ Use correct HTML element (span for inline, div for block)  
✅ Ensure prices are visually prominent

### Don'ts
❌ Don't hardcode currency symbols  
❌ Don't format prices inconsistently  
❌ Don't show only savings without context  
❌ Don't use images for prices (accessibility issue)  
❌ Don't forget to handle decimal places correctly

### Price Display Patterns

**Product Card**
```tsx
<div>
  <Price value={19.99} variant="listing" />
  <Price value={14.99} variant="selling" />
  <Price value={5.00} variant="savings" />
</div>
```

**Simple Price**
```tsx
<Price value={29.99} />
```

**Installments**
```tsx
<span>3x of <Price value={9.99} variant="installment" /></span>
```

## Related Components

- [ProductPrice](../molecules/ProductPrice.md) - Complete price display with multiple variants
- [DiscountBadge](../molecules/DiscountBadge.md) - Shows discount percentage
- [OrderSummary](../molecules/OrderSummary.md) - Uses Price for totals

## Examples

### Basic Price
```tsx
<Price value={29.99} />
```

### Formatted Price
```tsx
const formatUSD = (price) => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  }).format(price)
}

<Price value={29.99} formatter={formatUSD} />
// Output: $29.99
```

### Price with Discount
```tsx
<div>
  <Price
    value={39.99}
    variant="listing"
    formatter={formatUSD}
    SRText="Original price"
  />
  <Price
    value={29.99}
    variant="selling"
    formatter={formatUSD}
    SRText="Current price"
  />
</div>
```

### Savings Price
```tsx
<Price
  value={10.00}
  variant="savings"
  formatter={formatUSD}
  SRText="Amount saved"
/>
```

### International Formatting
```tsx
const formatEUR = (price) => {
  return new Intl.NumberFormat('de-DE', {
    style: 'currency',
    currency: 'EUR',
  }).format(price)
}

<Price value={29.99} formatter={formatEUR} />
// Output: 29,99 €
```

### Installment Price
```tsx
<div>
  <span>or 3x of </span>
  <Price
    value={9.99}
    variant="installment"
    formatter={formatUSD}
  />
</div>
```

### As Different Element
```tsx
<Price
  as="div"
  value={149.99}
  formatter={formatUSD}
/>
```

### With Custom Formatting
```tsx
const customFormat = (price, variant) => {
  const formatted = formatUSD(price)
  
  if (variant === 'savings') {
    return `Save ${formatted}`
  }
  
  return formatted
}

<Price value={10.00} variant="savings" formatter={customFormat} />
// Output: Save $10.00
```

### Range Pricing
```tsx
<span>
  <Price value={19.99} formatter={formatUSD} />
  {' - '}
  <Price value={49.99} formatter={formatUSD} />
</span>
```
