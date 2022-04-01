---
description: Base Store Release Notes 
tags: [base store]
hide_table_of_contents: false
---

# Base Store - March, 2022

The Base Store now has new components: `EmptyState`, `Suggestions` and `SearchHistory`. 

<!--truncate-->
## 🎉 New feature

- **New `EmptyState` component** - [#367](https://github.com/vtex-sites/base.store/pull/367)
Use the `EmptyState`  in the `CartSidebar` and `ProductGallery` components to display a custom page for empty carts and product results.

    ![no results-page](https://user-images.githubusercontent.com/67270558/160859291-211054fd-734a-4d21-b279-09c8c8fd5d40.gif)

-  **Self-contained `sections`** - [#371](https://github.com/vtex-sites/base.store/pull/371)
The logic developed in the `pages` folder has been moved to the `sections` component. As a result, CMS users can rearrange and reorder each storefront section.

- **New Search `Suggestions` component** - [#372](https://github.com/vtex-sites/base.store/pull/372)
Use the`Suggestions` component to encapsulate autocomplete suggestions and suggested products.

    ![suggestions-component](https://user-images.githubusercontent.com/15722605/157681906-66b9955a-7232-4885-b71c-565eb6d55fe4.png)


- **New `SearchHistory` component** - [#391](https://github.com/vtex-sites/base.store/pull/391) 
Use the `SearchHistory` component to show the user's search history in the store page.


    ![search-history-gif](https://user-images.githubusercontent.com/67270558/160863310-c6167a36-ec6d-4470-88bc-be9dc0f2e9fb.gif)
    
-  **New session query** - [#392](https://github.com/vtex-sites/base.store/pull/392)
Use the `StoreSession` query to get new sales channels when a user changes their postal code.

- **New `interactive` variant added to the `Badge` component** - [#396](https://github.com/vtex-sites/base.store/pull/396)
Use the `interactive` variant in a `Badge` component to allow users to close the badge.

    ![](https://user-images.githubusercontent.com/15722605/158883971-a04f56a2-b387-49e3-9fe0-636a0122bf6a.png)
    
- **Added `hideUnavailableItems` to `store.config`** - [#400](https://github.com/vtex-sites/base.store/pull/400) 
The Search API now has the `hideUnavailableItems` parameter. This parameter either hides (true) or displays (false) an out-of-stock product. 

- **New `styles/global` folder** - [#407](https://github.com/vtex-sites/base.store/pull/407) 
This PR sets the stage for the upcoming Theming structure by gathering all CSS variables (tokens) into the `styles/global` folder. It applies a coherent naming scheme and simplifies global styles.
    
## 🐛 Bug fix

- **Fixed the `HeroImage` size and css** - [#363](https://github.com/vtex-sites/base.store/pull/363)
The `HeroImage` HTML size property has been fixed. The browser will now create a better image to fetch based on the device's screen (mobile or desktop).

- **Fixed facets** - [#380](https://github.com/vtex-sites/base.store/pull/380)
The `filter` on the mobile version is now stable, and users can choose which facets to apply. 

- **Fixed the`Tiles` component semantic markup** - [#383](https://github.com/vtex-sites/base.store/pull/383)
The semantic markup for `Tiles` is now fixed to `ul` and `li` instead of a generic `div`.


- **Fixed the `CartItem` title and image** - [#405](https://github.com/vtex-sites/base.store/pull/405)
The image size no longer breaks when a product title is longer than two lines. Now, the image size remains the same, and the product title is shortened.

- **Fixed the Button cursor** - [#419](https://github.com/vtex-sites/base.store/pull/419)
Now the browser chooses which cursor to use depending on the component. For example, for links, use `pointer`, and for buttons, use `default`.

## ✨ Enhancement

- **Improved performance with `content-visibility` in `Section`** - [#368](https://github.com/vtex-sites/base.store/pull/368) 
The `content-visibility` CSS property was added to the `Section` component. The property lazy loads part of the page's content and saves loading time.

- **Avoided performance decrease with the removal of inline icons** - [#378](https://github.com/vtex-sites/base.store/pull/378)
In order to remove unnecessary JavaScript and improve page performance, inline icons were removed from the final bundle and moved to SVG files.

## 🧹 Chore

- **Fixes in PLP loading** - [#362](https://github.com/vtex-sites/base.store/pull/362) 
Following the implementation of the [Skeleton Loading components](https://github.com/vtex-sites/base.store/pull/317), some loading logic on the PLP has been changed:
    - The useTotalCount hook was removed.
    - The `Sort` and `Filter` Skeleton buttons are now loaded at the same time.
    - The most recent `Filter` items are now kept expanded in the mobile version
    
- **`Badge` variants renamed** - [#381](https://github.com/vtex-sites/base.store/pull/381)
The `Badge` variants have been renamed so that the semantic meaning of `Badge` is not jeopardized. Changes made include:

    - Before:
    `BadgeVariants = 'outOfStock' | 'new' | 'recommended' | 'neutral'`

    - Now:
    `BadgeVariants = 'neutral' | 'info' | 'highlighted'`
    
- **Moved UI components and IconSVG to the `ui` folder** - [#386](https://github.com/vtex-sites/base.store/pull/386) 
The `ui` folder centralizes UI components and IconSVG, making it easier to add UI components and icons to the storefront.

- **Replaced inline `<style/>` tags by tags** - [#408](https://github.com/vtex-sites/base.store/pull/408)
Inline styles are now contained in their own stylesheet, eliminating CSS code splitting and lowering the Total Blocking Time (TBT) metric.
    
- **Removed frontend computation to the backend** - [#411](https://github.com/vtex-sites/base.store/pull/411)
Offers are now sorted according to the order of the offers array.

- **Improved the login performance** - [#418](https://github.com/vtex-sites/base.store/pull/418)
Now the API returns `null` for the person query when executed by an anonymous user, avoiding a mismatch with the default user session values, preventing the session of the anonymous user from being reset, and lowering the Total Blocking Time (TBT) metric.


