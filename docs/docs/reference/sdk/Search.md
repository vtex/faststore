# Faceted Search
This module defines a standard for creating and modifying faceted search state. This state can be serialized into a `URL` object so UI developers can use the browser's History API to actively store their faceted search state. This way, one can create a rich, router-independent way for applying and removing facets. 

## What is a faceted search?
A faceted search is a page where search results can be filtered and ordered according to attributes called facets. A wireframe example of a faceted search can be seen below:

<img src="https://user-images.githubusercontent.com/1753396/118869450-cb0db380-b8bb-11eb-9c12-338377c6c1c2.png"/>

## How it works?
All faceted search states are based on `search/useSearchState.ts` file. This file contains the SearchState interface. This state must be enough for abstracting all faceted search params state. You can store on this state:
- The base url used on your website: 
  This is important when the search context is a subset of what the browser is currently showing to the user, like in an internationalized context where your pages are scoped by a `/locale` param like in `/en` or `/pt` 
- Sort criteria for the search, a.k.a, ascending/descending price, reviews etc
- Term of a full text search
- All selected facets

`search/useSearchState.ts` also contains functions that change this search state. These functions allow you to:
- Set a selected facet by key
- Replace a selected facet by key.
- Remove a selected facet by value

Finally, parsing/marshalling from/to URL is handled by `search/serializer.ts`. This is where the magic happens and where the URL objects are created

If you are using infinite scrolll, you will also need `useInfiniteSearchState.ts`. This keeps record of which pages are being rendered to the user in the infinite scroll pagination

## Examples
You can find some examples and boundary conditions [in our tests!](https://github.com/vtex/faststore/tree/master/packages/sdk/test/search)
