# Slider

## Intention
Enable range selection with dual-thumb slider for filtering numeric values.

## Description
Slider is a dual-range input component that allows users to select minimum and maximum values within a defined range. It features two draggable thumbs, visual range indicator, absolute value labels, and optional value display labels above thumbs. Commonly used for price and numeric filtering.

In ecommerce, sliders are essential for price range filters, rating filters, and numeric product attribute filtering.

## Import
```tsx
import { Slider } from '@faststore/components'
```

## Props

| Name | Type | Default | Required | Description |
|------|------|---------|----------|-------------|
| `testId` | `string` | `'fs-slider'` | No | ID for testing tools |
| `min` | `{ absolute: number, selected: number }` | - | Yes | Minimum range values |
| `max` | `{ absolute: number, selected: number }` | - | Yes | Maximum range values |
| `step` | `number` | - | No | Value increment/decrement step |
| `absoluteValuesLabel` | `{ min: ReactNode, max: ReactNode }` | - | Yes | Labels for absolute min/max values |
| `onChange` | `(value: { min: number, max: number }) => void` | - | No | Fires during dragging |
| `onEnd` | `(value: { min: number, max: number }) => void` | - | No | Fires when dragging ends |
| `getAriaValueText` | `(value: number, thumb?: 'min' \| 'max') => string` | - | No | ARIA value text formatter |
| `minValueLabelComponent` | `(minValue: number) => ReactNode` | - | No | Custom label above min thumb |
| `maxValueLabelComponent` | `(maxValue: number) => ReactNode` | - | No | Custom label above max thumb |

## Range Values

### Absolute Range
The total possible range (e.g., $0 - $1000):
```tsx
min={{ absolute: 0, selected: 20 }}
max={{ absolute: 1000, selected: 500 }}
```

### Selected Range
Current user selection within absolute range

## Ref Methods

Slider provides imperative methods via ref:

```tsx
const sliderRef = useRef<SliderRefType>()

// Update slider values programmatically
sliderRef.current?.setSliderValues({ min: 100, max: 500 })
```

## Accessibility

- Uses native `<input type="range">` elements (two inputs)
- Keyboard interaction:
  - **Arrow keys**: Adjust value (respects step)
  - **Home/End**: Jump to min/max
  - **Page Up/Down**: Larger increments
- ARIA attributes:
  - `aria-valuemin`, `aria-valuemax`, `aria-valuenow`
  - Custom `aria-labelledby` via `getAriaValueText`
- Screen readers announce current value and range
- Both thumbs are independently focusable

## CSS Custom Properties

```scss
--fs-slider-height: var(--fs-spacing-0)
--fs-slider-border-radius: var(--fs-border-radius)
--fs-slider-bkg-color: var(--fs-color-neutral-bkg)

// Selected range
--fs-slider-range-bkg-color: var(--fs-color-primary)

// Thumbs
--fs-slider-thumb-size: var(--fs-spacing-3)
--fs-slider-thumb-bkg-color: var(--fs-color-primary)
--fs-slider-thumb-border-width: var(--fs-border-width)
--fs-slider-thumb-border-color: var(--fs-color-primary)

// Value labels
--fs-slider-value-label-bkg-color: var(--fs-color-primary)
--fs-slider-value-label-text-color: var(--fs-color-text-inverse)
```

## Data Attributes

```tsx
<div data-fs-slider data-testid="fs-slider">
  <div data-fs-slider-absolute-values>
    <span>{absoluteValuesLabel.min}</span>
    <span>{absoluteValuesLabel.max}</span>
  </div>
  
  <div data-fs-slider-wrapper>
    <div data-fs-slider-range style={{ left: '20%', width: '60%' }} />
    <input data-fs-slider-thumb="left" type="range" />
    <input data-fs-slider-thumb="right" type="range" />
    <span data-fs-slider-value-label="min">{minValue}</span>
    <span data-fs-slider-value-label="max">{maxValue}</span>
  </div>
</div>
```

## Best Practices

### Do's
✅ Use for numeric range filtering (price, ratings, dates)  
✅ Show absolute min/max values  
✅ Provide value labels above thumbs for clarity  
✅ Use appropriate step size for smooth interaction  
✅ Update results in real-time or on drag end  
✅ Reset to full range when clearing filters

### Don'ts
❌ Don't use for categorical data  
❌ Don't make steps too large or too small  
❌ Don't hide current selected values  
❌ Don't trigger expensive operations on every onChange  
❌ Don't use for single value selection (use regular input)

