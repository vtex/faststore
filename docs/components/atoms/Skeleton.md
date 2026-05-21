# Skeleton

## Intention
Display loading placeholders that mimic content layout during data fetching.

## Description
Skeleton is a content placeholder component that shows a loading state with an optional shimmer animation. It provides visual feedback while content loads, maintaining perceived performance and layout stability. When loading completes, it renders the actual content.

In ecommerce, skeletons appear during product loading, image loading, and initial page loads.

## Import
```tsx
import { Skeleton } from '@faststore/components'
```

## Props

| Name | Type | Default | Required | Description |
|------|------|---------|----------|-------------|
| `testId` | `string` | `'fs-skeleton'` | No | ID for testing tools |
| `loading` | `boolean` | `true` | No | Controls skeleton visibility |
| `shimmer` | `boolean` | `true` | No | Enable shimmer animation effect |
| `size` | `{ width: string, height: string }` | - | Yes | Skeleton dimensions |
| `border` | `'regular' \| 'pill' \| 'circle'` | - | No | Predefined border radius style |
| `borderRadius` | `string` | - | No | Custom border radius (overrides border) |
| `children` | `ReactNode` | - | No | Actual content to display when loading=false |

Extends `HTMLAttributes<HTMLDivElement>` for additional div attributes.

## Loading States

The component behavior depends on `loading` prop:
- **`loading={true}`**: Shows skeleton placeholder
- **`loading={false}`**: Renders children (actual content)

## Border Styles

- **`regular`**: Standard border radius
- **`pill`**: Fully rounded ends (for buttons, badges)
- **`circle`**: Perfect circle (for avatars, icons)
- **`borderRadius`**: Custom value (e.g., "8px", "50%")

## Shimmer Effect

The shimmer animation provides visual feedback that content is loading:
- **`shimmer={true}`** (default): Animated gradient sweep
- **`shimmer={false}`**: Static gray placeholder

## Accessibility

- Decorative component (not announced by screen readers)
- Maintains layout space to prevent content shift
- Should be replaced with actual content quickly (< 3 seconds ideal)
- Use `aria-busy="true"` on parent container when skeletons are visible
- Consider adding `aria-live="polite"` for content updates

## CSS Custom Properties

```scss
--fs-skeleton-bkg-color: var(--fs-color-neutral-bkg)
--fs-skeleton-border-radius-regular: var(--fs-border-radius)
--fs-skeleton-border-radius-pill: var(--fs-border-radius-pill)
--fs-skeleton-border-radius-circle: var(--fs-border-radius-circle)

// Shimmer effect
--fs-skeleton-shimmer-color: rgba(255, 255, 255, 0.3)
--fs-skeleton-shimmer-duration: 1.5s
```

## Data Attributes

```tsx
<div
  data-fs-skeleton
  data-fs-skeleton-border="regular"
  data-testid="fs-skeleton"
  style={{ width: '200px', height: '20px' }}
>
  <div data-fs-skeleton-shimmer />
</div>
```

## Best Practices

### Do's
✅ Match skeleton size to actual content dimensions  
✅ Use multiple skeletons for complex layouts  
✅ Maintain layout structure with skeletons  
✅ Use appropriate border styles (circle for avatars, pill for buttons)  
✅ Show skeletons immediately on load  
✅ Replace with actual content as soon as available

### Don'ts
❌ Don't use for instant/very fast operations  
❌ Don't mismatch skeleton and content dimensions  
❌ Don't show skeletons indefinitely  
❌ Don't use for error states (show error message instead)  
❌ Don't animate skeleton entrance (it should appear immediately)

### Skeleton Patterns

**Product Card Skeleton**
```tsx
<Skeleton loading={isLoading} size={{ width: '100%', height: '300px' }}>
  <ProductCard product={data} />
</Skeleton>
```

**Text Lines**
```tsx
<Skeleton loading size={{ width: '100%', height: '20px' }} />
<Skeleton loading size={{ width: '80%', height: '20px' }} />
<Skeleton loading size={{ width: '90%', height: '20px' }} />
```

