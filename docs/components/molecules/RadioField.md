# RadioField

## Intention
Complete form field with radio button and label.

## Description
RadioField combines Radio and Label with proper association. Use within RadioGroup for mutually exclusive options.

## Import
```tsx
import { RadioField } from '@faststore/components'
```

## Props

| Name | Type | Default | Required | Description |
|------|------|---------|----------|-------------|
| `id` | `string` | - | Yes | Field identifier |
| `label` | `string` | - | Yes | Label text |

Extends `InputHTMLAttributes<HTMLInputElement>`.

## Sub-components
- [Radio](../atoms/Radio.md)
- [Label](../atoms/Label.md)

## Examples

```tsx
<fieldset>
  <legend>Shipping Method</legend>
  <RadioField
    id="standard"
    name="shipping"
    value="standard"
    label="Standard (Free)"
    defaultChecked
  />
  <RadioField
    id="express"
    name="shipping"
    value="express"
    label="Express ($9.99)"
  />
</fieldset>
```
