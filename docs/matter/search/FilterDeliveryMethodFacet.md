# FilterDeliveryMethodFacet (Matter)

## Intention
Filter products by delivery method.

## Description
Specialized filter facet for delivery methods (pickup, shipping, etc.).

## Import
```tsx
import FilterDeliveryMethodFacet from 'src/components/search/Filter/FilterDeliveryMethodFacet'
```

## Examples

```tsx
<FilterDeliveryMethodFacet
  options={['Pickup', 'Delivery', 'Express']}
  selected={selectedMethod}
  onChange={setDeliveryMethod}
/>
```
