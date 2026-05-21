# Loader

## Intention
Indicate loading or processing states with an animated spinner.

## Description
Loader is an animated loading indicator that provides visual feedback during asynchronous operations. It supports light and dark color variants to adapt to different backgrounds.

In ecommerce, loaders appear during checkout processing, product data fetching, cart updates, and page transitions.

## Import
```tsx
import { Loader } from '@faststore/components'
```

## Props

| Name | Type | Default | Required | Description |
|------|------|---------|----------|-------------|
| `testId` | `string` | `'fs-loader'` | No | ID for testing tools |
| `variant` | `'light' \| 'dark'` | `'dark'` | No | Color variant for contrast with background |

Extends `HTMLAttributes<HTMLSpanElement>` for additional span attributes.

## Variants

- **`dark`** (default): Dark-colored loader for light backgrounds
- **`light`**: Light-colored loader for dark backgrounds

## Accessibility

- Uses semantic `<span>` element with presentation role
- Should be paired with accessible loading text:
  - Use `aria-label` on parent container
  - Include visually hidden loading message
  - OR use `aria-live` region for dynamic updates
- Does not block interaction (informational only)

## CSS Custom Properties

```scss
--fs-loader-size: var(--fs-spacing-3)
--fs-loader-animation-duration: 0.8s

// Dark Variant
--fs-loader-dark-color: var(--fs-color-text)

// Light Variant
--fs-loader-light-color: var(--fs-color-text-inverse)
```

## Data Attributes

```tsx
<span
  data-fs-loader
  data-fs-loader-variant="dark"
  data-testid="fs-loader"
>
  <span data-fs-loader-item></span>
  <span data-fs-loader-item></span>
  <span data-fs-loader-item></span>
</span>
```

## Best Practices

### Do's
✅ Show loaders for operations longer than 0.5 seconds  
✅ Use appropriate variant for background contrast  
✅ Provide accessible loading announcements  
✅ Use skeleton loaders for content placeholders  
✅ Center loaders within their containers

### Don'ts
❌ Don't show loaders for instant operations  
❌ Don't use loaders without accessible text  
❌ Don't nest multiple loaders  
❌ Don't block user interaction unnecessarily  
❌ Don't leave loaders indefinitely (handle errors)

### Loading State Patterns

**Button Loading State**
```tsx
<Button loading loadingLabel="Adding...">
  Add to Cart
</Button>
```

**Page Loading**
```tsx
<div aria-live="polite" aria-busy={isLoading}>
  {isLoading ? <Loader /> : <Content />}
</div>
```

**Inline Loading**
```tsx
<span>
  Processing <Loader variant="dark" />
</span>
```

## Related Components

- [Skeleton](./Skeleton.md) - Content placeholder loader
- [Button](./Button.md) - Has built-in loading state
- [Overlay](./Overlay.md) - Often used with loaders for full-page loading

## Examples

### Basic Usage
```tsx
<Loader />
<Loader variant="dark" />
<Loader variant="light" />
```

### With Accessible Text
```tsx
<div role="status" aria-label="Loading products">
  <Loader />
</div>

{/* OR with visually hidden text */}
<div>
  <SROnly>Loading products...</SROnly>
  <Loader />
</div>
```

### In Button (use Button's built-in loading)
```tsx
{/* Built-in button loading is preferred */}
<Button loading loadingLabel="Processing">
  Submit
</Button>
```

### Centered in Container
```tsx
<div style={{
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  minHeight: '200px'
}}>
  <Loader />
</div>
```

### On Dark Background
```tsx
<div style={{ background: '#000', padding: '20px' }}>
  <Loader variant="light" />
</div>
```

### With Loading Message
```tsx
<div style={{ textAlign: 'center' }}>
  <Loader />
  <p>Loading products...</p>
</div>
```

### Conditional Loading
```tsx
{isLoading ? (
  <div role="status" aria-label="Loading content">
    <Loader />
  </div>
) : (
  <ProductGrid products={products} />
)}
```

### Full Page Loader
```tsx
<Overlay>
  <div style={{
    position: 'fixed',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)'
  }}>
    <Loader />
  </div>
</Overlay>
```
