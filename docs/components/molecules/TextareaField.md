# TextareaField

## Intention
Complete form field with textarea, label, and error message.

## Description
TextareaField combines Textarea, Label, and error messaging for multi-line text input fields. Provides consistent form field layout for longer content entry.

## Import
```tsx
import { TextareaField } from '@faststore/components'
```

## Props

| Name | Type | Default | Required | Description |
|------|------|---------|----------|-------------|
| `id` | `string` | - | Yes | Field identifier |
| `label` | `string` | - | Yes | Label text |
| `error` | `string` | - | No | Error message |

Extends `TextareaHTMLAttributes<HTMLTextAreaElement>`.

## Sub-components
- [Label](../atoms/Label.md)
- [Textarea](../atoms/Textarea.md)

## Examples

```tsx
<TextareaField
  id="message"
  label="Message"
  rows={5}
  placeholder="Enter your message..."
/>

<TextareaField
  id="review"
  label="Product Review"
  error="Review must be at least 10 characters"
  maxLength={500}
/>
```
