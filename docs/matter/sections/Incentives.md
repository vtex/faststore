# Incentives Section (Matter)

## Intention
CMS-configurable benefits/incentives bar.

## Description
Displays store incentives like free shipping, returns, guarantees. Horizontally scrolling on mobile.

## Import
```tsx
import Incentives from 'src/components/sections/Incentives'
```

## CMS Configuration

```tsx
{
  incentives: {
    type: 'array',
    items: {
      icon: { type: 'string' },
      title: { type: 'string' },
      description: { type: 'string' }
    }
  }
}
```

## Examples

```tsx
<Incentives
  items={[
    { icon: 'Truck', title: 'Free Shipping', description: 'Orders over $50' },
    { icon: 'RefreshCw', title: 'Easy Returns', description: '30 days' }
  ]}
/>
```