### onChange vs onEnd

- **`onChange`**: Fires continuously during dragging
  - Use for: Real-time preview, value display updates
  - Avoid: Expensive operations (API calls, heavy filtering)

- **`onEnd`**: Fires once when drag completes
  - Use for: API calls, product filtering, analytics
  - Best for: Performance optimization

## Related Components

- [PriceRange](../../organisms/PriceRange.md) - Price filter with slider
- [Input](./Input.md) - For precise numeric entry
- [Select](./Select.md) - For discrete options

## Examples

### Basic Price Slider
```tsx
const [priceRange, setPriceRange] = useState({ min: 0, max: 1000 })

<Slider
  min={{ absolute: 0, selected: priceRange.min }}
  max={{ absolute: 1000, selected: priceRange.max }}
  absoluteValuesLabel={{ min: '$0', max: '$1000' }}
  step={10}
  onEnd={(value) => setPriceRange(value)}
/>
```

### With Value Labels
```tsx
<Slider
  min={{ absolute: 0, selected: 100 }}
  max={{ absolute: 1000, selected: 500 }}
  absoluteValuesLabel={{ min: '$0', max: '$1000' }}
  minValueLabelComponent={(value) => `$${value}`}
  maxValueLabelComponent={(value) => `$${value}`}
  onEnd={handlePriceChange}
/>
```

### With ARIA Labels
```tsx
<Slider
  min={{ absolute: 0, selected: 20 }}
  max={{ absolute: 100, selected: 80 }}
  absoluteValuesLabel={{ min: '0', max: '100' }}
  getAriaValueText={(value, thumb) =>
    `${thumb === 'min' ? 'Minimum' : 'Maximum'} price: $${value}`
  }
/>
```

### Real-time Updates
```tsx
const [range, setRange] = useState({ min: 0, max: 100 })
const [selectedRange, setSelectedRange] = useState(range)

<div>
  <p>Selected: ${selectedRange.min} - ${selectedRange.max}</p>
  
  <Slider
    min={{ absolute: 0, selected: selectedRange.min }}
    max={{ absolute: 100, selected: selectedRange.max }}
    absoluteValuesLabel={{ min: '$0', max: '$100' }}
    onChange={(value) => setRange(value)}  // Real-time display
    onEnd={(value) => setSelectedRange(value)}  // Apply filter
  />
</div>
```

### With Step
```tsx
<Slider
  min={{ absolute: 0, selected: 0 }}
  max={{ absolute: 1000, selected: 1000 }}
  absoluteValuesLabel={{ min: '$0', max: '$1000' }}
  step={50}  // Increments of $50
  onEnd={applyPriceFilter}
/>
```

### Rating Filter
```tsx
<Slider
  min={{ absolute: 1, selected: 1 }}
  max={{ absolute: 5, selected: 5 }}
  absoluteValuesLabel={{ min: '1★', max: '5★' }}
  step={1}
  minValueLabelComponent={(value) => `${value}★`}
  maxValueLabelComponent={(value) => `${value}★`}
  onEnd={filterByRating}
/>
```

### With Ref
```tsx
const sliderRef = useRef<SliderRefType>()

const resetPriceRange = () => {
  sliderRef.current?.setSliderValues({ min: 0, max: 1000 })
}

<>
  <Slider
    ref={sliderRef}
    min={{ absolute: 0, selected: 0 }}
    max={{ absolute: 1000, selected: 1000 }}
    absoluteValuesLabel={{ min: '$0', max: '$1000' }}
  />
  <Button onClick={resetPriceRange}>Reset</Button>
</>
```

### Discount Filter
```tsx
<Slider
  min={{ absolute: 0, selected: 0 }}
  max={{ absolute: 100, selected: 100 }}
  absoluteValuesLabel={{ min: '0%', max: '100%' }}
  step={5}
  minValueLabelComponent={(value) => `${value}% off`}
  maxValueLabelComponent={(value) => `${value}% off`}
  onEnd={filterByDiscount}
/>
```

### Year Range
```tsx
<Slider
  min={{ absolute: 2000, selected: 2010 }}
  max={{ absolute: 2024, selected: 2024 }}
  absoluteValuesLabel={{ min: '2000', max: '2024' }}
  step={1}
  onEnd={filterByYear}
/>
```
