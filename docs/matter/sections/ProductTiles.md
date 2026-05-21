# ProductTiles Section (Matter)

## Intention
CMS-configurable product tiles grid.

## Description
ProductTiles section displays curated products in tile/grid format with CMS configuration.

## Import
```tsx
import ProductTiles from 'src/components/sections/ProductTiles'
```

## CMS Configuration

```tsx
{
  title: { type: 'string' },
  tiles: {
    type: 'array',
    items: {
      product: { type: 'product' },
      image: { type: 'image' }
    }
  }
}
```

## Examples

```tsx
<ProductTiles
  title="Featured Products"
  tiles={curatedProducts}
/>
```
