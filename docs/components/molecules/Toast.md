# Toast

## Intention
Temporary notification that appears briefly and auto-dismisses.

## Description
Toast displays brief, non-intrusive notifications that appear temporarily and disappear automatically. Unlike Alert, Toast is transient and doesn't require user action. Typically positioned at top or bottom of viewport.

In ecommerce, toasts confirm actions like "Added to cart", "Saved", or brief status updates.

## Import
```tsx
import { Toast } from '@faststore/components'
```

## Props

| Name | Type | Default | Required | Description |
|------|------|---------|----------|-------------|
| `testId` | `string` | `'fs-toast'` | No | ID for testing tools |
| `icon` | `ReactNode` | - | No | Optional icon |
| `children` | `ReactNode` | - | Yes | Toast message |

Extends `HTMLAttributes<HTMLDivElement>`.

## Accessibility

- Uses `role="status"` or `role="alert"` for announcements
- Screen readers announce content
- `aria-live="polite"` for non-critical messages
- `aria-live="assertive"` for important updates

## CSS Custom Properties

```scss
--fs-toast-padding: var(--fs-spacing-2) var(--fs-spacing-3)
--fs-toast-border-radius: var(--fs-border-radius)
--fs-toast-bkg-color: var(--fs-color-neutral-7)
--fs-toast-text-color: var(--fs-color-text-inverse)
--fs-toast-min-width: 300px
```

## Data Attributes

```tsx
<div
  role="status"
  data-fs-toast
  data-testid="fs-toast"
>
  {children}
</div>
```

## Best Practices

### Do's
✅ Keep messages brief (one line preferred)  
✅ Auto-dismiss after 3-5 seconds  
✅ Position consistently (usually top-right or bottom)  
✅ Show one toast at a time  
✅ Use for non-critical confirmations

### Don'ts
❌ Don't use for errors requiring action  
❌ Don't show too many toasts  
❌ Don't keep toasts visible indefinitely  
❌ Don't use for critical information

## Examples

### Basic Toast
```tsx
const [showToast, setShowToast] = useState(false)

useEffect(() => {
  if (showToast) {
    const timer = setTimeout(() => setShowToast(false), 3000)
    return () => clearTimeout(timer)
  }
}, [showToast])

{showToast && (
  <Toast>Item added to cart</Toast>
)}
```

### With Icon
```tsx
<Toast icon={<Icon name="CheckCircle" />}>
  Saved to favorites
</Toast>
```

### Success Toast
```tsx
<Toast icon={<Icon name="CheckCircle" />}>
  Order placed successfully!
</Toast>
```

### Toast Manager
```tsx
const [toasts, setToasts] = useState([])

const showToast = (message) => {
  const id = Date.now()
  setToasts([...toasts, { id, message }])
  setTimeout(() => {
    setToasts(prev => prev.filter(t => t.id !== id))
  }, 3000)
}

<div style={{ position: 'fixed', top: '20px', right: '20px' }}>
  {toasts.map(toast => (
    <Toast key={toast.id}>{toast.message}</Toast>
  ))}
</div>
```
