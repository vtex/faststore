# Input

## Intention
Single-line text input field for collecting user data.

## Description
Input is a fundamental form control for text entry. It's a styled wrapper around the native HTML `<input>` element, supporting all standard input types (text, email, password, number, etc.) and maintaining consistency across the design system.

In ecommerce, inputs are used for search, account forms, checkout, quantity fields, and product filtering.

## Import
```tsx
import { Input } from '@faststore/components'
```

## Props

| Name | Type | Default | Required | Description |
|------|------|---------|----------|-------------|
| `testId` | `string` | `'fs-input'` | No | ID for testing tools |
| `type` | `string` | `'text'` | No | HTML input type (text, email, password, number, tel, url, etc.) |
| `value` | `string \| number` | - | No | Controlled input value |
| `defaultValue` | `string \| number` | - | No | Uncontrolled initial value |
| `onChange` | `function` | - | No | Callback when input value changes |
| `placeholder` | `string` | - | No | Placeholder text |
| `disabled` | `boolean` | `false` | No | Disables input |
| `required` | `boolean` | `false` | No | Makes field required |
| `id` | `string` | - | No | Input ID (should match label's htmlFor) |

Extends `InputHTMLAttributes<HTMLInputElement>` for all native input props.

## Accessibility

- Uses semantic `<input>` element
- **Required**: Pair with `<Label>` element using matching `id`/`htmlFor`
- Supports all native input ARIA attributes
- **Placeholder**: Not a replacement for labels (use for hints only)
- **Required fields**: Mark with `required` attribute and visual indicator
- **Error states**: Use `aria-invalid` and `aria-describedby` for error messages

## CSS Custom Properties

```scss
--fs-input-height: var(--fs-spacing-6)
--fs-input-padding: var(--fs-spacing-2) var(--fs-spacing-3)
--fs-input-border-width: var(--fs-border-width)
--fs-input-border-radius: var(--fs-border-radius)
--fs-input-border-color: var(--fs-border-color)
--fs-input-border-color-hover: var(--fs-border-color-hover)
--fs-input-border-color-focus: var(--fs-color-focus-ring)
--fs-input-bkg-color: var(--fs-color-body-bkg)
--fs-input-text-color: var(--fs-color-text)
--fs-input-text-size: var(--fs-text-size-base)
--fs-input-disabled-bkg-color: var(--fs-color-disabled-bkg)
--fs-input-disabled-text-color: var(--fs-color-disabled-text)
```

## Data Attributes

```tsx
<input
  data-fs-input
  data-testid="fs-input"
  type="text"
/>
```

## Best Practices

### Do's
✅ Always pair with visible labels  
✅ Use appropriate input type for data format  
✅ Provide clear placeholder hints  
✅ Mark required fields clearly  
✅ Show validation errors near the field  
✅ Use autocomplete attributes for forms  
✅ Set appropriate maxlength for constrained inputs

### Don'ts
❌ Don't use placeholder as label replacement  
❌ Don't validate on keystroke (validate on blur for better UX)  
❌ Don't use generic types when specific ones exist  
❌ Don't disable without providing alternative  
❌ Don't forget autocomplete for common fields

### Input Types Guide

- **text**: General text (names, addresses)
- **email**: Email addresses (enables email keyboard on mobile)
- **password**: Passwords (masks input)
- **tel**: Phone numbers (shows numeric keyboard)
- **number**: Numbers with steppers
- **url**: URLs (URL keyboard on mobile)
- **search**: Search queries (shows X button)
- **date**, **time**: Date/time pickers

## Related Components

- [InputField](../molecules/InputField.md) - Input with integrated label and error
- [SearchInputField](../molecules/SearchInputField.md) - Input with search icon
- [Label](./Label.md) - For labeling inputs
- [Textarea](./Textarea.md) - Multi-line text input

## Examples

### Basic Usage
```tsx
<Label htmlFor="name">Name</Label>
<Input id="name" type="text" />
```

### Controlled Input
```tsx
const [value, setValue] = useState('')

<Input
  value={value}
  onChange={(e) => setValue(e.target.value)}
  placeholder="Enter text..."
/>
```

### Email Input
```tsx
<Label htmlFor="email">Email</Label>
<Input
  id="email"
  type="email"
  placeholder="you@example.com"
  autocomplete="email"
  required
/>
```

### Password Input
```tsx
<Label htmlFor="password">Password</Label>
<Input
  id="password"
  type="password"
  minLength={8}
  required
/>
```

### Number Input
```tsx
<Label htmlFor="quantity">Quantity</Label>
<Input
  id="quantity"
  type="number"
  min={1}
  max={99}
  defaultValue={1}
/>
```

### Search Input
```tsx
<Label htmlFor="search">Search</Label>
<Input
  id="search"
  type="search"
  placeholder="Search products..."
/>
```

### Disabled Input
```tsx
<Input
  value="Unavailable"
  disabled
/>
```

### With Error State
```tsx
<Label htmlFor="email">Email</Label>
<Input
  id="email"
  type="email"
  aria-invalid="true"
  aria-describedby="email-error"
/>
<span id="email-error" role="alert">
  Please enter a valid email
</span>
```

### With Autocomplete
```tsx
<Input
  id="cc-number"
  type="text"
  autocomplete="cc-number"
  inputMode="numeric"
  placeholder="1234 5678 9012 3456"
/>
```
