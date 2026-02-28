# Link

## Intention
Navigate between pages or sections with accessible hyperlinks.

## Description
Link is a polymorphic component that renders hyperlinks with consistent styling and accessibility features. It supports multiple visual variants, sizes, and can render as different HTML elements (anchor, button, etc.) using the `as` prop.

In ecommerce, links are used for navigation menus, product titles, breadcrumbs, and footer links.

## Import
```tsx
import { Link } from '@faststore/components'
```

## Props

| Name | Type | Default | Required | Description |
|------|------|---------|----------|-------------|
| `testId` | `string` | `'fs-link'` | No | ID for testing tools |
| `as` | `ElementType` | `'a'` | No | HTML element or component to render as |
| `variant` | `'default' \| 'display' \| 'inline'` | `'default'` | No | Visual variant |
| `size` | `'small' \| 'regular'` | `'regular'` | No | Size variant |
| `inverse` | `boolean` | `false` | No | Inverts colors for dark backgrounds |
| `href` | `string` | - | No | Link destination (when using as anchor) |
| `children` | `ReactNode` | - | Yes | Link text content |

Extends attributes based on the `as` prop element (e.g., `AnchorHTMLAttributes` when `as="a"`).

## Polymorphic Component

Link is polymorphic, meaning it can render as different elements while maintaining consistent styling:

```tsx
// Renders as <a>
<Link href="/products">Products</Link>

// Renders as Next.js Link
<Link as={NextLink} to="/products">Products</Link>

// Renders as button
<Link as="button" onClick={handleClick}>Action</Link>
```

## Variants

### Visual Variants

- **`default`**: Standard link styling with underline
  - Use for: Navigation, footer links, general links

- **`display`**: Bold, prominent link without underline
  - Use for: Product titles, category headers, primary navigation

- **`inline`**: Subtle inline link within text
  - Use for: Links within paragraphs, breadcrumbs

### Size Variants

- **`regular`** (default): Standard text size
- **`small`**: Smaller text for compact contexts

## Accessibility

- Uses semantic navigation elements (`<a>`, `<button>`, etc.)
- **External links**: Add `rel="noopener noreferrer"` for security
- **Opens new tab**: Include `aria-label` describing behavior
- **Button links**: Ensure proper keyboard interaction
- Maintains visible focus indicator
- Color contrast meets WCAG AA standards

## CSS Custom Properties

```scss
// Default
--fs-link-text-color: var(--fs-color-link)
--fs-link-text-color-hover: var(--fs-color-link-hover)
--fs-link-text-decoration: underline
--fs-link-text-decoration-hover: none

// Display
--fs-link-display-text-color: var(--fs-color-text)
--fs-link-display-text-decoration: none
--fs-link-display-text-weight: var(--fs-text-weight-bold)

// Inline
--fs-link-inline-text-color: var(--fs-color-link)
--fs-link-inline-text-decoration: underline
--fs-link-inline-text-weight: var(--fs-text-weight-regular)

// Size
--fs-link-text-size: var(--fs-text-size-base)
--fs-link-small-text-size: var(--fs-text-size-small)
```

## Data Attributes

```tsx
<a
  data-fs-link
  data-fs-link-variant="default"
  data-fs-link-size="regular"
  data-fs-link-inverse="false"
  data-testid="fs-link"
>
  {children}
</a>
```

## Best Practices

### Do's
✅ Use descriptive link text ("View Product Details" not "Click Here")  
✅ Provide visual hover/focus feedback  
✅ Use appropriate variant for context  
✅ Add external link indicators when needed  
✅ Ensure adequate touch target size (min 44x44px)

### Don'ts
❌ Don't use "click here" or "read more" without context  
❌ Don't use links for actions (use buttons instead)  
❌ Don't rely on color alone to indicate links  
❌ Don't create link text that is too long  
❌ Don't forget focus states

### Links vs Buttons

- **Links**: Navigate to new pages or sections (href)
- **Buttons**: Trigger actions (onClick)

## Related Components

- [LinkButton](../molecules/LinkButton.md) - Link styled as a button
- [Button](./Button.md) - For actions instead of navigation
- [Breadcrumb](../molecules/Breadcrumb.md) - Uses links for navigation path

## Examples

### Basic Link
```tsx
<Link href="/products">View All Products</Link>
```

### Display Variant (Product Title)
```tsx
<Link variant="display" href="/product/123">
  Premium Wireless Headphones
</Link>
```

### Inline Link (in text)
```tsx
<p>
  Read our <Link variant="inline" href="/privacy">privacy policy</Link> for details.
</p>
```

### Small Size
```tsx
<Link size="small" href="/help">
  Need help?
</Link>
```

### External Link
```tsx
<Link
  href="https://example.com"
  target="_blank"
  rel="noopener noreferrer"
  aria-label="Visit example.com (opens in new tab)"
>
  Visit Example.com
</Link>
```

### Inverse (on dark background)
```tsx
<div style={{ background: '#000', padding: '20px' }}>
  <Link inverse href="/about">
    About Us
  </Link>
</div>
```

### With Next.js Link
```tsx
import NextLink from 'next/link'

<Link as={NextLink} href="/products">
  Products
</Link>
```

### Breadcrumb Style
```tsx
<nav aria-label="Breadcrumb">
  <Link variant="inline" size="small" href="/">Home</Link>
  {' / '}
  <Link variant="inline" size="small" href="/category">Category</Link>
  {' / '}
  <span>Product</span>
</nav>
```

### Button-styled Link (use LinkButton component instead)
```tsx
{/* For button styling on links, use LinkButton molecule */}
<LinkButton href="/checkout">
  Proceed to Checkout
</LinkButton>
```
