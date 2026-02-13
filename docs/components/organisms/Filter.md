# Filter

## Intention
Product filtering interface with multiple facets.

## Description
Filter provides comprehensive filtering UI for product searches. Includes facets for categories, price range, ratings, attributes. Mobile-responsive with slider variant.

## Import
```tsx
import { Filter } from '@faststore/components'
```

## Sub-components
- `FilterFacets` - Facet list
- `FilterFacetBoolean` - Checkbox facets
- `FilterFacetBooleanItem` - Individual checkbox filter
- `FilterFacetRange` - Price/range facets
- `FilterSlider` - Mobile filter slider

## Examples

```tsx
<Filter>
  <FilterFacets>
    <FilterFacetBoolean title="Category">
      <FilterFacetBooleanItem
        label="Electronics"
        checked={filters.category.includes('electronics')}
        onChange={() => toggleFilter('category', 'electronics')}
      />
    </FilterFacetBoolean>
    
    <FilterFacetRange title="Price">
      <PriceRange
        min={priceRange.min}
        max={priceRange.max}
        onChange={setPriceRange}
      />
    </FilterFacetRange>
  </FilterFacets>
</Filter>
```
