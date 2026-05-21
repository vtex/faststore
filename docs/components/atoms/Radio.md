# Radio

## Intention
Allow users to select exactly one option from a set of mutually exclusive choices.

## Description
Radio is a form control that enables single selection from multiple options. Unlike checkboxes, only one radio button in a group can be selected at a time. Radio buttons must share the same `name` attribute to function as a group.

In ecommerce, radio buttons are used for shipping methods, payment options, size/color selection, and delivery preferences.

## Import
```tsx
import { Radio } from '@faststore/components'
```

## Props

| Name | Type | Default | Required | Description |
|------|------|---------|----------|-------------|
| `testId` | `string` | `'fs-radio'` | No | ID for testing tools |
| `name` | `string` | - | Yes | Group identifier (radios with same name are mutually exclusive) |
| `value` | `string` | - | Yes | Value submitted when selected |
| `checked` | `boolean` | - | No | Controlled checked state |
| `defaultChecked` | `boolean` | - | No | Initial checked state (uncontrolled) |
| `onChange` | `function` | - | No | Callback when selection changes |
| `disabled` | `boolean` | `false` | No | Disables radio button |
| `id` | `string` | - | Recommended | ID for label association |

Extends `InputHTMLAttributes<HTMLInputElement>` excluding `type` (always "radio").

## Radio Groups

Radios work in groups defined by shared `name` attribute:

```tsx
<div role="radiogroup" aria-labelledby="shipping-label">
  <Radio name="shipping" value="standard" id="standard" />
  <Radio name="shipping" value="express" id="express" />
  <Radio name="shipping" value="overnight" id="overnight" />
</div>
```

## Accessibility

- Uses semantic `<input type="radio">`
- **Required**: Pair each radio with `<Label>` using matching `id`/`htmlFor`
- Group radios with `role="radiogroup"` and descriptive legend
- Keyboard interaction:
  - **Arrow keys**: Navigate between radios in group
  - **Tab**: Move to next radio group
  - **Space**: Select focused radio
- Native `aria-checked` state
- One radio in group should be checked by default

## CSS Custom Properties

```scss
--fs-radio-width: var(--fs-spacing-3)
--fs-radio-height: var(--fs-spacing-3)
--fs-radio-border-width: var(--fs-border-width)
--fs-radio-border-radius: var(--fs-border-radius-circle)
--fs-radio-border-color: var(--fs-border-color)
--fs-radio-border-color-hover: var(--fs-border-color-hover)
--fs-radio-checked-bkg-color: var(--fs-color-primary)
--fs-radio-checked-border-color: var(--fs-color-primary)
--fs-radio-disabled-bkg-color: var(--fs-color-disabled-bkg)
```

## Data Attributes

```tsx
<input
  type="radio"
  data-fs-radio
  data-testid="fs-radio"
  name="group"
  value="option"
/>
```

## Best Practices

### Do's
✅ Always pair with visible label text  
✅ Use for mutually exclusive options (2-7 options ideal)  
✅ Group related radios with fieldset/legend  
✅ Pre-select default option when possible  
✅ Maintain adequate touch target size (min 44x44px)  
✅ Keep labels short and clear

### Don'ts
❌ Don't use for yes/no questions (use checkbox or toggle)  
❌ Don't mix checkbox and radio in same group  
❌ Don't use different `name` for related options  
❌ Don't use for long lists (consider Select instead)  
❌ Don't allow zero selection state in required fields  
❌ Don't forget legend/label for radio group

### Radio vs Checkbox vs Select

- **Radio**: Single selection, 2-7 options, all visible
- **Checkbox**: Multiple selections, independent options
- **Select**: Single selection, many options, space-efficient

## Related Components

- [RadioField](../molecules/RadioField.md) - Radio with integrated label
- [RadioGroup](../molecules/RadioGroup.md) - Managed group of radio options
- [Checkbox](./Checkbox.md) - For multiple selections
- [Select](./Select.md) - For dropdown single selection

## Examples

### Basic Radio Group
```tsx
<fieldset>
  <legend>Shipping Method</legend>
  
  <div>
    <Radio name="shipping" value="standard" id="standard" defaultChecked />
    <Label htmlFor="standard">Standard (5-7 days) - Free</Label>
  </div>
  
  <div>
    <Radio name="shipping" value="express" id="express" />
    <Label htmlFor="express">Express (2-3 days) - $9.99</Label>
  </div>
  
  <div>
    <Radio name="shipping" value="overnight" id="overnight" />
    <Label htmlFor="overnight">Overnight - $24.99</Label>
  </div>
</fieldset>
```

### Controlled Radio Group
```tsx
const [shipping, setShipping] = useState('standard')

<div role="radiogroup" aria-labelledby="shipping-label">
  <h3 id="shipping-label">Shipping Method</h3>
  
  {shippingOptions.map((option) => (
    <div key={option.value}>
      <Radio
        name="shipping"
        value={option.value}
        id={option.value}
        checked={shipping === option.value}
        onChange={(e) => setShipping(e.target.value)}
      />
      <Label htmlFor={option.value}>
        {option.label}
      </Label>
    </div>
  ))}
</div>
```

### Payment Method Selection
```tsx
<fieldset>
  <legend>Payment Method</legend>
  
  <div>
    <Radio name="payment" value="card" id="card" defaultChecked />
    <Label htmlFor="card">Credit/Debit Card</Label>
  </div>
  
  <div>
    <Radio name="payment" value="paypal" id="paypal" />
    <Label htmlFor="paypal">PayPal</Label>
  </div>
  
  <div>
    <Radio name="payment" value="bank" id="bank" />
    <Label htmlFor="bank">Bank Transfer</Label>
  </div>
</fieldset>
```

### Disabled Radio
```tsx
<div>
  <Radio
    name="option"
    value="disabled"
    id="disabled"
    disabled
  />
  <Label htmlFor="disabled">
    Unavailable Option
  </Label>
</div>
```

### Size Selection
```tsx
<fieldset>
  <legend>Select Size</legend>
  
  <div style={{ display: 'flex', gap: '12px' }}>
    {['S', 'M', 'L', 'XL'].map((size) => (
      <div key={size}>
        <Radio
          name="size"
          value={size}
          id={`size-${size}`}
        />
        <Label htmlFor={`size-${size}`}>
          {size}
        </Label>
      </div>
    ))}
  </div>
</fieldset>
```

### With Form Submission
```tsx
<form onSubmit={handleSubmit}>
  <fieldset>
    <legend>Newsletter Frequency</legend>
    
    <div>
      <Radio name="frequency" value="daily" id="daily" />
      <Label htmlFor="daily">Daily</Label>
    </div>
    
    <div>
      <Radio name="frequency" value="weekly" id="weekly" defaultChecked />
      <Label htmlFor="weekly">Weekly</Label>
    </div>
    
    <div>
      <Radio name="frequency" value="monthly" id="monthly" />
      <Label htmlFor="monthly">Monthly</Label>
    </div>
  </fieldset>
  
  <Button type="submit">Subscribe</Button>
</form>
```

### Required Radio Group
```tsx
<fieldset>
  <legend>
    Delivery Preference <span aria-label="required">*</span>
  </legend>
  
  <div>
    <Radio name="delivery" value="home" id="home" required />
    <Label htmlFor="home">Home Delivery</Label>
  </div>
  
  <div>
    <Radio name="delivery" value="pickup" id="pickup" required />
    <Label htmlFor="pickup">Store Pickup</Label>
  </div>
</fieldset>
```
