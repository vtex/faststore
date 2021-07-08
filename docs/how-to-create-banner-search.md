# How to implement the Search Banner Feature

The Search Banner Feature is related to the term searched on a store.

> ℹ️ For more information about the Search Banner Feature, check [configuring banners](https://help.vtex.com/tracks/vtex-intelligent-search--19wrbB7nEQcmwzDPl1l4Cb/4ViKEivLJtJsvpaW0aqIQ5) on VTEX Intelligent Search.

Learn how to implement the Search Banner in the following sections.

## Implementation Steps

### Adding the Banner query

To add the banner query you will need to shadow the `@vtex/gatsby-theme-store/templates/search.browser.tsx` file:

1. Inside the source folder of your store project, create a file with this path `src/@vtex/gatsby-theme-store/templates/search.browser.tsx`
2. Then, add the following query snippet on your search page query:

```tsx
// src/@vtex/gatsby-theme-store/templates/search.browser.tsx
export const query = gql`
...
 banners(fullText: $fullText, selectedFacets: $selectedFacets) {
    banners {
      id
      name
      area
      html
    }
  }
...
`
```

> ℹ️ This query belongs to vtex.search-graphql app. Take a look at the [SearchPage](https://github.com/vtex-sites/storecomponents.store/blob/33904e9ed808c5496265da37206cfdaa9b0255d2/src/%40vtex/gatsby-theme-store/templates/search.browser.tsx#L142-L151) component.

### Adding the Banner on UI

You can access the banner data, on the AboveTheFold component. 

```tsx
// src/@vtex/gatsby-theme-store/views/search/AboveTheFold.tsx

const banners = data.vtex?.banners?.banners // List with all banners
```

So you can render all these banners HTML with this snippet. 

```tsx
// src/@vtex/gatsby-theme-store/views/search/AboveTheFold.tsx

banners.map(({ id, html }) =>
	<div key={id} dangerouslySetInnerHTML={{ __html: html }} />
)
```

> ℹ️ Take a look at the [AboveTheFold](https://github.com/vtex-sites/storecomponents.store/blob/7f8692706bc3b5a58df17d720228c55ce58de092/src/%40vtex/gatsby-theme-store/views/search/AboveTheFold.tsx#L33) and [SearchBanner](https://github.com/vtex-sites/storecomponents.store/blob/7f8692706bc3b5a58df17d720228c55ce58de092/src/components/search/Banner.tsx#L22-L25) components.

### References

- [Banner for search terms](https://github.com/vtex-sites/storecomponents.store/pull/1006).

This [PR](https://github.com/vtex-sites/storecomponents.store/pull/1006) implements this feature on the Storecomponents store.
