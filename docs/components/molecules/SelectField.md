# SelectField

## Intention
Complete form field with select dropdown, label, and error message.

## Description
SelectField combines Select, Label, and error messaging into a cohesive form field. Provides consistent form field layout and accessibility for dropdown selections.

## Import
```tsx
import { SelectField } from '@faststore/components'
```

## Props

| Name | Type | Default | Required | Description |
|------|------|---------|----------|-------------|
| `id` | `string` | - | Yes | Field identifier |
| `label` | `string` | - | Yes | Label text |
| `options` | `Record<string, string>` | - | Yes | Select options |
| `error` | `string` | - | No | Error message |

Extends `SelectHTMLAttributes<HTMLSelectElement>`.

## Sub-components
- [Label](../atoms/Label.md)
- [Select](../atoms/Select.md)

## Examples

```tsx
<SelectField
  id="country"
  label="Country"
  options={{
    'us': 'United States',
    'ca': 'Canada',
    'uk': 'United Kingdom'
  }}
/>
```
