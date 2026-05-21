# CartToggle (Matter)

## Intention
Cart icon button with item count badge.

## Description
Matter CartToggle extends IconButton with cart store integration. Displays shopping cart icon with item count badge and handles cart sidebar toggling.

## Architecture

```
CartToggle (Matter)
├── useCartToggleButton hook (cart SDK)
├── cartStore (item count)
└── UIIconButton (foundational)
    ├── UIIcon (cart icon)
    └── UIBadge (counter)
```

## Import
```tsx
import CartToggle from 'src/components/cart/CartToggle'
```

## Props

| Name | Type | Default | Required | Description |
|------|------|---------|----------|-------------|
| `alt` | `string` | - | Yes | Aria-label for accessibility |
| `icon` | `string` | - | Yes | Icon name (e.g., "ShoppingCart") |

## Data Integration

### SDK Hooks
- **`useCartToggleButton`**: Provides button props including:
  - `onClick`: Opens cart sidebar
  - `data-items`: Current cart item count
  - `aria-label`: Accessible label with count

### Cart Store
Automatically subscribes to cart updates for real-time item count.

## Hooks Used

- `useCartToggleButton()` - Cart toggle functionality and item count

## Extends

[IconButton (Foundational)](../../components/molecules/IconButton.md) from `@faststore/ui`

## Best Practices

### Do's
✅ Place in navbar/header for consistent access  
✅ Update count badge in real-time  
✅ Provide clear aria-label with item count  
✅ Animate badge on cart additions

### Don'ts
❌ Don't hide cart toggle on mobile  
❌ Don't forget to show 0 items state  
❌ Don't make hit area too small

## Examples

### Basic Usage
```tsx
<CartToggle
  alt="Shopping cart with {count} items"
  icon="ShoppingCart"
/>
```

### In Navbar
```tsx
<Navbar>
  <NavbarHeader>
    <Logo />
    <div>
      <SearchButton />
      <AccountButton />
      <CartToggle
        alt="Shopping cart"
        icon="ShoppingCart"
      />
    </div>
  </NavbarHeader>
</Navbar>
```

### Custom Styling
```tsx
<CartToggle
  alt="Shopping cart"
  icon="ShoppingBag"
  style={{ color: 'var(--primary-color)' }}
/>
```

## Related Matter Components

- [CartSidebar](./CartSidebar.md) - Opens when toggle is clicked
- [CartItem](./CartItem.md) - Displayed in cart sidebar
