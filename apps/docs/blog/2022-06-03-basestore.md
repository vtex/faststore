---
title: Base Store - May 2022
description: Base Store Release Notes
tags: [basestore]
hide_table_of_contents: false
---

New cart-related events are now being tracked, and enhancements in the LCP score have been implemented. Also, more components have been updated to use the Base Store theming structure.

<!--truncate-->

## <span role="img" aria-label="bug fix">🐛</span> Bug fix

- **Fixed search suggestions locale issue** ([Gatsby #69](https://github.com/vtex-sites/gatsby.store/pull/69) | [Next.js #71](https://github.com/vtex-sites/nextjs.store/pull/71))
  All requests to the FastStore Search API now receive locale info so the search can return product suggestions according to the user locale.

- **Fixed custom attributes for `img` and `link` tags** ([Gatsby #60](https://github.com/vtex-sites/gatsby.store/pull/60) | [Next.js #60](https://github.com/vtex-sites/nextjs.store/pull/60))
  Custom attributes are now only passed to `img` and `link` HTML tags to avoid inconsistencies in other components.

## <span role="img" aria-label="Enhancement">✨</span> Enhancement

- **Improved page loading time with Incremental Static Build** ([Gatsby #47](https://github.com/vtex-sites/gatsby.store/pull/47) | [Next.js #39](https://github.com/vtex-sites/nextjs.store/pull/39))
  Base Store now uses the new Incremental Static Build (ISB) WebOps solution.

- **Replaced `OutOfStock` component** ([Gatsby #70](https://github.com/vtex-sites/gatsby.store/pull/70) | [Next.js #72](https://github.com/vtex-sites/nextjs.store/pull/72))
  Base Store now uses the `OutofStock` component from the FastStore UI library.

- **Improved page LCP** ([Gatsby #51](https://github.com/vtex-sites/gatsby.store/pull/51) | [Next.js #49](https://github.com/vtex-sites/nextjs.store/pull/49))
  Improved Largest Contentful Paint (LCP) score after implementing the `fetchpriority` attribute.

- **Added analytics events to `CartItem`** ([Gatsby #43](https://github.com/vtex-sites/gatsby.store/pull/43) | [Next.js #35](https://github.com/vtex-sites/nextjs.store/pull/35))
  The `CartItem` component now tracks user actions via the `add_to_cart` and `remove_from_cart` Google Analytics events.

- **Updated `Select` theming** ([Gatsby #17](https://github.com/vtex-sites/gatsby.store/pull/17) | [Next.js #16](https://github.com/vtex-sites/nextjs.store/pull/16))
  The `Select` component now has new tokens based on the Base Store [Theming Structure](https://github.com/vtex-sites/base.store/pull/407).

- **Updated `Incentives` theming** ([Gatsby #49](https://github.com/vtex-sites/gatsby.store/pull/49) | [Next.js #56](https://github.com/vtex-sites/nextjs.store/pull/56))
  The `Incentives` component now has new tokens based on the Base Store [Theming Structure](https://github.com/vtex-sites/base.store/pull/407).

- **Improved Theming documentation on Storybook** ([Gatsby #26](https://github.com/vtex-sites/gatsby.store/pull/26) | [Next.js #67](https://github.com/vtex-sites/nextjs.store/pull/67))
  New docs published on the Base Store Storybook. Also, a new documentation format based on [MDX](https://storybook.js.org/docs/react/writing-docs/mdx) was implemented.

## <span role="img" aria-label="chores">🧹</span> Chore

- **`CartItem` tests for analytics events** ([Gatsby #66](https://github.com/vtex-sites/gatsby.store/pull/66) | [Next.js #66](https://github.com/vtex-sites/nextjs.store/pull/66))
  The `CartItem` component now has tests to check if events are fired to Google Analytics when users change the quantity of a product on the minicart.

- **Updated`QuantitySelector` styling** ([Gatsby #75](https://github.com/vtex-sites/gatsby.store/pull/75) | [Next.js #76](https://github.com/vtex-sites/nextjs.store/pull/76))
  The `QuantitySelector` component now uses CSS modules.

## Framework-specific updates

### Gatsby

#### <span role="img" aria-label="chores">🎉</span> New feature

- **New local tokens added to `Checkbox`** [#61](https://github.com/vtex-sites/gatsby.store/pull/61)
  The `Checkbox` component now has new tokens based on the Base Store [Theming Structure](https://github.com/vtex-sites/base.store/pull/407).

- **Support for product attachments available** [#53](https://github.com/vtex-sites/gatsby.store/pull/53)
  The Base Store now supports product attachments.

#### <span role="img" aria-label="bug fix">🐛</span> Bug fix

- **`ArrowsClockwise` icon closing tag [#57](https://github.com/vtex-sites/gatsby.store/pull/57)**
  The closing tag of the `ArrowsClockwise` icon was fixed and no longer breaks icons on Firefox.

#### <span role="img" aria-label="chores">🧹</span> Chore

- **Updated product components styling [#54](https://github.com/vtex-sites/gatsby.store/pull/54)**
  The `ProductCard`, `ProductGrid`, and `ProductGallery` components now use CSS modules.

- **Upgraded Gatsby and other dependencies [#59](https://github.com/vtex-sites/gatsby.store/pull/59)**
  After Gatsby's [improvements in Image and Font Loading Times announcement](https://www.gatsbyjs.com/docs/reference/release-notes/v4.14/#improvements-in-image-and-font-loading-times), Gatsby and other dependencies have been upgraded.

- **Updated ImageGallery styling [#41](https://github.com/vtex-sites/gatsby.store/pull/41)**
  The `ImageGallery` component now uses CSS modules.

### Next.js

#### <span role="img" aria-label="chores">🎉</span> New feature

- **New `Toggle` component [#15](https://github.com/vtex-sites/nextjs.store/pull/15)**
  The `Toggle` component works as a checkbox, but in the form of a switch control.

- **Updated `Link` theming [#17](https://github.com/vtex-sites/nextjs.store/pull/17)**
  The `Link` component now has new tokens based on the Base Store [Theming Structure](https://github.com/vtex-sites/base.store/pull/407).

#### <span role="img" aria-label="bug fix">🐛</span> Bug fix

- **Fixed the `fetchPriority` prop warning [#54](https://github.com/vtex-sites/nextjs.store/pull/54)**
  Fixed warning related to the `fetchPriority` being written in camel case.

- **Fixed Storybook error while importing CSS styles [#53](https://github.com/vtex-sites/nextjs.store/pull/53)**

- **Fixed `EmptyState` visual bug [#11](https://github.com/vtex-sites/nextjs.store/pull/11)**
  The vertical gap for the empty cart state is now fixed.

| Before                                                                                                                                     | After                                                                                                                                      |
| ------------------------------------------------------------------------------------------------------------------------------------------ | ------------------------------------------------------------------------------------------------------------------------------------------ |
| ![Screen Shot 2022-05-02 at 15 08 03](https://user-images.githubusercontent.com/381395/166301327-5d18aaa1-cd0c-47c8-b7b6-c94c3a0c8170.png) | ![Screen Shot 2022-05-02 at 15 07 31](https://user-images.githubusercontent.com/381395/166301331-223b849d-35ac-4482-9a64-d9f74d1055e4.png) |

#### <span role="img" aria-label="chores">🧹</span> Chore

- **camelCase standard for CSS Modules classes [#42](https://github.com/vtex-sites/nextjs.store/pull/42)**
  Since the `gatsby.store` only imports classes as camel case, the `nextjs.store` now has a configuration to import classes as camel case too.

- **Improved home performance [#45](https://github.com/vtex-sites/nextjs.store/pull/45)**

- **Updated global tokens nomenclature [#51](https://github.com/vtex-sites/nextjs.store/pull/51)**
