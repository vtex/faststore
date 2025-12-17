# SelectFieldCompact

A compact select field component with a floating label that sits inside the field. This component is ideal for space-constrained layouts and provides a modern, material-design-inspired interface.

## Features

- **Floating Label**: Label floats inside the field and moves up when focused or has a value
- **Error States**: Display error messages with visual feedback
- **Disabled State**: Prevents interaction when disabled
- **Loading State**: Shows a loader instead of the dropdown icon
- **Native Select**: Uses the browser's native select dropdown for better accessibility and UX

## Usage

```tsx
import { SelectFieldCompact } from '@faststore/components'

const options = {
  'option1': 'Option 1',
  'option2': 'Option 2',
  'option3': 'Option 3',
}

function Example() {
  return (
    <SelectFieldCompact
      id="my-select"
      label="Select label..."
      options={options}
      value="option1"
      onChange={(e) => console.log(e.target.value)}
    />
  )
}
```

## Props

All props from the native `<select>` element are supported, plus:

| Prop | Type | Description | Required |
|------|------|-------------|----------|
| `id` | `string` | Unique identifier for the select and label | Yes |
| `label` | `string` | Label text displayed in the field | Yes |
| `options` | `Record<string, string>` | Options object with keys as values and values as display text | Yes |
| `error` | `string` | Error message to display below the field | No |
| `disabled` | `boolean` | Whether the field is disabled | No |
| `loading` | `boolean` | Whether to show a loading state | No |
| `selectRef` | `MutableRefObject<HTMLSelectElement>` | Ref for the select element | No |
| `testId` | `string` | ID for testing tools (default: 'fs-select-field-compact') | No |

## Examples

### With Error

```tsx
<SelectFieldCompact
  id="error-example"
  label="Country"
  options={countries}
  error="Please select a valid country"
/>
```

### Loading State

```tsx
<SelectFieldCompact
  id="loading-example"
  label="Loading options..."
  options={options}
  loading={true}
/>
```

### Disabled

```tsx
<SelectFieldCompact
  id="disabled-example"
  label="Unavailable"
  options={options}
  disabled={true}
/>
```

## Difference from SelectField

- **SelectField**: Label appears outside/beside the select (traditional layout)
- **SelectFieldCompact**: Label appears inside the select field and floats up (compact, material design layout)

## Styling

The component uses data attributes for styling:
- `[data-fs-select-field-compact]` - Main container
- `[data-fs-select-field-compact-wrapper]` - Inner wrapper
- `[data-fs-select-field-compact-select]` - The select element
- `[data-fs-select-field-compact-label]` - The floating label
- `[data-fs-select-field-compact-icon]` - The dropdown icon
- `[data-fs-select-field-compact-loader]` - The loading indicator
- `[data-fs-select-field-compact-error-message]` - Error message text

### State Attributes

- `[data-fs-select-field-compact-error="true"]` - Applied when there's an error
- `[data-fs-select-field-compact-disabled="true"]` - Applied when disabled
- `[data-fs-select-field-compact-loading="true"]` - Applied when loading

