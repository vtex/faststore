# OutOfStock

## Intention
Display out-of-stock notification with email alert option.

## Description
OutOfStock shows when product is unavailable and optionally allows users to request email notification when back in stock.

## Import
```tsx
import { OutOfStock } from '@faststore/components'
```

## Examples

```tsx
<OutOfStock
  title="Out of Stock"
  subtitle="This item is currently unavailable"
  onNotifyMe={handleEmailNotification}
/>
```
