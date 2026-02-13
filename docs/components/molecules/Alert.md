# Alert

## Intention
Display important messages and notifications with optional actions and dismissal.

## Description
Alert is a notification component for displaying important information, warnings, or success messages to users. It supports custom icons, inline links, and optional dismiss functionality. Alerts use `role="alert"` for immediate screen reader announcement.

In ecommerce, alerts notify users of promotions, shipping updates, errors, confirmations, and important information.

## Import
```tsx
import { Alert } from '@faststore/components'
```

## Props

| Name | Type | Default | Required | Description |
|------|------|---------|----------|-------------|
| `testId` | `string` | `'fs-alert'` | No | ID for testing tools |
| `icon` | `ReactNode` | - | No | Custom icon component |
| `dismissible` | `boolean` | `false` | No | Enables close button |
| `link` | `LinkProps` | - | No | Inline link configuration |
| `onClose` | `(event: MouseEvent) => void` | - | No | Callback when dismissed |
| `children` | `ReactNode` | - | Yes | Alert message content |

Extends `HTMLAttributes<HTMLDivElement>` excluding `role`.

## Features

### Icon
Optional icon for visual categorization (info, warning, success, error).

### Link
Inline action link within alert message.

### Dismissible
Close button allows users to hide the alert.

## Sub-components

Composed of:
- [Icon](../atoms/Icon.md) - For alert icons and close button
- [IconButton](./IconButton.md) - For dismiss action
- [Link](../atoms/Link.md) - For inline actions

## Accessibility

- Uses `role="alert"` for immediate announcement
- **Screen Readers**: Automatically announce alert when displayed
- **Dismissible**: Close button has `aria-label="Close"`
- **Links**: Proper link semantics maintained
- **Focus Management**: Consider focusing alert for important messages

## CSS Custom Properties

```scss
--fs-alert-padding: var(--fs-spacing-2) var(--fs-spacing-3)
--fs-alert-border-radius: var(--fs-border-radius)
--fs-alert-border-width: var(--fs-border-width)
--fs-alert-gap: var(--fs-spacing-2)

// Colors (define per variant)
--fs-alert-bkg-color: var(--fs-color-neutral-bkg)
--fs-alert-text-color: var(--fs-color-text)
--fs-alert-border-color: var(--fs-border-color)
--fs-alert-icon-color: var(--fs-color-primary)
```

## Data Attributes

```tsx
<div
  role="alert"
  data-fs-alert
  data-fs-alert-dismissible="false"
  data-fs-content="alert"
  data-testid="fs-alert"
>
  {icon}
  <p data-fs-alert-content>{children}</p>
  {link && <Link data-fs-alert-link />}
  {dismissible && <IconButton data-fs-alert-button />}
</div>
```

## Best Practices

### Do's
✅ Use for important, actionable information  
✅ Keep messages concise and scannable  
✅ Provide dismiss option for non-critical alerts  
✅ Use appropriate icons for context  
✅ Place alerts where users expect them  
✅ Limit to one or two alerts at a time

### Don'ts
❌ Don't use for every message (creates alert fatigue)  
❌ Don't hide critical errors in dismissible alerts  
❌ Don't use without clear message  
❌ Don't stack too many alerts  
❌ Don't rely on color alone for meaning

### Alert Types

**Informational**: General information, tips
```tsx
<Alert icon={<Icon name="Info" />}>
  Free shipping on orders over $50
</Alert>
```

**Success**: Confirmations, completions
```tsx
<Alert icon={<Icon name="CheckCircle" />}>
  Item added to cart successfully
</Alert>
```

**Warning**: Cautions, attention needed
```tsx
<Alert icon={<Icon name="AlertTriangle" />}>
  Only 2 items left in stock
</Alert>
```

**Error**: Problems, failures
```tsx
<Alert icon={<Icon name="XCircle" />}>
  Payment failed. Please try again.
</Alert>
```

## Related Components

- [Toast](./Toast.md) - Temporary auto-dismissing notifications
- [Modal](./Modal.md) - For alerts requiring user action
- [Banner](../../organisms/BannerText.md) - For promotional messages

## Examples

### Basic Alert
```tsx
<Alert>
  Welcome! New users get 15% off their first order.
</Alert>
```

### With Icon
```tsx
<Alert icon={<Icon name="Info" />}>
  This product ships within 2-3 business days.
</Alert>
```

### Dismissible Alert
```tsx
const [showAlert, setShowAlert] = useState(true)

{showAlert && (
  <Alert
    dismissible
    onClose={() => setShowAlert(false)}
  >
    This is a dismissible alert message.
  </Alert>
)}
```

### With Link
```tsx
<Alert
  icon={<Icon name="Info" />}
  link={{
    children: 'Learn more',
    href: '/shipping-policy'
  }}
>
  Standard shipping takes 5-7 days.
</Alert>
```

### Success Alert
```tsx
<Alert icon={<Icon name="CheckCircle" />}>
  Your order has been placed successfully!
</Alert>
```

### Error Alert
```tsx
<Alert icon={<Icon name="XCircle" />}>
  Unable to process payment. Please check your card details.
</Alert>
```

### Warning Alert
```tsx
<Alert icon={<Icon name="AlertTriangle" />}>
  Sale ends in 2 hours! Don't miss out.
</Alert>
```

### Cart Alert
```tsx
<Alert
  icon={<Icon name="ShoppingCart" />}
  dismissible
  onClose={handleDismiss}
>
  You have items waiting in your cart.
</Alert>
```

### Promotional Banner
```tsx
<Alert
  icon={<Icon name="Tag" />}
  link={{
    children: 'Shop now',
    href: '/sale'
  }}
>
  Flash Sale: Up to 50% off on selected items!
</Alert>
```

### Stock Warning
```tsx
{product.stock < 5 && (
  <Alert icon={<Icon name="AlertTriangle" />}>
    Only {product.stock} items left in stock!
  </Alert>
)}
```

### Multiple Actions
```tsx
<Alert
  icon={<Icon name="Info" />}
  link={{
    children: 'View details',
    href: '/order/123'
  }}
  dismissible
  onClose={handleDismiss}
>
  Your order #123 has shipped and will arrive by Friday.
</Alert>
```

### Sticky Alert (with styling)
```tsx
<Alert
  icon={<Icon name="Info" />}
  style={{
    position: 'sticky',
    top: 0,
    zIndex: 100,
  }}
>
  Free shipping on all orders this weekend!
</Alert>
```

### Form Validation Alert
```tsx
{errors.length > 0 && (
  <Alert icon={<Icon name="XCircle" />}>
    Please fix the following errors:
    <ul>
      {errors.map((error, i) => (
        <li key={i}>{error}</li>
      ))}
    </ul>
  </Alert>
)}
```

### Auto-dismiss Alert
```tsx
const [show, setShow] = useState(true)

useEffect(() => {
  if (show) {
    const timer = setTimeout(() => setShow(false), 5000)
    return () => clearTimeout(timer)
  }
}, [show])

{show && (
  <Alert
    icon={<Icon name="CheckCircle" />}
    dismissible
    onClose={() => setShow(false)}
  >
    Settings saved successfully!
  </Alert>
)}
```
