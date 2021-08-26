# Slider

## Usage

```tsx
import { Slider } from '@vtex/store-ui'

function Example() {
  return (
    <div>
      <Slider min={0} max={100} />
    </div>
  )
}
```

## API

### Component

```tsx
<Slider min={0} max={100} />
```

### CSS Selectors

```css
[data-store-slider] {
}
[data-store-slider-range] {
}
[data-store-slider-track] {
}
[data-store-slider-thumb='(left|right)'] {
}
[data-store-slider-values] {
}
[data-store-slider-value='(min|max)'] {
}
```

### Props

| Prop             | Type    | Required | Default      |
| ---------------- | ------- | -------- | ------------ |
| min              | number  | true     |              |
| max              | number  | true     |              |
| showValues       | boolean | false    | true         |
| testId           | string  | false    | store-slider |
| onChange         | void    | false    |              |
| onChange         | void    | false    |              |
| onChange         | void    | false    |              |
| ariaLabel        | string  | false    |              |
| getAriaValueText | void    | false    |              |

## TODO

- [ ] [Keyboard Interaction](https://www.w3.org/TR/wai-aria-practices-1.2/#slidertwothumb_kbd_interaction)
- [ ] More test cases
- [ ] Support to orientation
