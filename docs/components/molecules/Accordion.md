# Accordion

## Intention
Collapsible content sections for organizing information.

## Description
Accordion provides expandable/collapsible content sections. Manages open/closed state of multiple items. Useful for FAQs, product details, filters, and content-heavy pages.

In ecommerce, used for product specs, FAQs, shipping info, filter groups.

## Import
```tsx
import { Accordion } from '@faststore/components'
```

## Props

| Name | Type | Default | Required | Description |
|------|------|---------|----------|-------------|
| `testId` | `string` | `'fs-accordion'` | No | ID for testing tools |
| `indices` | `Iterable<number>` | - | Yes | Array of open item indices |
| `onChange` | `(index: number) => void` | - | Yes | Toggle callback |

## Sub-components
- `AccordionItem` - Individual section
- `AccordionButton` - Clickable header
- `AccordionPanel` - Collapsible content

## Accessibility

- Uses proper ARIA attributes
- Keyboard: Enter/Space toggles, Arrow keys navigate
- Screen readers announce expanded/collapsed state

## Examples

```tsx
const [openItems, setOpenItems] = useState([0])

const toggle = (index) => {
  setOpenItems(prev =>
    prev.includes(index)
      ? prev.filter(i => i !== index)
      : [...prev, index]
  )
}

<Accordion indices={openItems} onChange={toggle}>
  <AccordionItem>
    <AccordionButton>Shipping Information</AccordionButton>
    <AccordionPanel>Ships in 2-3 business days</AccordionPanel>
  </AccordionItem>
  <AccordionItem>
    <AccordionButton>Return Policy</AccordionButton>
    <AccordionPanel>30-day returns accepted</AccordionPanel>
  </AccordionItem>
</Accordion>
```
