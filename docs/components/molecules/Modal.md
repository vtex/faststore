# Modal

## Intention
Overlay dialog for focused interactions and confirmations.

## Description
Modal displays content in an overlay that blocks interaction with the rest of the page. Includes header, body, footer sections and close functionality. Manages focus trapping and accessibility.

In ecommerce, used for product quick views, size guides, confirmations, forms.

## Import
```tsx
import { Modal } from '@faststore/components'
```

## Props

| Name | Type | Default | Required | Description |
|------|------|---------|----------|-------------|
| `testId` | `string` | `'fs-modal'` | No | ID for testing tools |
| `isOpen` | `boolean` | - | Yes | Controls modal visibility |
| `onDismiss` | `() => void` | - | Yes | Close callback |

## Sub-components
- `ModalHeader` - Title and close button
- `ModalBody` - Main content
- `ModalFooter` - Actions
- `ModalContent` - Wrapper for all sections

Also uses [Overlay](../atoms/Overlay.md).

## Accessibility

- Uses `role="dialog"` and `aria-modal="true"`
- Focus trapped within modal when open
- Escape key closes modal
- Focus returns to trigger on close

## Examples

```tsx
const [isOpen, setIsOpen] = useState(false)

<>
  <Button onClick={() => setIsOpen(true)}>
    Open Modal
  </Button>
  
  {isOpen && (
    <>
      <Overlay onClick={() => setIsOpen(false)} />
      <Modal isOpen={isOpen} onDismiss={() => setIsOpen(false)}>
        <ModalHeader>
          <h2>Modal Title</h2>
        </ModalHeader>
        <ModalBody>
          <p>Modal content goes here</p>
        </ModalBody>
        <ModalFooter>
          <Button onClick={() => setIsOpen(false)}>
            Close
          </Button>
        </ModalFooter>
      </Modal>
    </>
  )}
</>
```
