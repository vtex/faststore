# ToggleField

## Intention
Toggle with integrated label.

## Description
ToggleField combines Toggle with Label for complete form field. Provides proper association and layout for toggle switches.

## Import
```tsx
import { ToggleField } from '@faststore/components'
```

## Props

| Name | Type | Default | Required | Description |
|------|------|---------|----------|-------------|
| `id` | `string` | - | Yes | Field identifier |
| `label` | `string` | - | Yes | Label text |

Extends Toggle props.

## Examples

```tsx
<ToggleField
  id="notifications"
  label="Enable email notifications"
  checked={enabled}
  onChange={(e) => setEnabled(e.target.checked)}
/>
```
