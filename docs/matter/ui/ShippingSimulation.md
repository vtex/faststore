# ShippingSimulation (Matter UI)

## Intention
Shipping calculator with API integration.

## Description
UI wrapper for ShippingSimulation with shipping API calls and result formatting.

## Import
```tsx
import { ShippingSimulation } from 'src/components/ui/ShippingSimulation'
```

## Data Integration

- Shipping calculation API
- Postal code validation
- Session integration

## Extends

[ShippingSimulation (Foundational)](../../components/organisms/ShippingSimulation.md)

## Examples

```tsx
<ShippingSimulation
  productId={product.id}
  onCalculate={fetchShippingOptions}
/>
```
