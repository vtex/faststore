# IconButton

## Intention
Icon-only button for actions where space is limited or visual clarity preferred.

## Description
IconButton is a specialized button variant that displays only an icon without text. It enforces accessibility requirements by making `aria-label` mandatory, ensuring screen reader users understand the button's purpose. Default variant is tertiary for subtle appearance.

In ecommerce, IconButtons are used for cart toggles, favorites, close dialogs, navigation, and compact actions.

## Import
```tsx
import { IconButton } from '@faststore/components'
```

## Props

| Name | Type | Default | Required | Description |
|------|------|---------|----------|-------------|
| `testId` | `string` | `'fs-icon-button'` | No | ID for testing tools |
| `icon` | `ReactNode` | - | Yes | Icon component to display |
| `aria-label` | `string` | - | Yes | Accessible label (REQUIRED) |
| `size` | `'small' \| 'regular'` | `'regular'` | No | Button size |
| `variant` | `'primary' \| 'secondary' \| 'tertiary'` | `'tertiary'` | No | Visual variant |

Inherits all Button props including `onClick`, `disabled`, `loading`, etc.

## Required Accessibility

**Critical**: `aria-label` is mandatory and enforced by TypeScript. Icon-only buttons without text labels are inaccessible without proper ARIA labels.

```tsx
// ✅ Correct
<IconButton
  icon={<Icon name="Heart" />}
  aria-label="Add to favorites"
/>

// ❌ TypeScript error - missing aria-label
<IconButton icon={<Icon name="Heart" />} />
```

## Sub-components

Extends [Button](../atoms/Button.md) component.

## Accessibility

- Uses semantic `<button>` element
- **`aria-label`**: Required - describes button action
- Icon should be decorative (`aria-hidden="true"` on Icon)
- Keyboard accessible (Space/Enter)
- Touch target minimum 44x44px
- Focus indicator must be visible
- Screen readers announce aria-label text

## CSS Custom Properties

Inherits Button properties with tertiary as default:

```scss
// Default tertiary variant
--fs-icon-button-bkg-color: transparent
--fs-icon-button-text-color: var(--fs-color-link)
--fs-icon-button-bkg-color-hover: var(--fs-color-neutral-bkg)

// Size
--fs-icon-button-min-width: var(--fs-spacing-6)
--fs-icon-button-min-height: var(--fs-spacing-6)
--fs-icon-button-padding: var(--fs-spacing-1)
```

## Data Attributes

```tsx
<button
  data-fs-button
  data-fs-icon-button
  data-testid="fs-icon-button"
  aria-label="Close dialog"
>
  <Icon name="X" />
</button>
```

## Best Practices

### Do's
✅ Always provide meaningful `aria-label`  
✅ Use recognizable icons (universal symbols)  
✅ Ensure adequate touch target size (min 44x44px)  
✅ Show tooltips on hover for additional context  
✅ Use consistent icon styling sitewide  
✅ Make icon descriptive (heart = favorite, not like)

### Don'ts
❌ Don't omit `aria-label` (TypeScript prevents this)  
❌ Don't use obscure icons without explanation  
❌ Don't make icon buttons too small  
❌ Don't use icon-only for critical, unfamiliar actions  
❌ Don't rely on color alone to convey state

### Icon Button vs Regular Button

**Use IconButton when:**
- Space is very limited
- Icon meaning is universally clear (X, heart, cart)
- Visual simplicity is needed
- In toolbars or dense UIs

**Use regular Button when:**
- Action is complex or unfamiliar
- Users may not recognize icon
- Primary call-to-action
- Text provides important context

## Related Components

- [Button](../atoms/Button.md) - Base button with text
- [Icon](../atoms/Icon.md) - Icon component
- [Tooltip](./Tooltip.md) - Add context on hover
- [BuyButton](./BuyButton.md) - Button with icon and text

## Examples

