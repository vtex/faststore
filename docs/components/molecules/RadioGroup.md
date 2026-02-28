# RadioGroup

## Intention
Managed group of radio buttons with single selection.

## Description
RadioGroup wraps multiple radio options with automatic state management and keyboard navigation. Provides structured radio button group with proper ARIA attributes.

## Import
```tsx
import { RadioGroup } from '@faststore/components'
```

## Sub-components
- `RadioOption` - Individual radio with label

## Examples

```tsx
const [selected, setSelected] = useState('standard')

<RadioGroup
  name="shipping"
  selectedValue={selected}
  onChange={setSelected}
>
  <RadioOption value="standard" label="Standard Shipping" />
  <RadioOption value="express" label="Express Shipping" />
  <RadioOption value="overnight" label="Overnight" />
</RadioGroup>
```
