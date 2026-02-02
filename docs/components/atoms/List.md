# List

## Intention
Display ordered or unordered lists with semantic HTML and optional markers.

## Description
List is a polymorphic component that renders semantic `<ul>` or `<ol>` elements with configurable list markers (bullets/numbers). It provides consistent styling and accessibility for various list use cases.

In ecommerce, lists are used for product features, specifications, navigation menus, and step-by-step instructions.

## Import
```tsx
import { List } from '@faststore/components'
```

## Props

| Name | Type | Default | Required | Description |
|------|------|---------|----------|-------------|
| `testId` | `string` | `'fs-list'` | No | ID for testing tools |
| `as` | `ElementType` | `'ul'` | No | List element type (`ul` or `ol`) |
| `marker` | `boolean` | `false` | No | Display list markers (bullets or numbers) |
| `children` | `ReactNode` | - | Yes | List items content |

Extends attributes based on the `as` prop (`ul` or `ol` HTML attributes).

## List Types

### Unordered List (`ul`)
For items without inherent order:
```tsx
<List as="ul" marker>
  <li>Feature one</li>
  <li>Feature two</li>
  <li>Feature three</li>
</List>
```

### Ordered List (`ol`)
For sequential or ranked items:
```tsx
<List as="ol" marker>
  <li>First step</li>
  <li>Second step</li>
  <li>Third step</li>
</List>
```

## Markers

- **`marker={false}`** (default): No visible markers (CSS: `list-style: none`)
- **`marker={true}`**: Shows bullets (ul) or numbers (ol)

Markerless lists are useful for navigation menus, product grids, or custom-styled lists.

## Accessibility

- Uses semantic `<ul>` or `<ol>` elements
- Includes `role="list"` for screen reader compatibility
- List items should use `<li>` elements
- Nested lists maintain proper hierarchy
- Screen readers announce list length and current item

## CSS Custom Properties

```scss
--fs-list-padding: 0
--fs-list-margin: 0

// With markers
--fs-list-marker-padding-left: var(--fs-spacing-4)
```

## Data Attributes

```tsx
<ul
  data-fs-list
  data-fs-list-marker="false"
  data-testid="fs-list"
  role="list"
>
  {children}
</ul>
```

## Best Practices

### Do's
✅ Use `<li>` elements for list items  
✅ Choose appropriate list type (ordered vs unordered)  
✅ Show markers when list order/items are important  
✅ Use semantic nesting for hierarchical lists  
✅ Keep list items concise and scannable

### Don'ts
❌ Don't use lists for non-list content  
❌ Don't use divs instead of `<li>` elements  
❌ Don't override list semantics without good reason  
❌ Don't create deeply nested lists (max 3 levels)

### When to Use Markers

**Show Markers:**
- Product features and specifications
- Step-by-step instructions
- Ranked items or priorities
- Traditional bulleted/numbered lists

**Hide Markers:**
- Navigation menus
- Product grids/cards
- Custom-styled list items
- Horizontal lists

## Related Components

- [NavbarLinks](../molecules/NavbarLinks.md) - Uses List for navigation
- [Breadcrumb](../molecules/Breadcrumb.md) - Ordered list for navigation path
- [ProductCard](../molecules/ProductCard.md) - Often displayed in lists

## Examples

### Unordered List with Markers
```tsx
<List as="ul" marker>
  <li>Free shipping on orders over $50</li>
  <li>30-day money-back guarantee</li>
  <li>2-year warranty</li>
</List>
```

### Ordered List with Markers
```tsx
<List as="ol" marker>
  <li>Add items to cart</li>
  <li>Proceed to checkout</li>
  <li>Enter shipping information</li>
  <li>Complete payment</li>
</List>
```

### List without Markers (Navigation)
```tsx
<nav>
  <List as="ul">
    <li><Link href="/">Home</Link></li>
    <li><Link href="/products">Products</Link></li>
    <li><Link href="/about">About</Link></li>
    <li><Link href="/contact">Contact</Link></li>
  </List>
</nav>
```

### Product Features
```tsx
<section>
  <h3>Product Features</h3>
  <List as="ul" marker>
    <li>Wireless Bluetooth 5.0</li>
    <li>40-hour battery life</li>
    <li>Active noise cancellation</li>
    <li>Foldable design</li>
  </List>
</section>
```

### Nested List
```tsx
<List as="ul" marker>
  <li>
    Electronics
    <List as="ul" marker>
      <li>Phones</li>
      <li>Laptops</li>
      <li>Tablets</li>
    </List>
  </li>
  <li>
    Clothing
    <List as="ul" marker>
      <li>Men</li>
      <li>Women</li>
      <li>Kids</li>
    </List>
  </li>
</List>
```

### Horizontal List (with custom CSS)
```tsx
<List as="ul" style={{ display: 'flex', gap: '16px' }}>
  <li><Link href="/new">New Arrivals</Link></li>
  <li><Link href="/sale">Sale</Link></li>
  <li><Link href="/trending">Trending</Link></li>
</List>
```

### Description List Alternative
```tsx
{/* For key-value pairs, use HTML dl/dt/dd instead */}
<dl>
  <dt>SKU</dt>
  <dd>PRD-12345</dd>
  <dt>Availability</dt>
  <dd>In Stock</dd>
</dl>
```
