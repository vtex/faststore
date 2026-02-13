# ProductShelf

## Intention
Horizontal scrolling carousel of products.

## Description
ProductShelf displays products in horizontal scrolling carousel. Used for recommendations, related products, featured items.

## Import
```tsx
import { ProductShelf} from '@faststore/components'
```

## Sub-components
- `ProductShelfItems` - Items container
- `ProductShelfItem` - Individual product wrapper

## Examples

```tsx
<ProductShelf title="Recommended for You">
  <ProductShelfItems>
    {products.map(product => (
      <ProductShelfItem key={product.id}>
        <ProductCard {...product} />
      </ProductShelfItem>
    ))}
  </ProductShelfItems>
</ProductShelf>
```