### Basic Usage
```tsx
<IconButton
  icon={<Icon name="Heart" />}
  aria-label="Add to favorites"
  onClick={handleFavorite}
/>
```

### Close Button
```tsx
<IconButton
  icon={<Icon name="X" />}
  aria-label="Close dialog"
  onClick={onClose}
/>
```

### Cart Toggle
```tsx
<IconButton
  icon={<Icon name="ShoppingCart" />}
  aria-label="Open shopping cart"
  onClick={() => setCartOpen(true)}
/>
```

### With Badge (Item Count)
```tsx
<div style={{ position: 'relative' }}>
  <IconButton
    icon={<Icon name="ShoppingCart" />}
    aria-label={`Shopping cart with ${itemCount} items`}
    onClick={toggleCart}
  />
  {itemCount > 0 && (
    <Badge counter aria-label={`${itemCount} items`}>
      {itemCount}
    </Badge>
  )}
</div>
```

### Variants
```tsx
{/* Tertiary (default) - subtle */}
<IconButton
  icon={<Icon name="Heart" />}
  aria-label="Favorite"
  variant="tertiary"
/>

{/* Primary - prominent */}
<IconButton
  icon={<Icon name="Plus" />}
  aria-label="Add item"
  variant="primary"
/>

{/* Secondary */}
<IconButton
  icon={<Icon name="Filter" />}
  aria-label="Open filters"
  variant="secondary"
/>
```

### Sizes
```tsx
{/* Small */}
<IconButton
  icon={<Icon name="X" width={16} height={16} />}
  aria-label="Close"
  size="small"
/>

{/* Regular */}
<IconButton
  icon={<Icon name="Heart" />}
  aria-label="Favorite"
  size="regular"
/>
```

### With Tooltip
```tsx
<Tooltip text="Add to favorites">
  <IconButton
    icon={<Icon name="Heart" />}
    aria-label="Add to favorites"
    onClick={addToFavorites}
  />
</Tooltip>
```

### Toggle State
```tsx
const [isFavorite, setIsFavorite] = useState(false)

<IconButton
  icon={<Icon name={isFavorite ? "HeartFilled" : "Heart"} />}
  aria-label={isFavorite ? "Remove from favorites" : "Add to favorites"}
  aria-pressed={isFavorite}
  onClick={() => setIsFavorite(!isFavorite)}
  style={{
    color: isFavorite ? 'red' : 'currentColor'
  }}
/>
```

### Disabled State
```tsx
<IconButton
  icon={<Icon name="Plus" />}
  aria-label="Add item (unavailable)"
  disabled
/>
```

### Navigation Icons
```tsx
<nav aria-label="Pagination">
  <IconButton
    icon={<Icon name="ArrowLeft" />}
    aria-label="Previous page"
    onClick={goToPrevPage}
    disabled={isFirstPage}
  />
  
  <IconButton
    icon={<Icon name="ArrowRight" />}
    aria-label="Next page"
    onClick={goToNextPage}
    disabled={isLastPage}
  />
</nav>
```

### Mobile Menu Toggle
```tsx
<IconButton
  icon={<Icon name="Menu" />}
  aria-label="Open navigation menu"
  aria-expanded={isMenuOpen}
  onClick={() => setMenuOpen(!isMenuOpen)}
/>
```

### Search Button
```tsx
<IconButton
  icon={<Icon name="Search" />}
  aria-label="Search products"
  onClick={openSearch}
/>
```

### Share Button
```tsx
<IconButton
  icon={<Icon name="Share" />}
  aria-label="Share product"
  onClick={handleShare}
/>
```

### Delete/Remove
```tsx
<IconButton
  icon={<Icon name="Trash" />}
  aria-label="Remove item from cart"
  onClick={() => removeItem(itemId)}
/>
```

### With Loading State
```tsx
<IconButton
  icon={<Icon name="Heart" />}
  aria-label="Add to favorites"
  loading={isAdding}
  onClick={addToFavorites}
/>
```
