# CheckboxField

## Intention
Complete form field with checkbox, label, and optional error.

## Description
CheckboxField combines Checkbox and Label with proper association and optional error messaging. Ensures accessible checkbox inputs with proper labeling.

## Import
```tsx
import { CheckboxField } from '@faststore/components'
```

## Props

| Name | Type | Default | Required | Description |
|------|------|---------|----------|-------------|
| `id` | `string` | - | Yes | Field identifier |
| `label` | `string` | - | Yes | Label text |
| `error` | `string` | - | No | Error message |

Extends `InputHTMLAttributes<HTMLInputElement>`.

## Sub-components
- [Checkbox](../atoms/Checkbox.md)
- [Label](../atoms/Label.md)

## Examples

```tsx
<CheckboxField
  id="terms"
  label="I agree to terms and conditions"
  required
/>

<CheckboxField
  id="newsletter"
  label="Subscribe to newsletter"
  defaultChecked
/>
```
