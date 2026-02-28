# QuantitySelector

## Intention
Stepper control for selecting product quantities with increment/decrement buttons.

## Description
QuantitySelector provides an intuitive interface for numeric quantity selection. It features decrement and increment buttons flanking a centered input field, with automatic bounds validation, optional unit multipliers (for bulk quantities), and keyboard support. Ideal for cart items and product quantity selection.

In ecommerce, quantity selectors are essential for adding products to cart and managing cart item quantities.

## Import
```tsx
import { QuantitySelector } from '@faststore/components'
```

## Props

| Name | Type | Default | Required | Description |
|------|------|---------|----------|-------------|
| `testId` | `string` | `'fs-quantity-selector'` | No | ID for testing tools |
| `min` | `number` | `1` | No | Minimum allowed quantity |
| `max` | `number` | - | No | Maximum allowed quantity |
| `initial` | `number` | `min` | No | Initial quantity value |
| `unitMultiplier` | `number` | `1` | No | Unit multiplier for bulk quantities |
| `useUnitMultiplier` | `boolean` | `false` | No | Enable unit multiplier display |
| `disabled` | `boolean` | `false` | No | Disable entire selector |
| `onChange` | `(value: number) => void` | - | No | Fires when quantity changes (real-time) |
| `onValidateBlur` | `(min: number, max: number, quantity: number) => void` | - | No | Fires when input loses focus with validation |

## Unit Multiplier

For products sold in bulk (e.g., packages, cases):
- **`unitMultiplier={12}`**: Each quantity represents 12 units
- **`useUnitMultiplier={true}`**: Display shows multiplied value
- Example: Quantity 2 with multiplier 12 displays "24"

## Validation

- **Min/Max Bounds**: Values automatically clamped to valid range
- **Blur Validation**: Input validates on blur, rounding up to unit multiplier if needed
- **Button States**: Decrement disabled at min, increment disabled at max
- **Numeric Only**: Non-numeric input automatically filtered

## Sub-components

Composed of:
- [IconButton](./IconButton.md) - For increment/decrement
- [Input](../atoms/Input.md) - For direct quantity entry
- [Icon](../atoms/Icon.md) - Plus/Minus icons

## Accessibility

- Uses semantic form controls
- **Keyboard**:
  - **Tab**: Navigate between buttons and input
  - **Arrow keys**: Increment/decrement when focused on input
  - **Type**: Direct numeric entry
- ARIA attributes:
  - Buttons: `aria-label`, `aria-controls` 
  - Input: `aria-label="Quantity"`
- Screen readers announce current quantity and bounds
- Disabled state communicated to assistive tech

## CSS Custom Properties

```scss
--fs-quantity-selector-width: auto
--fs-quantity-selector-gap: var(--fs-spacing-0)
--fs-quantity-selector-border-radius: var(--fs-border-radius)

// Input
--fs-quantity-selector-input-width: var(--fs-spacing-7)
--fs-quantity-selector-input-text-align: center

// Buttons
--fs-quantity-selector-button-size: var(--fs-spacing-5)
--fs-quantity-selector-button-bkg-color: transparent
--fs-quantity-selector-button-border-color: var(--fs-border-color)
```

## Data Attributes

```tsx
<div
  data-fs-quantity-selector="true"  // "disabled" when disabled
  data-testid="fs-quantity-selector"
>
  <IconButton data-quantity-selector-button="left" />
  <Input data-quantity-selector-input />
  <IconButton data-quantity-selector-button="right" />
</div>
```

## Best Practices

### Do's
✅ Set appropriate min/max for stock limits  
✅ Show current stock availability nearby  
✅ Provide immediate feedback on change  
✅ Disable when product unavailable  
✅ Allow direct input for large quantities  
✅ Validate on blur for better UX

### Don'ts
❌ Don't allow quantities beyond stock  
❌ Don't validate on every keystroke  
❌ Don't hide min/max constraints  
❌ Don't make buttons too small  
❌ Don't forget loading states when updating cart

### onChange vs onValidateBlur

