# ProductDetailsSettings (Matter UI)

## Intention
PDP settings composition (variants, quantity, add to cart).

## Description
Composes SkuSelector, QuantitySelector, and BuyButton with cart integration.

## Import
```tsx
import { ProductDetailsSettings } from 'src/components/ui/ProductDetails'
```

## Architecture

```
ProductDetailsSettings
├── SkuSelector (variant selection)
├── QuantitySelector  
├── BuyButton (with analytics)
└── Cart store integration
```

## Examples

```tsx
<ProductDetailsSettings
  product={productData}
  onAddToCart={handleAddToCart}
/>
```
