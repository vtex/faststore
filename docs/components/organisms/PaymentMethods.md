# PaymentMethods

## Intention
Display available payment methods and icons.

## Description
PaymentMethods shows accepted payment options with icons (Visa, Mastercard, PayPal, etc.). Used in footer, checkout, and product pages.

## Import
```tsx
import { PaymentMethods } from '@faststore/components'
```

## Examples

```tsx
<PaymentMethods
  methods={[
    { name: 'Visa', icon: <Icon name="Visa" /> },
    { name: 'Mastercard', icon: <Icon name="Mastercard" /> },
    { name: 'PayPal', icon: <Icon name="PayPal" /> },
  ]}
/>
```
