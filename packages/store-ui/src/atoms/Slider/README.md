# Slider

## Installation

From the command line in your project directory, run npm install `@vtex/store-ui` or yarn add `@vtex/store-ui`.

```cmd
npm install @vtex/store-ui
# or
yarn add @vtex/store-ui
```

For style, you can install our default theme, run npm install `@vtex/theme-b2c-tailwind` or yarn add `@vtex/theme-b2c-tailwind`:

```cmd
npm install @vtex/theme-b2c-tailwind
# or
yarn add @vtex/theme-b2c-tailwind
```

```tsx
import { Slider } from '@vtex/store-ui'
import '@vtex/theme-b2c-tailwind/dist/index.css'
```

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

| Prop       | Type    | Required | Default      |
| ---------- | ------- | -------- | ------------ |
| min        | number  | true     |              |
| max        | number  | true     |              |
| showValues | boolean | false    | true         |
| testId     | string  | false    | store-slider |
| onChange   | void    | false    |              |

## TODO

- [ ] [Keyboard Interaction](https://www.w3.org/TR/wai-aria-practices-1.2/#slidertwothumb_kbd_interaction)
- [ ] More test cases
- [ ] Support to orientation
