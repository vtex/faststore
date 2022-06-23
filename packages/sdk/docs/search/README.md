# Search State Managment

This module defines a standard for creating and modifying faceted search state. This state can be serialized into a `URL` object so UI developers can use the browser's History API to actively store their faceted search state. This way, one can create a rich, router-independent way for applying and removing facets.

## What is a faceted search?

A faceted search is a page where search results can be filtered and ordered according to attributes called facets. A wireframe example of a faceted search can be seen below:

<img width="1091" alt="Screen Shot 2021-05-19 at 3 59 32 PM" src="https://user-images.githubusercontent.com/1753396/118869450-cb0db380-b8bb-11eb-9c12-338377c6c1c2.png">

## How it works?

All search states are based on the `state.ts` file. This file contains the SearchParamsState interface. This state must be enough for abstracting all faceted search params state. You can store on this state:

- The base url used on your website:
  This is important when the search context is a subset of what the browser is currently showing to the user, like in an internationalized context where your pages are scoped by a `/locale` param like in `/en` or `/pt`
- Sort criteria for the search, a.k.a, ascending/descending price, reviews etc
- Term of a full text search
- All selected facets

All functions that change this search state are based on `reducer.ts`. These functions allow you to:

- Set a selected facet by key
- Replace a selected facet ny key.
- Remove a selected facet by value

Finally, parsing/marshalling from/to URL is handled by `reducer.ts`. This is where the magic happens and where the URL objects are created

## Examples

You can find some examples and boundary conditions in our tests!
