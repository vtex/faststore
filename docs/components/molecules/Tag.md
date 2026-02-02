# Tag

## Intention
Removable label for filters, selections, or categorization.

## Description
Tag is an interactive badge with a close button for removing selections. Extends Badge with removal capability, commonly used for active filters, selected attributes, or removable labels. Always includes close functionality.

In ecommerce, used for applied filters, search tags, selected product attributes.

## Import
```tsx
import { Tag } from '@faststore/components'
```

## Props

Extends `BadgeProps`:

| Name | Type | Default | Required | Description |
|------|------|---------|----------|-------------|
| `testId` | `string` | `'fs-tag'` | No | ID for testing tools |
| `label` | `string` | - | Yes | Tag text content |
| `icon` | `ReactNode` | `<Icon name="X" />` | No | Close icon (defaults to X) |
| `iconButtonLabel` | `string` | `'remove'` | No | Aria-label for close button |
| `onClose` | `() => void` | - | Yes | Callback when tag is closed |

## Sub-components

- [Badge](../atoms/Badge.md) - Base styling
- [Icon](../atoms/Icon.md) - Close icon

## Accessibility

- Close button has proper `aria-label`
- Keyboard accessible (Tab to button, Enter/Space to remove)
- Size is always "big" for adequate touch target

## CSS Custom Properties

Inherits Badge properties plus:

```scss
--fs-tag-padding: var(--fs-spacing-1) var(--fs-spacing-2)
--fs-tag-gap: var(--fs-spacing-1)
```

## Data Attributes

```tsx
<Badge data-fs-tag>
  <span data-fs-tag-label>{label}</span>
  <button data-fs-tag-icon-button>{icon}</button>
</Badge>
```

## Examples

### Basic Usage
```tsx
<Tag
  label="Blue"
  onClose={() => removeFilter('color', 'blue')}
/>
```

### Applied Filters
```tsx
{appliedFilters.map((filter) => (
  <Tag
    key={filter.id}
    label={filter.label}
    onClose={() => removeFilter(filter.id)}
    iconButtonLabel={`Remove ${filter.label} filter`}
  />
))}
```

### Custom Icon
```tsx
<Tag
  label="Featured"
  icon={<Icon name="Star" />}
  onClose={handleClose}
/>
```
