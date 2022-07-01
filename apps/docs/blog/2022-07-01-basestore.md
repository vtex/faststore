---
title: Base Store - June 2022
description: Base Store - Release Note, June 2022
tags: [basestore]
---

PLPs now support price range filtering, and nonexistent PDPs can now handle 404 errors. Also, more components have been updated to conform to the new Base Store Theming architecture.

<!--truncate-->

## 🎉 New

- **New `Dropdown` component**  ([Gatsby #111](https://github.com/vtex-sites/gatsby.store/pull/111) | [Next.js #118](https://github.com/vtex-sites/nextjs.store/pull/118))

  The `Dropdown` component has been extracted from `Breadcrumb` and received new local tokens as part of adhering to the new Base Store [Theming architecture](https://nextjs-store-storybook.vercel.app/?path=/docs/theming--page).

  ![Dropdown component](https://user-images.githubusercontent.com/60782333/176910981-a850a275-d352-41ce-9e20-135201938531.png)

- **Price range filtering now available for PLPs**  ([Gatsby #112](https://github.com/vtex-sites/gatsby.store/pull/112) | [Next.js #121](https://github.com/vtex-sites/nextjs.store/pull/121))

  Thanks to the new `PriceRange` component, Product Listing Pages (PLPs) can now support price range filtering.

- **301 redirects added to PDPs**  ([Gatsby #87](https://github.com/vtex-sites/gatsby.store/pull/87) | [Next.js #93](https://github.com/vtex-sites/nextjs.store/pull/93))
 
  So that VTEX stores migrating to FastStore can work seamlessly, a 301 redirect between `vtexSlug` and `fastStoreSlug` was created, where:
  - `vtexSlug`: `/{slug}/p`
  - `fastStoreSlug`: `/{slug}-{skuId}/p`

### Theming 

As part of adhering to the new Base Store [Theming architecture](https://nextjs-store-storybook.vercel.app/?path=/docs/theming--page), the following components now have new local tokens related to global ones:

- **New local tokens to `Tiles`** ([Gatsby #120](https://github.com/vtex-sites/gatsby.store/pull/120) | [Next.js #134](https://github.com/vtex-sites/nextjs.store/pull/134))
- **New local tokens to `ProductGrid`**  ([Gatsby #127](https://github.com/vtex-sites/gatsby.store/pull/127) | [Next.js #144](https://github.com/vtex-sites/nextjs.store/pull/144))
- **New local tokens to `Accordion`**  ([Gatsby #126](https://github.com/vtex-sites/gatsby.store/pull/126) | [Next.js #130](https://github.com/vtex-sites/nextjs.store/pull/130))
- **New local tokens to `ImageGallery`**  ([Gatsby #125](https://github.com/vtex-sites/gatsby.store/pull/125) | [Next.js #143](https://github.com/vtex-sites/nextjs.store/pull/143))
- **New local tokens to `RegionalizationBar`**  ([Gatsby #124](https://github.com/vtex-sites/gatsby.store/pull/124) | [Next.js #104](https://github.com/vtex-sites/nextjs.store/pull/104))
- **New local tokens to `Modal` and  `RegionalizationModal`** ([Gatsby #123](https://github.com/vtex-sites/gatsby.store/pull/123) | [Next.js #128](https://github.com/vtex-sites/nextjs.store/pull/128))
- **New local tokens to `Dropdown`**  ([Gatsby #111](https://github.com/vtex-sites/gatsby.store/pull/111) | [Next.js #118](https://github.com/vtex-sites/nextjs.store/pull/118))
- **New local tokens to `EmptyState`**  ([Gatsby #113](https://github.com/vtex-sites/gatsby.store/pull/113) | [Next.js #122](https://github.com/vtex-sites/nextjs.store/pull/122))

## <span role="img" aria-label="bug fix">🐛</span> Bug fix

- **`ImageGallerySelector` scroll fixed** ([Gatsby ##121](https://github.com/vtex-sites/gatsby.store/pull/121) | [Next.js ##132](https://github.com/vtex-sites/nextjs.store/pull/#132))
  
  Undesired behaviors of the `ImageGallerySelector` scroll on Safari were fixed.
  
  | Before | Now |
  |-------|--------|
  | ![Scroll with error](https://user-images.githubusercontent.com/60782333/176907149-857d8224-5f99-45a7-adb3-62ae13ac836a.gif)  | ![Fixed scroll](https://user-images.githubusercontent.com/60782333/176907157-7480bed9-e36f-4483-b214-fee985f14fe6.gif) |

## <span role="img" aria-label="Enhancement">✨</span> Enhancement

- **Page code error handling enhanced** ([Gatsby #108](https://github.com/vtex-sites/gatsby.store/pull/108) | [Next.js #116](https://github.com/vtex-sites/nextjs.store/pull/116))
  
  Instead of always responding with a 500 status code, nonexistent Product Details Pages (PDPs) can now handle 404 errors.

- **External and client-side navigation now supported by the `Link` component** ( [Gatsby #103](https://github.com/vtex-sites/gatsby.store/pull/103) | [Next.js #117](https://github.com/vtex-sites/nextjs.store/pull/117))

  The `Link` component now handles both external and client-side navigation. This change intends to unify the `Link` component usage.

- **SVG logo replaced by a static asset** ([Gatsby #116](https://github.com/vtex-sites/gatsby.store/pull/116) | [Next.js #135](https://github.com/vtex-sites/nextjs.store/pull/135))

  The SVG logo was removed from the JavaScript code and imported as a static asset. This change aims to reduce the amount of JavaScript downloaded on the client-side since directly declaring SVGs in JS code can harm the Total Blocking Time (TBT) and final bundle sizes.

## <span role="img" aria-label="Documentation updates">📄</span> Documentation

- **New `Regionalization` section on the Storybook** ([Gatsby #124](https://github.com/vtex-sites/gatsby.store/pull/124) | [Next.js #110](https://github.com/vtex-sites/nextjs.store/pull/110))
  
  The Base Store Storybook now has the [Regionalization](https://nextjs-store-storybook.vercel.app/?path=/docs/features-regionalization-overview--default-button) section that lists all regionalization-related components and how to use them.

- **General improvements on Storybook implemented** ([Gatsby #115](https://github.com/vtex-sites/gatsby.store/pull/115) | [Next.js #129](https://github.com/vtex-sites/nextjs.store/pull/129))

  The `Sandbox` tab is now available for all component pages, allowing to test the component in different viewports and use other add-ons. Also, some console errors on the Storybook were fixed.

## <span role="img" aria-label="chores">🧹</span> Chore

- **Upgraded dependencies** ([Gatsby #114](https://github.com/vtex-sites/gatsby.store/pull/114) | [Next.js #131](https://github.com/vtex-sites/nextjs.store/pull/131))
- **Storybook's version bump from 6.4.20 to 6.5.9** ([Gatsby #109](https://github.com/vtex-sites/gatsby.store/pull/109) | [ Next.js #120](https://github.com/vtex-sites/nextjs.store/pull/120))

## Next.js-specific updates

- 🎉 **New local tokens to `Filter`** ([#139](https://github.com/vtex-sites/nextjs.store/pull/139))

  As part of adhering to the new Base Store [Theming architecture](https://nextjs-store-storybook.vercel.app/?path=/docs/theming--page), the `Filter` component now has new local tokens related to global ones.

- ✨ **Search history and top searches on search input** ([#112](https://github.com/vtex-sites/nextjs.store/pull/112)).

  The last four previously searched terms (`SearchHistory`) and the top five searches (`SuggestionsTopSearch`) are now presented on search input.

  ![Search input](https://user-images.githubusercontent.com/381395/173456338-f7e9c2cc-6bcc-441c-8d5f-c526b17e292b.gif)

- ✨ **CSS selector for `DropdownButton` updated** ([#123](https://github.com/vtex-sites/nextjs.store/pull/123))
  
  To select the `DropdownButton` component, the `[data-fs-dropdown-button]` CSS handle is being used instead of `[data-store-dropdown-button]`.

- ✨ **`EmptyState` styles updated** ([#125](https://github.com/vtex-sites/nextjs.store/pull/125))
  
  The `--fs-text-size-3` token was replaced by `--fs-text-size-lead` on the `EmptyCart` component.

- ✨ **`Facets` styles updated** ([#150](https://github.com/vtex-sites/nextjs.store/pull/150))

  The tokens related to the `Facets` components were renamed and updated accordingly.

- 📄 **`EmptyState` Storybook enhanced with use cases** ([#126](https://github.com/vtex-sites/nextjs.store/pull/126))
- 🧹 **Support for new type definitions from React 18** ([#113](https://github.com/vtex-sites/nextjs.store/pull/113))
