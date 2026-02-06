# Checkbox

## Intention
Allow users to select one or multiple options from a set.

## Description
Checkbox is a form control that enables binary or multiple selection. It supports standard checked/unchecked states plus an indeterminate "partial" state for representing partially selected groups.

In ecommerce, checkboxes are used for product filters, shipping options, terms acceptance, and multi-item selection.

## Import
```tsx
import { Checkbox } from '@faststore/components'
```

## Props

| Name | Type | Default | Required | Description |
|------|------|---------|----------|-------------|
| `testId` | `string` | `'fs-checkbox'` | No | ID for testing tools |
| `partial` | `boolean` | `false` | No | Shows indeterminate/partial state |
| `checked` | `boolean` | - | No | Controls checked state (controlled component) |
| `defaultChecked` | `boolean` | - | No | Initial checked state (uncontrolled) |
| `onChange` | `function` | - | No | Callback when checkbox state changes |
| `name` | `string` | - | No | Form field name |
| `value` | `string` | - | No | Form value |

Extends `InputHTMLAttributes<HTMLInputElement>` excluding `type` (always "checkbox").

## States

- **Unchecked**: Default state, value not selected
- **Checked**: Selected state, value included in form data
- **Partial/Indeterminate**: Represents mixed state in grouped checkboxes (parent checkbox when some children are selected)
- **Disabled**: Non-interactive state

## Accessibility

- Uses semantic `<input type="checkbox">`
- Must be paired with a `<Label>` element
- Supports keyboard interaction:
  - **Space**: Toggle checked state
  - **Tab**: Move focus
- **ARIA**: Native checkbox semantics (`role="checkbox"`, `aria-checked`)
- **Indeterminate**: `aria-checked="mixed"` via `partial` prop

## CSS Custom Properties

```scss
--fs-checkbox-width: var(--fs-spacing-3)
--fs-checkbox-height: var(--fs-spacing-3)
--fs-checkbox-border-width: var(--fs-border-width)
--fs-checkbox-border-radius: var(--fs-border-radius-small)
--fs-checkbox-border-color: var(--fs-border-color)
--fs-checkbox-border-color-hover: var(--fs-border-color-hover)
--fs-checkbox-checked-bkg-color: var(--fs-color-primary)
--fs-checkbox-checked-border-color: var(--fs-color-primary)
--fs-checkbox-disabled-bkg-color: var(--fs-color-disabled-bkg)
--fs-checkbox-transition: var(--fs-transition-timing)
```

## Data Attributes

```tsx
<input
  type="checkbox"
  data-fs-checkbox
  data-fs-checkbox-partial="false"
  data-testid="fs-checkbox"
/>
```

## Best Practices

### Do's
✅ Always pair with visible label text  
✅ Use for independent selections (not mutually exclusive)  
✅ Group related checkboxes logically  
✅ Use partial state for "select all" functionality  
✅ Provide clear labels describing what will be selected  
✅ Maintain adequate touch target size (min 44x44px)

### Don'ts
❌ Don't use for mutually exclusive options (use Radio instead)  
❌ Don't use checkboxes for binary actions (use Toggle/Switch)  
❌ Don't hide checkbox labels  
❌ Don't use too many checkboxes (consider Select or multi-select)  
❌ Don't disable without explanation

### Checkbox vs Radio vs Toggle

- **Checkbox**: Multiple independent selections
- **Radio**: Single selection from exclusive options
- **Toggle**: Immediate on/off action (like a light switch)

## Related Components

- [CheckboxField](../molecules/CheckboxField.md) - Checkbox with integrated label
- [Radio](./Radio.md) - For mutually exclusive selections
- [Toggle](../molecules/Toggle.md) - For on/off switches
- [Label](./Label.md) - For labeling checkboxes

## Examples

### Basic Usage
```tsx
<Checkbox id="terms" />
<Label htmlFor="terms">I agree to terms</Label>
```

### Controlled Checkbox
```tsx
const [checked, setChecked] = useState(false)

<Checkbox
  id="newsletter"
  checked={checked}
  onChange={(e) => setChecked(e.target.checked)}
/>
<Label htmlFor="newsletter">Subscribe to newsletter</Label>
```

### Checkbox Group
```tsx
<fieldset>
  <legend>Filter by Category</legend>
  
  <div>
    <Checkbox id="electronics" name="category" value="electronics" />
    <Label htmlFor="electronics">Electronics</Label>
  </div>
  
  <div>
    <Checkbox id="clothing" name="category" value="clothing" />
    <Label htmlFor="clothing">Clothing</Label>
  </div>
  
  <div>
    <Checkbox id="books" name="category" value="books" />
    <Label htmlFor="books">Books</Label>
  </div>
</fieldset>
```

### Select All with Partial State
```tsx
const [selectedItems, setSelectedItems] = useState([])
const allItems = ['item1', 'item2', 'item3']
const allSelected = selectedItems.length === allItems.length
const someSelected = selectedItems.length > 0 && !allSelected

<Checkbox
  id="select-all"
  checked={allSelected}
  partial={someSelected}
  onChange={(e) => {
    if (e.target.checked) {
      setSelectedItems(allItems)
    } else {
      setSelectedItems([])
    }
  }}
/>
<Label htmlFor="select-all">Select All</Label>
```

### Disabled Checkbox
```tsx
<Checkbox id="unavailable" disabled />
<Label htmlFor="unavailable">Out of Stock</Label>
```

### Default Checked
```tsx
<Checkbox id="remember" defaultChecked />
<Label htmlFor="remember">Remember me</Label>
```

### In Forms
```tsx
<form onSubmit={handleSubmit}>
  <div>
    <Checkbox
      id="terms"
      name="terms"
      required
    />
    <Label htmlFor="terms">
      I agree to the terms and conditions *
    </Label>
  </div>
  
  <Button type="submit">Submit</Button>
</form>
```
