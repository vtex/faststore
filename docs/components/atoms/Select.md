# Select

## Intention
Dropdown menu for selecting a single option from a list.

## Description
Select is a styled wrapper around the native HTML `<select>` element with a custom dropdown icon. It accepts an options object and renders a dropdown menu for single selection. Best for lists with 5+ options where space is limited.

In ecommerce, selects are used for sorting products, quantity selection, country/state pickers, and filter options.

## Import
```tsx
import { Select } from '@faststore/components'
```

## Props

| Name | Type | Default | Required | Description |
|------|------|---------|----------|-------------|
| `testId` | `string` | `'fs-select'` | No | ID for testing tools |
| `id` | `string` | - | Yes | ID for label association |
| `options` | `Record<string, string>` | - | Yes | Options object (key: value, value: display text) |
| `value` | `string` | - | No | Controlled selected value |
| `defaultValue` | `string` | - | No | Initial selected value (uncontrolled) |
| `onChange` | `function` | - | No | Callback when selection changes |
| `disabled` | `boolean` | `false` | No | Disables select |
| `required` | `boolean` | `false` | No | Makes field required |

Extends `SelectHTMLAttributes<HTMLSelectElement>` for additional native select props.

## Options Format

Options are provided as an object where keys are the form values and values are the display text:

```tsx
const options = {
  'standard': 'Standard Shipping',
  'express': 'Express Shipping',
  'overnight': 'Overnight Shipping'
}

<Select id="shipping" options={options} />
```

## Accessibility

- Uses semantic `<select>` element with native keyboard navigation
- **Required**: Pair with `<Label>` using matching `id`/`htmlFor`
- Keyboard interaction:
  - **Arrow keys**: Navigate options
  - **Enter/Space**: Open/select
  - **Type**: Jump to matching option
- Screen readers announce option count and selected item
- Supports `aria-describedby` for helper text

## CSS Custom Properties

```scss
--fs-select-height: var(--fs-spacing-6)
--fs-select-padding: var(--fs-spacing-2) var(--fs-spacing-6) var(--fs-spacing-2) var(--fs-spacing-3)
--fs-select-border-radius: var(--fs-border-radius)
--fs-select-border-width: var(--fs-border-width)
--fs-select-border-color: var(--fs-border-color)
--fs-select-border-color-hover: var(--fs-border-color-hover)
--fs-select-border-color-focus: var(--fs-color-focus-ring)
--fs-select-bkg-color: var(--fs-color-body-bkg)
--fs-select-text-color: var(--fs-color-text)
--fs-select-text-size: var(--fs-text-size-base)
--fs-select-icon-size: var(--fs-spacing-4)
--fs-select-disabled-bkg-color: var(--fs-color-disabled-bkg)
```

## Data Attributes

```tsx
<div data-fs-select>
  <select id="sort" data-testid="fs-select">
    <option value="price-asc">Price: Low to High</option>
    <option value="price-desc">Price: High to Low</option>
  </select>
  <Icon data-fs-select-icon name="CaretDown" />
</div>
```

## Best Practices

### Do's
✅ Always pair with visible label  
✅ Use for 5+ options (use Radio for fewer)  
✅ Provide meaningful option text  
✅ Set default selection when appropriate  
✅ Group related options with `<optgroup>`  
✅ Order options logically (alphabetical, by popularity, etc.)

### Don'ts
❌ Don't use for 2-4 options (use Radio instead)  
❌ Don't use for multi-select (use checkboxes)  
❌ Don't use placeholder as first option (accessibility issue)  
❌ Don't forget to handle empty/null selection  
❌ Don't truncate important option text

### Select vs Radio vs Checkboxes

- **Select**: 5+ options, single selection, space-efficient
- **Radio**: 2-7 options, single selection, all visible
- **Checkboxes**: Multiple selections

## Related Components

- [SelectField](../molecules/SelectField.md) - Select with integrated label
- [Radio](./Radio.md) - For fewer options (2-7)
- [Dropdown](../molecules/Dropdown.md) - Custom dropdown with more flexibility

## Examples

### Basic Select
```tsx
const shippingOptions = {
  'standard': 'Standard Shipping (5-7 days)',
  'express': 'Express Shipping (2-3 days)',
  'overnight': 'Overnight Shipping'
}

<Label htmlFor="shipping">Shipping Method</Label>
<Select id="shipping" options={shippingOptions} />
```

### Controlled Select
```tsx
const [sortBy, setSortBy] = useState('price-asc')

const sortOptions = {
  'relevance': 'Most Relevant',
  'price-asc': 'Price: Low to High',
  'price-desc': 'Price: High to Low',
  'name-asc': 'Name: A-Z'
}

<Select
  id="sort"
  options={sortOptions}
  value={sortBy}
  onChange={(e) => setSortBy(e.target.value)}
/>
```

### With Default Value
```tsx
<Select
  id="country"
  options={{
    'us': 'United States',
    'ca': 'Canada',
    'uk': 'United Kingdom'
  }}
  defaultValue="us"
/>
```

### Quantity Selector
```tsx
const quantities = {
  '1': '1',
  '2': '2',
  '3': '3',
  '4': '4',
  '5': '5+'
}

<Label htmlFor="quantity">Quantity</Label>
<Select id="quantity" options={quantities} defaultValue="1" />
```

### Product Sort
```tsx
const sortOptions = {
  'featured': 'Featured',
  'newest': 'Newest',
  'price-low': 'Price: Low to High',
  'price-high': 'Price: High to Low',
  'rating': 'Highest Rated'
}

<Label htmlFor="product-sort">Sort by</Label>
<Select
  id="product-sort"
  options={sortOptions}
  defaultValue="featured"
  onChange={handleSortChange}
/>
```

### Disabled Select
```tsx
<Select
  id="unavailable"
  options={{ 'option': 'Unavailable' }}
  disabled
/>
```

### Required Field
```tsx
<form onSubmit={handleSubmit}>
  <Label htmlFor="size">
    Size <span aria-label="required">*</span>
  </Label>
  <Select
    id="size"
    options={{
      '': 'Select a size',
      's': 'Small',
      'm': 'Medium',
      'l': 'Large',
      'xl': 'Extra Large'
    }}
    required
  />
  <Button type="submit">Add to Cart</Button>
</form>
```

### State/Province Selector
```tsx
const usStates = {
  'AL': 'Alabama',
  'AK': 'Alaska',
  'AZ': 'Arizona',
  // ... more states
  'WY': 'Wyoming'
}

<Label htmlFor="state">State</Label>
<Select id="state" options={usStates} />
```

### With Helper Text
```tsx
<div>
  <Label htmlFor="shipping-method">Shipping Method</Label>
  <Select
    id="shipping-method"
    options={shippingOptions}
    aria-describedby="shipping-help"
  />
  <small id="shipping-help">
    Choose your preferred delivery speed
  </small>
</div>
```

### Currency Selector
```tsx
const currencies = {
  'USD': '$ USD',
  'EUR': '€ EUR',
  'GBP': '£ GBP',
  'JPY': '¥ JPY'
}

<Select id="currency" options={currencies} defaultValue="USD" />
```

### Page Size Selector
```tsx
const pageSizes = {
  '12': '12 per page',
  '24': '24 per page',
  '48': '48 per page',
  '96': '96 per page'
}

<Label htmlFor="page-size">Show</Label>
<Select id="page-size" options={pageSizes} defaultValue="24" />
```
