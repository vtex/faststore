# InputField

## Intention
Complete form field with input, label, and error message.

## Description
InputField combines Input, Label, and error message display into a single, cohesive form field component. Handles all common form field states and provides consistent layout and accessibility.

## Import
```tsx
import { InputField } from '@faststore/components'
```

## Props

| Name | Type | Default | Required | Description |
|------|------|---------|----------|-------------|
| `id` | `string` | - | Yes | Field identifier |
| `label` | `string` | - | Yes | Label text |
| `error` | `string` | - | No | Error message |
| `inputRef` | `Ref<HTMLInputElement>` | - | No | Input ref |

Extends `InputHTMLAttributes<HTMLInputElement>`.

## Sub-components
- [Label](../atoms/Label.md)
- [Input](../atoms/Input.md)

## Examples

```tsx
<InputField
  id="email"
  label="Email"
  type="email"
  required
/>

<InputField
  id="email"
  label="Email"
  error="Please enter a valid email"
  aria-invalid="true"
/>
```
