# SROnly

## Intention
Provide content visible only to screen readers, hidden from visual display.

## Description
SROnly (Screen Reader Only) is an accessibility component that renders content visibly hidden but accessible to screen readers. It's essential for providing context, labels, and instructions that are understood visually but need to be explicitly stated for assistive technologies.

In ecommerce, SROnly is used for icon-only buttons, loading states, dynamic updates, and supplemental information.

## Import
```tsx
import { SROnly } from '@faststore/components'
```

## Props

| Name | Type | Default | Required | Description |
|------|------|---------|----------|-------------|
| `text` | `string` | - | Yes | Text content for screen readers |
| `as` | `ElementType` | `'span'` | No | HTML element to render as |

## Visually Hidden Technique

The component uses CSS to hide content visually while keeping it accessible:

```css
[data-fs-sr-only] {
  position: absolute;
  width: 1px;
  height: 1px;
  padding: 0;
  margin: -1px;
  overflow: hidden;
  clip: rect(0, 0, 0, 0);
  white-space: nowrap;
  border-width: 0;
}
```

This technique ensures:
- Content is not displayed visually
- Content is in the DOM for screen readers
- Layout is not affected
- Content can be focused if needed

## Accessibility

- **Purpose**: Provide context for screen reader users
- **Not a substitute**: For proper semantic HTML
- **Use cases**:
  - Icon-only buttons
  - Loading state announcements
  - Skip links
  - Instructions for form fields
  - Dynamic content updates
- **Don't use for**: Content that should be visible to everyone

## CSS Custom Properties

SROnly doesn't use custom properties as it's visually hidden by design.

## Data Attributes

```tsx
<span data-fs-sr-only>
  {text}
</span>
```

## Best Practices

### Do's
✅ Use for icon-only buttons (e.g., "Close", "Search")  
✅ Announce loading states and updates  
✅ Provide context for ambiguous visual elements  
✅ Use for skip navigation links  
✅ Describe interactive elements lacking text labels

### Don'ts
❌ Don't hide important information everyone needs  
❌ Don't use as a replacement for proper labels  
❌ Don't overuse (creates verbose experience)  
❌ Don't duplicate visible text unnecessarily  
❌ Don't use for CSS styling purposes

### When to Use SROnly

**Good Use Cases:**
- Icon-only button labels
- "Loading..." announcements
- "New window" indicators for external links
- Form field instructions
- Status updates in dynamic content

**Bad Use Cases:**
- Hiding content that should be visible
- Long paragraphs of text
- Primary navigation
- Essential instructions
- Error messages

## Related Components

- [Icon](./Icon.md) - Often paired with SROnly for accessibility
- [Button](./Button.md) - Icon buttons need SROnly labels
- [Loader](./Loader.md) - Loading states should announce to screen readers

## Examples

### Icon-Only Button
```tsx
<button>
  <Icon name="ShoppingCart" aria-hidden="true" />
  <SROnly text="Add to cart" />
</button>
```

### Search Button
```tsx
<button type="submit">
  <Icon name="Search" aria-hidden="true" />
  <SROnly text="Search products" />
</button>
```

### Close Button
```tsx
<button onClick={onClose}>
  <Icon name="X" aria-hidden="true" />
  <SROnly text="Close dialog" />
</button>
```

### Loading State
```tsx
{isLoading && (
  <div role="status">
    <Loader aria-hidden="true" />
    <SROnly text="Loading products..." />
  </div>
)}
```

### External Link Indicator
```tsx
<a href="https://example.com" target="_blank" rel="noopener noreferrer">
  Visit Example.com
  <SROnly text="(opens in new window)" />
</a>
```

### Form Field Instructions
```tsx
<div>
  <Label htmlFor="password">Password</Label>
  <SROnly text="Must be at least 8 characters with one number" />
  <Input
    id="password"
    type="password"
    aria-describedby="password-help"
  />
  <small id="password-help">
    At least 8 characters with one number
  </small>
</div>
```

### Skip Navigation
```tsx
<a href="#main-content" style={skipLinkStyles}>
  <SROnly text="Skip to main content" />
</a>
```

### Dynamic Content Update
```tsx
<div aria-live="polite">
  {itemsAdded && (
    <SROnly text={`${itemsAdded} items added to cart`} />
  )}
</div>
```

### Current Page Indicator
```tsx
<nav>
  <a href="/" aria-current="page">
    Home
    <SROnly text="(current page)" />
  </a>
  <a href="/products">Products</a>
</nav>
```

### Required Field Indicator
```tsx
<Label htmlFor="email">
  Email
  <span aria-hidden="true">*</span>
  <SROnly text="(required)" />
</Label>
```

### Sort Controls
```tsx
<button onClick={sortAscending}>
  <Icon name="SortAsc" aria-hidden="true" />
  <SROnly text="Sort by price: low to high" />
</button>
```

### Pagination
```tsx
<nav aria-label="Pagination">
  <button disabled>
    <Icon name="ArrowLeft" aria-hidden="true" />
    <SROnly text="Previous page (disabled)" />
  </button>
  
  <SROnly as="span" text="Page 1 of 10" />
  
  <button>
    <Icon name="ArrowRight" aria-hidden="true" />
    <SROnly text="Next page" />
  </button>
</nav>
```

### Toggle State
```tsx
<button
  onClick={toggleFavorite}
  aria-pressed={isFavorite}
>
  <Icon name="Heart" aria-hidden="true" />
  <SROnly text={isFavorite ? "Remove from favorites" : "Add to favorites"} />
</button>
```

### Product Count
```tsx
<div>
  <h2>Search Results</h2>
  <SROnly text={`Showing ${count} products`} />
</div>
```

## Testing Accessibility

Test SROnly with:
- **Screen readers**: VoiceOver (Mac), NVDA (Windows), JAWS
- **Keyboard navigation**: Ensure focusable elements are accessible
- **Browser DevTools**: Check element is in DOM but not visible
- **Automated tools**: axe, Lighthouse, WAVE
