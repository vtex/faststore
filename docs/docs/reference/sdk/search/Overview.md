---
sidebar_label: Overview
sidebar_position: 1
keywords: [faceted search, faceted navigation, search, product listing page, plp]
---

# Search 

*If shoppers can't find your products, they won't buy them. Increase product discoverability by implementing a **faceted search** in your store with the `Search` SDK module.*

---


## What is faceted search?

Faceted search helps shoppers quickly find what they need via facet filters that narrow down product options. Facet planning can make your leads think about the questions a salesperson would ask to help someone find the exact product they are looking for.

For example, when browsing your store for a laptop, shoppers could be presented with facets such as "Brand," "Operational System," "RAM capacity." You could imagine these facets as questions a salesman could make: "Which processor type do you need?", "Are you looking for a specific screen size?", "How much do you want to spend?", "Do you have a brand preference?".

![Faceted Search](/img/references/faceted-search.png)

## How the `Search` module works?

The `Search` SDK module provides a standard for creating and modifying **faceted search** states. Faceted navigation generates a unique and serialized URL for every facet combination, which we'll call facet states. 
Developers can store facet states in the browser's [History API](https://developer.mozilla.org/en-US/docs/Web/API/History_API) to navigate through the user's history and manipulate a website's URL without a full page refresh. This way, one can create a rich, router-independent way for applying and removing facets.

Two main parts shape the behavior of the `Search` SDK module:
- [`SearchProvider`](https://github.com/vtex/faststore/blob/master/packages/sdk/src/search/Provider.tsx) component and [`useSearch`](https://github.com/vtex/faststore/blob/master/packages/sdk/src/search/useSearch.ts) hook
- [`serializer`](https://github.com/vtex/faststore/blob/master/packages/sdk/src/search/serializer.ts)
  
### SearchProvider

The `SearchProvider` defines the interfaces that describe a faceted search state and the functions that change these states.

The main `State` interface allows you to handle the following variables:

|Argument|Type        |Description|
|--------|------------|---------------------------------------------------|
|`base`  |`string`    | Base URL path to be ignored by the search context. Use `/en` to ignore the locale specific part of the url on the search context. |
|`page`  |`number`    | Index of the current page in the pagination context. Use `0` if it's the first page in the pagination result. `1` if it's the second and so on. |
|`selectedFacets`|`Facet[]`|All selected facets.|
|`sort`  | `SearchSort`|Selected sorting criteria for the search (e.g, ascending/descending price, number of reviews)|
|`term`  |`string`    | Terms of the full text search.|

To change the facet state, the following functions are also available:
- `setFacet` - Select a facet by its key.
- `toggleFacet` - Replace a selected facet by key.
- `removeFacet` - Remove the selected facet by its value.

### serializer

The `serializer` file handles URL parsing to create a serialized URL for every facet combination.

## Example
Suppose we want to create a full-text search page that renders a checkbox, which toggles a facet for the `faststore` brand. To build this feature, we will use the browser's URL to keep the state of the faceted search. Then, whenever someone selects the `faststore` facet, we will redirect them to the corresponding URL, updating the UI and re-rendering the necessary components to display all product items from the `faststore` brand.
```tsx
import { SearchProvider, parseSearchState } from '@faststore/sdk'

function Page () {
  const params = useMemo(() => parseSearchState(new URL(window.href)), [])

  return (
    <SearchProvider
      onChange={(url: URL) => window.location.href = url.href}
      itemsPerPage={12}
      {...params}
    >
      <Checkbox />
    </SearchProvider>
  )
}

function Checkbox () {
  const { toggleFacet } = useSession()

  return (
    <input 
      type="checkbox" 
      onChange={() => toggleFacet({key: 'brand', value: 'faststore'})} 
    />
  )
}
```

This example has two components: `Page` and `Checkbox`. 

The `Page` component parses the search state from the browser's URL using `parseSearchState` and provides the parsed output to the `SearchProvider` component. The `SearchProvider` wraps the entire page, providing the necessary context for the Faceted Search.

In this example, the inline `onChange` function defined for the `SearchProvider` component is called whenever someone selects the `Checkbox` to apply a new facet. This function uses the parsed output from `parseSearchState` to redirect users to the new URL corresponding to the recently applied facets. Also, the `itemsPerPage` prop is configured to make the `SearchProvider` display 12 products per page.

For practical examples, please refer to our official starters. Also, you can find more examples and boundary conditions [in our tests.](https://github.com/vtex/faststore/tree/master/packages/sdk/test/search)
