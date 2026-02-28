# Overlay

## Intention
Create a semi-transparent backdrop for modals, drawers, and overlays.

## Description
Overlay is a simple backdrop component that dims the background content when modals, sidebars, or other overlay UI elements are displayed. It typically intercepts clicks to close the overlaying content.

In ecommerce, overlays are used behind shopping cart drawers, product quick views, filters, and confirmation dialogs.

## Import
```tsx
import { Overlay } from '@faststore/components'
```

## Props

| Name | Type | Default | Required | Description |
|------|------|---------|----------|-------------|
| `testId` | `string` | `'fs-overlay'` | No | ID for testing tools |
| `onClick` | `function` | - | No | Callback when overlay is clicked (typically to close) |

Extends `HTMLAttributes<HTMLDivElement>` for additional div attributes.

## Accessibility

- Uses `role="presentation"` (decorative, non-interactive content)
- Should not trap focus (focus stays in modal/dialog)
- Clicking overlay typically closes the associated UI element
- Not announced by screen readers (decorative only)
- Related modal/dialog handles focus management

## CSS Custom Properties

```scss
--fs-overlay-bkg-color: rgba(0, 0, 0, 0.4)
--fs-overlay-z-index: var(--fs-z-index-overlay)
```

## Data Attributes

```tsx
<div
  data-fs-overlay
  data-testid="fs-overlay"
  role="presentation"
/>
```

## Best Practices

### Do's
✅ Position overlay below modal but above main content  
✅ Use with Modal, Drawer, or Dialog components  
✅ Make clickable to close associated UI  
✅ Animate overlay entrance/exit  
✅ Use appropriate z-index layering

### Don'ts
❌ Don't use overlay alone without associated UI  
❌ Don't make overlay un-dismissible without good reason  
❌ Don't use overly dark overlays that obscure content  
❌ Don't forget to handle scroll locking on body  
❌ Don't trap focus on overlay itself

### Typical Usage Pattern

```tsx
{isOpen && (
  <>
    <Overlay onClick={onClose} />
    <Modal onClose={onClose}>
      {/* Modal content */}
    </Modal>
  </>
)}
```

## Related Components

- [Modal](../molecules/Modal.md) - Uses overlay as backdrop
- [CartSidebar](../../organisms/CartSidebar.md) - Shopping cart with overlay
- [SlideOver](../../organisms/SlideOver.md) - Slide-out panel with overlay
- [NavbarSlider](../../organisms/NavbarSlider.md) - Mobile navigation with overlay

## Examples

### Basic Overlay
```tsx
<Overlay />
```

### With Click Handler
```tsx
const [isOpen, setIsOpen] = useState(false)

{isOpen && (
  <Overlay onClick={() => setIsOpen(false)} />
)}
```

### With Modal
```tsx
const [isModalOpen, setIsModalOpen] = useState(false)

{isModalOpen && (
  <>
    <Overlay onClick={() => setIsModalOpen(false)} />
    <Modal onClose={() => setIsModalOpen(false)}>
      <h2>Modal Title</h2>
      <p>Modal content</p>
    </Modal>
  </>
)}
```

### With Animation
```tsx
<Overlay
  style={{
    animation: 'fadeIn 0.2s ease-in-out',
  }}
  onClick={onClose}
/>
```

### Fixed Positioning
```tsx
<Overlay
  style={{
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 999,
  }}
/>
```

### Custom Background
```tsx
<Overlay
  style={{
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
  }}
/>
```

### Prevent Body Scroll
```tsx
useEffect(() => {
  if (isOpen) {
    document.body.style.overflow = 'hidden'
    return () => {
      document.body.style.overflow = ''
    }
  }
}, [isOpen])

{isOpen && <Overlay onClick={() => setIsOpen(false)} />}
```

### Overlay with Portal
```tsx
import { createPortal } from 'react-dom'

{isOpen && createPortal(
  <Overlay onClick={onClose} />,
  document.body
)}
```
