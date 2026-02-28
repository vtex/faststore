# CrossSellingShelf Section (Matter)

## Intention
Product recommendations based on cart contents.

## Description
Displays related/complementary products based on items in cart. Uses GraphQL recommendations query.

## Import
```tsx
import CrossSellingShelf from 'src/components/sections/CrossSellingShelf'
```

## Data Integration

- `RecommendationsQuery` based on cart
- Analytics for cross-sell views

## Examples

```tsx
<CrossSellingShelf cartItems={cart.items} />
```