- **`onChange`**: Real-time updates (UI state)
  - Update displayed value
  - Enable/disable buttons
  - Calculate totals

- **`onValidateBlur`**: Finalized value (API calls)
  - Update cart quantity
  - Trigger API requests
  - Show validation errors

## Related Components

- [Input](../atoms/Input.md) - For quantity input field
- [IconButton](./IconButton.md) - For increment/decrement buttons
- [BuyButton](./BuyButton.md) - Often paired with quantity selector

## Examples

### Basic Usage
```tsx
const [quantity, setQuantity] = useState(1)

<QuantitySelector
  min={1}
  max={10}
  initial={1}
  onChange={setQuantity}
/>
```

### With Stock Limit
```tsx
<div>
  <QuantitySelector
    min={1}
    max={product.stock}
    initial={1}
    onChange={handleQuantityChange}
  />
  <small>{product.stock} available</small>
</div>
```

### In Product Page
```tsx
const [quantity, setQuantity] = useState(1)

<div style={{ display: 'flex', gap: '16px' }}>
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

### Bulk Quantities (Unit Multiplier)
```tsx
{/* Sold in packs of 12 */}
<div>
  <label>Quantity (packs of 12)</label>
  <QuantitySelector
    min={1}
    max={10}
    initial={1}
    unitMultiplier={12}
    useUnitMultiplier={true}
    onChange={(packs) => setTotalUnits(packs * 12)}
  />
  <small>Total: {totalUnits} units</small>
</div>
```

### In Cart Item
```tsx
<article>
  <img src={item.image} alt={item.name} />
  <div>
    <h3>{item.name}</h3>
    <QuantitySelector
      min={1}
      max={item.stock}
      initial={item.quantity}
      onChange={(qty) => updateCartQuantity(item.id, qty)}
      onValidateBlur={(min, max, qty) => {
        if (qty > max) {
          showError(`Only ${max} available`)
        }
      }}
    />
    <Price value={item.price * item.quantity} formatter={formatPrice} />
  </div>
  <IconButton
    icon={<Icon name="Trash" />}
    aria-label="Remove item"
    onClick={() => removeItem(item.id)}
  />
</article>
```

### Disabled State
```tsx
<QuantitySelector
  min={1}
  max={10}
  initial={1}
  disabled
/>
```

### With Validation
```tsx
const [quantity, setQuantity] = useState(1)
const [error, setError] = useState('')

<div>
  <QuantitySelector
    min={1}
    max={product.stock}
    initial={quantity}
    onChange={setQuantity}
    onValidateBlur={(min, max, qty) => {
      if (qty > max) {
        setError(`Maximum ${max} items available`)
      } else if (qty < min) {
        setError(`Minimum ${min} item required`)
      } else {
        setError('')
      }
    }}
  />
  {error && <span role="alert">{error}</span>}
</div>
```

### Mobile Optimized
```tsx
<QuantitySelector
  min={1}
  max={99}
  initial={1}
  onChange={setQuantity}
  style={{
    '--fs-quantity-selector-button-size': '48px',  // Larger touch targets
    '--fs-quantity-selector-input-width': '60px',
  }}
/>
```

### With Price Calculation
```tsx
const [quantity, setQuantity] = useState(1)
const totalPrice = product.price * quantity

<div>
  <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
    <span>Quantity:</span>
    <QuantitySelector
      min={1}
      max={product.stock}
      initial={1}
      onChange={setQuantity}
    />
  </div>
  
  <div>
    <span>Unit Price: </span>
    <Price value={product.price} formatter={formatPrice} />
  </div>
  
  <div>
    <strong>Total: </strong>
    <Price value={totalPrice} formatter={formatPrice} />
  </div>
</div>
```

### Controlled with External Buttons
```tsx
const [quantity, setQuantity] = useState(1)

<div>
  <QuantitySelector
    min={1}
    max={10}
    initial={quantity}
    onChange={setQuantity}
  />
  
  <Button onClick={() => setQuantity(1)}>
    Reset to 1
  </Button>
</div>
```
