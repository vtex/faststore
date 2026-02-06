# CartItem (Matter)

## Intention
Cart line item with analytics, state management, and data integration.

## Description
Matter CartItem extends the foundational CartItem with cart store integration, analytics events, price formatting, and quantity management. Automatically tracks add/remove from cart events and manages cart state through the SDK.

## Architecture

```
CartItem (Matter)
├── useRemoveButton hook (cart SDK)
├── useCartItemEvent hook (analytics)
├── useFormattedPrice hook (formatting)
├── useSession hook (currency)
├── cartStore (state management)
└── UICartItem (foundational component)
    ├── UICartItemImage (Next.js Image)
    └── UICartItemSummary (variants, quantity, price)
```

## Import
```tsx
import CartItem from 'src/components/cart/CartItem'
```

## Props

| Name | Type | Default | Required | Description |
|------|------|---------|----------|-------------|
| `item` | `ICartItem` | - | Yes | Cart item object from cart store |
| `useUnitMultiplier` | `boolean` | `false` | No | Display unit multiplier for bulk items |
| `taxesConfiguration` | `object` | - | No | Tax display configuration |
| `taxesConfiguration.usePriceWithTaxes` | `boolean` | - | No | Show prices including taxes |
| `taxesConfiguration.taxesLabel` | `string` | - | No | Label for tax information |

## Data Integration

### SDK Hooks
- **`useRemoveButton`**: Generates remove button props with cart update
- **`useFormattedPrice`**: Formats prices with currency and locale
- **`useSession`**: Provides currency code for analytics
- **`cartStore`**: Global cart state management

### Cart Item Structure
```tsx
interface ICartItem {
  id: string
  quantity: number
  price: number
  listPrice: number
  priceWithTaxes?: number
  listPriceWithTaxes?: number
  seller: { identifier: string }
  itemOffered: {
    sku: string
    name: string
    image: Array<{ url: string, alternateName: string }>
    brand: { name: string }
    unitMultiplier?: number
    isVariantOf: {
      name: string
      productGroupID: string
      skuVariants: { activeVariations: Record<string, string> }
    }
  }
}
```

## Analytics Events

### add_to_cart
Fired when quantity increases:
```tsx
{
  name: 'add_to_cart',
  params: {
    currency: 'USD',
    value: item.price * quantityDelta,
    items: [{
      item_id: productGroupID,
      item_name: productName,
      item_brand: brandName,
      item_variant: sku,
      quantity: quantityDelta,
      price: item.price,
      discount: item.listPrice - item.price,
      currency: 'USD',
      item_variant_name: variantName,
      product_reference_id: gtin
    }]
  }
}
```

### remove_from_cart
Fired when quantity decreases:
- Same structure as add_to_cart with negative quantity delta

## Hooks Used

- `useRemoveButton(item)` - Remove button functionality
- `useCartItemEvent()` - Analytics event sender (custom hook)
- `useFormattedPrice` - Price formatting
- `useSession()` - Session data (currency)

## Extends

[CartItem (Foundational)](../../components/molecules/CartItem.md) from `@faststore/ui`

## Best Practices

### When to use Matter CartItem
✅ Building on FastStore architecture  
✅ Need automatic analytics tracking  
✅ Using cartStore for state  
✅ Need formatted prices with taxes

### When to use Foundational CartItem
✅ Custom cart implementation  
✅ Different state management  
✅ Custom analytics provider  
✅ Non-VTEX platform

### Performance Considerations
- Analytics events are loaded dynamically (code splitting)
- Price formatting memoized
- Cart updates are debounced in cartStore

## Examples

### Basic Usage
```tsx
import CartItem from 'src/components/cart/CartItem'

{cartItems.map(item => (
  <CartItem key={item.id} item={item} />
))}
```

### With Taxes
```tsx
<CartItem
  item={cartItem}
  taxesConfiguration={{
    usePriceWithTaxes: true,
    taxesLabel: 'Tax included'
  }}
/>
```

### With Unit Multiplier (bulk items)
```tsx
<CartItem
  item={bulkItem}
  useUnitMultiplier={true}
/>
// Displays: 2 packs × 12 units = 24 units
```

### In Cart List
```tsx
<div role="list" aria-label="Shopping cart items">
  {cart.items.map(item => (
    <CartItem
      key={item.id}
      item={item}
      taxesConfiguration={taxConfig}
    />
  ))}
</div>
```

### With Data Attributes
Cart items include tracking attributes:
```tsx
<UICartItem
  data-sku="SKU-12345"
  data-seller="seller-id"
>
  {/* Content */}
</UICartItem>
```

## Related Matter Components

- [CartSidebar](./CartSidebar.md) - Contains CartItem components
- [EmptyCart](./EmptyCart.md) - Empty cart state
- [OrderSummary](./OrderSummary.md) - Cart totals