**Avatar**
```tsx
<Skeleton loading size={{ width: '48px', height: '48px' }} border="circle" />
```

## Related Components

- [ProductCardSkeleton](../../matter/skeletons/ProductCardSkeleton.md) - Pre-built product card skeleton
- [ProductGridSkeleton](../../matter/skeletons/ProductGridSkeleton.md) - Grid of product skeletons
- [Loader](./Loader.md) - Spinner for indeterminate loading

## Examples

### Basic Skeleton
```tsx
<Skeleton loading size={{ width: '200px', height: '20px' }} />
```

### With Content
```tsx
const [isLoading, setIsLoading] = useState(true)

<Skeleton
  loading={isLoading}
  size={{ width: '100%', height: '100px' }}
>
  <ProductImage src={imageUrl} />
</Skeleton>
```

### Border Styles
```tsx
{/* Regular border */}
<Skeleton
  loading
  size={{ width: '200px', height: '40px' }}
  border="regular"
/>

{/* Pill shape */}
<Skeleton
  loading
  size={{ width: '100px', height: '32px' }}
  border="pill"
/>

{/* Circle */}
<Skeleton
  loading
  size={{ width: '60px', height: '60px' }}
  border="circle"
/>

{/* Custom border radius */}
<Skeleton
  loading
  size={{ width: '200px', height: '100px' }}
  borderRadius="16px"
/>
```

### Without Shimmer
```tsx
<Skeleton
  loading
  size={{ width: '100%', height: '200px' }}
  shimmer={false}
/>
```

### Text Block Skeleton
```tsx
<div>
  <Skeleton loading size={{ width: '60%', height: '24px' }} />
  <div style={{ height: '8px' }} />
  <Skeleton loading size={{ width: '100%', height: '16px' }} />
  <Skeleton loading size={{ width: '95%', height: '16px' }} />
  <Skeleton loading size={{ width: '85%', height: '16px' }} />
</div>
```

### Product Card Skeleton
```tsx
<article style={{ width: '250px' }}>
  {/* Image */}
  <Skeleton loading size={{ width: '100%', height: '250px' }} />
  
  {/* Title */}
  <Skeleton loading size={{ width: '90%', height: '20px' }} style={{ marginTop: '12px' }} />
  <Skeleton loading size={{ width: '70%', height: '20px' }} />
  
  {/* Price */}
  <Skeleton loading size={{ width: '80px', height: '24px' }} style={{ marginTop: '8px' }} />
  
  {/* Button */}
  <Skeleton loading size={{ width: '100%', height: '40px' }} border="regular" style={{ marginTop: '12px' }} />
</article>
```

### Avatar with Name
```tsx
<div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
  <Skeleton loading size={{ width: '48px', height: '48px' }} border="circle">
    <img src={avatar} alt="User" />
  </Skeleton>
  
  <div>
    <Skeleton loading size={{ width: '150px', height: '20px' }}>
      <p>{userName}</p>
    </Skeleton>
    <Skeleton loading size={{ width: '100px', height: '16px' }}>
      <p>{userRole}</p>
    </Skeleton>
  </div>
</div>
```

### Conditional Loading
```tsx
{isLoading ? (
  <Skeleton loading size={{ width: '100%', height: '300px' }} />
) : (
  <ProductGrid products={products} />
)}
```

### Grid of Skeletons
```tsx
<div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '16px' }}>
  {Array.from({ length: 8 }).map((_, i) => (
    <Skeleton
      key={i}
      loading
      size={{ width: '100%', height: '200px' }}
    />
  ))}
</div>
```

### With Aria Attributes
```tsx
<div aria-busy={isLoading} aria-live="polite">
  <Skeleton
    loading={isLoading}
    size={{ width: '100%', height: '200px' }}
  >
    <ProductList products={products} />
  </Skeleton>
</div>
```
