---
title: Base Store - April, 2022
description: Base Store Release Notes
tags: [basestore]
hide_table_of_contents: false
---

The Base Store now has a new search API, components with a new theming structure, and a Storybook package to run locally. Also, check out the news for the starter framework-specific updates.

<!--truncate-->

:::caution
These Release Notes have news from the `base.store`, [gatsby.store](https://github.com/vtex-sites/gatsby.store) (former `base.store`) and [nextjs.store](https://github.com/vtex-sites/nextjs.store) starters.

_What happened to the base.store PRs?_

Since the announcement that the `base.store` repository has changed its name to `gatsby.store` due to the new starter, `nextjs.store`, the `base.store` PRs were recreated to the `gatsby.store` repository. See the [official announcement](https://www.faststore.dev/releases/2022/04/30/basestore) for more details.
:::

## 🎉 New feature

- **New search event API** - ([Gatsby #2](https://github.com/vtex-sites/gatsby.store/pull/2) / [Next.js #2](https://github.com/vtex-sites/nextjs.store/pull/2))
  The `search.query` event has been added to the VTEX Intelligent Search Analytics API. This event is used to generate indices like `Top Searches` and `Suggestions`.

- **New theming structure to the `BannerText`** - ([Base Store - #470](https://github.com/vtex-sites/base.store/pull/470))
  Local tokens (CSS variables) were added to the `BannerText` component in the new theming structure ([#407](https://github.com/vtex-sites/base.store/pull/407)) to configure the component's properties and connect the local tokens to the global tokens.

- **New theming structure to the `Product Shelf` component** - ([Base Store - #464](https://github.com/vtex-sites/base.store/pull/464))
  Local tokens (CSS variables) were added to the `Product Shelf` component in the new theming structure ([#407](https://github.com/vtex-sites/base.store/pull/407)) to configure the component's properties and connect the local tokens to the global tokens.

- **New theming structure to `Badge` component** - ([Base Store - #462](https://github.com/vtex-sites/base.store/pull/462))
  Local tokens (CSS variables) were added to the `Badge` component in the new theming structure ([#407](https://github.com/vtex-sites/base.store/pull/407)) to configure the component's properties and connect the local tokens to the global tokens.

- **New theming structure to the `Quantity Selector` component** - ([Base Store - #448](https://github.com/vtex-sites/base.store/pull/448))
  Local tokens (CSS variables) were added to the `Quantity Selector` component in the new theming structure ([#407](https://github.com/vtex-sites/base.store/pull/407)) to configure the component's properties and connect the local tokens to the global tokens.

- **`Button` new theming** - [#442](https://github.com/vtex-sites/base.store/pull/442)
  Local tokens (CSS variables) were added to the `Button` component in the new theming structure ([#407](https://github.com/vtex-sites/base.store/pull/407)) to configure the component's properties and connect the local tokens to the global tokens. Also, this change:

      - Gathers the buttons variants into a single folder;
      - Switches the order of the buttons variants prefixes/suffixes;
      - Fixes the variant Alert colors.

- **New theming structure to `Hero` component** - ([Base Store - #435](https://github.com/vtex-sites/base.store/pull/435))
  Local tokens (CSS variables) were added to the `Hero` component in the new theming structure ([#407](https://github.com/vtex-sites/base.store/pull/407)) to configure the component's properties and connect the local tokens to the global tokens.

- **New VTEX Search tracking** - ([Base Store - #389](https://github.com/vtex-sites/base.store/pull/389))

- **New Storybook package to the `base.store`** - ([Base Store - #463](https://github.com/vtex-sites/base.store/pull/463))
  Use the Storybook as a testing enviroment for components.
  To enable it, run `yarn storybook` in the terminal and, after the build, open `localhost:6006`.

- **`RegionalizationModal` component** - [#426](https://github.com/vtex-sites/base.store/pull/426)
  The`RegionalizationModal` allows users to set their current location and check available products for their region.

![image](https://vtexhelp.vtexassets.com/assets/docs/src/regionalization-modal___087d6e5c0e2422539d24283d3c916c7e.png)

- **`Breadcrumb` component** - [#436](https://github.com/vtex-sites/base.store/pull/436)
  The `Dropdown` was added to the `Breadcrumb` component. The `Dropdown` allows related pages to be linked at every level via dropdown menus.

![image](https://vtexhelp.vtexassets.com/assets/docs/src/dropdown-breadcrumb___7581fafaeba6b9857b226612fd61873f.gif)

## 🐛 Bug fix

- **Adjust Incentives List to render CMS data** - ([Base Store - #474](https://github.com/vtex-sites/base.store/pull/474))
  Now CMS users can edit the icons, title and subtitles of the Incentives List.
- **Unused CSS imports** - ([Base Store - #476](https://github.com/vtex-sites/base.store/pull/476))
  Unused CSS imports were removed from components that are not yet being used.
- **Storybook initialization** - ([Base Store - #492](https://github.com/vtex-sites/base.store/pull/492))
  To avoid issues with styles being applied while running `yarn storybook`, the `components.scss` has been added as `storybook-components.scss`, and the `package.json` was updated to include `@reach/router`.
- **Styling issue on `RegionalizationModal`** - ([Base Store - #488](https://github.com/vtex-sites/base.store/pull/488))
  The `RegionalizationModal` no longer misses its imports in `layout.css`:

```
@import "src/components/regionalization/RegionalizationBar/regionalization-bar.scss";
@import "src/components/regionalization/RegionalizationButton/regionalization-button.scss";
@import "src/components/regionalization/RegionalizationInput/regionalization-input.scss";
@import "src/components/regionalization/RegionalizationModal/regionalization-modal.scss";
```

- **Unusued CSS issues** - ([Base Store - #480](https://github.com/vtex-sites/base.store/pull/480))
  The error _"Unused CSS"_ in the Lighthouse CI is fixed.
- **`Hero` layout shift** - ([Base Store - #472](https://github.com/vtex-sites/base.store/pull/472))  
  The layout shift on `Hero` section was fixed. Now the the CLS is fixed on lighthouse report.

- **Tweaks layout section spacings** - ([Base Store - #469](https://github.com/vtex-sites/base.store/pull/469))  
  The spacing between components with the `layout section` class has been changed from _margin_ to _padding_. This change is due to a problem with the `box-shadow` on the `product-card`.

## ✨ Enhancement

- **Update Regionalization input to use the `TextInput` component** - ([Gatsby #9](https://github.com/vtex-sites/gatsby.store/pull/9) / [Next.js #9](https://github.com/vtex-sites/nextjs.store/pull/9))
  The Regionalization Input now uses the `InputText` component.
- **Update `RegionalizationButton` and `RegionalizationBar` to show the postal code** - ([Gatsby #8](https://github.com/vtex-sites/gatsby.store/pull/8) / [Next.js #7](https://github.com/vtex-sites/nextjs.store/pull/7))
  The Regionalization Button and Regionalization Bar now shows the last postal code saved, instead of receiving a `content` prop.

## 🧹 Chore

- **Update `pull_request_template.md`**[#12](https://github.com/vtex-sites/gatsby.store/pull/12)
  To better highlight the changes made in the `CHANGELOG.md` and Release Notes, new items were added to the `pull_request_template.md`.
- **Lighthouse check via GitHub Action** [#484](https://github.com/vtex-sites/base.store/pull/484)
  Removed the GitHub Action that was running Lighthouse since it was failing and WebOps already runs the Lighthouse.

## Framework-specific updates

### Gatsby

#### 🎉 New feature

- **Organizing Storybook** [#5](https://github.com/vtex-sites/gatsby.store/pull/5)
  The Storybook is now organized following the [Atomic design](https://bradfrost.com/blog/post/atomic-web-design/) classification. Storybook components now have improved controls that focus on relevant changes to each one.

#### ✨ Enhancement

- **`ImageGallery`** [#6](https://github.com/vtex-sites/gatsby.store/pull/6)  
  `ImageGallery` now uses native scroll instead of `useSlider`.

#### 🧹 Chore

- **`ImageGallery` to the PDP** [#6](https://github.com/vtex-sites/gatsby.store/pull/6)
  The `ImageGallery` component is now integrated to the PDP.
