# Label

## Intention
Associate descriptive text with form controls for accessibility and usability.

## Description
Label is a semantic wrapper for the HTML `<label>` element, providing consistent styling and accessibility features for form fields. It creates an explicit relationship between text and form controls, improving usability and accessibility.

Labels are essential in ecommerce forms for checkout, account creation, newsletter signups, and product filtering.

## Import
```tsx
import { Label } from '@faststore/components'
```

## Props

| Name | Type | Default | Required | Description |
|------|------|---------|----------|-------------|
| `testId` | `string` | `'fs-label'` | No | ID for testing tools |
| `htmlFor` | `string` | - | No | ID of the associated form control |
| `children` | `ReactNode` | - | Yes | Label text content |

Extends `LabelHTMLAttributes<HTMLLabelElement>` for additional native label props.

## Accessibility

- Uses semantic `<label>` element
- **Required**: Connect label to input using:
  - `htmlFor` prop matching input's `id`
  - OR wrapping the input as a child
- Screen readers announce label text when input receives focus
- Clicking label focuses the associated input
- Essential for WCAG 2.1 AA compliance

## CSS Custom Properties

```scss
--fs-label-text-size: var(--fs-text-size-base)
--fs-label-text-weight: var(--fs-text-weight-regular)
--fs-label-text-color: var(--fs-color-text)
```

## Data Attributes

```tsx
<label
  data-fs-label
  data-testid="fs-label"
  htmlFor="email"
>
  {children}
</label>
```

## Best Practices

### Do's
✅ Always provide labels for form inputs  
✅ Use clear, concise label text  
✅ Connect labels to inputs via `htmlFor` or wrapping  
✅ Position labels consistently (above or beside inputs)  
✅ Mark required fields visually and semantically

### Don'ts
❌ Don't use placeholder text instead of labels  
❌ Don't hide labels (use SROnly if needed for visual design)  
❌ Don't use vague labels ("Enter text here")  
❌ Don't disconnect labels from their inputs  
❌ Don't rely solely on visual proximity

### Form Design Patterns

**Above Input (Recommended for mobile)**
```tsx
<Label htmlFor="email">Email Address</Label>
<Input id="email" type="email" />
```

**Beside Input (Desktop)**
```tsx
<div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
  <Label htmlFor="remember">Remember me</Label>
  <Checkbox id="remember" />
</div>
```

**Wrapped Pattern**
```tsx
<Label>
  Email Address
  <Input type="email" />
</Label>
```

## Related Components

- [InputField](../molecules/InputField.md) - Input with integrated label
- [CheckboxField](../molecules/CheckboxField.md) - Checkbox with label
- [SelectField](../molecules/SelectField.md) - Select with label
- [SROnly](./SROnly.md) - Visually hidden but screen reader accessible

## Examples

### Basic Usage
```tsx
<Label htmlFor="username">Username</Label>
<Input id="username" />
```

### Required Field
```tsx
<Label htmlFor="email">
  Email Address <span aria-label="required">*</span>
</Label>
<Input id="email" type="email" required />
```

### Checkbox Label
```tsx
<div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
  <Checkbox id="terms" />
  <Label htmlFor="terms">
    I agree to the terms and conditions
  </Label>
</div>
```

### With Helper Text
```tsx
<div>
  <Label htmlFor="password">Password</Label>
  <Input id="password" type="password" />
  <small>Must be at least 8 characters</small>
</div>
```

### Wrapped Input
```tsx
<Label>
  Search products
  <Input type="search" placeholder="Enter keywords..." />
</Label>
```

### Visually Hidden Label (use SROnly component instead)
```tsx
<SROnly as={Label} htmlFor="search">
  Search
</SROnly>
<Input id="search" type="search" placeholder="Search products..." />
```
