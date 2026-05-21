# Toggle

## Intention
Switch control for binary on/off states.

## Description
Toggle provides a switch-style control for immediate on/off actions. Unlike checkboxes (which represent selections in forms), toggles trigger immediate changes. Think of it like a light switch.

In ecommerce, used for feature toggles, preferences, filters that apply immediately.

## Import
```tsx
import { Toggle } from '@faststore/components'
```

## Props

| Name | Type | Default | Required | Description |
|------|------|---------|----------|-------------|
| `checked` | `boolean` | - | No | Controlled checked state |
| `onChange` | `(event) => void` | - | No | Change callback |
| `disabled` | `boolean` | `false` | No | Disabled state |

## Examples

```tsx
const [enabled, setEnabled] = useState(false)

<Toggle
  checked={enabled}
  onChange={(e) => setEnabled(e.target.checked)}
  aria-label="Enable notifications"
/>
```
