---
toc_max_heading_level: 4
---

# Styling official starters

## Overview 

A Theme is what makes it possible to change the look and feel of a FastStore **official Starter**. It is what differentiates one UI from another and where the store branding lives. In practice, Themes are CSS stylesheets consisting of **configurable design tokens**. 

Design tokens can be classified as global or local, as presented in the following:

![](https://vtexhelp.vtexassets.com/assets/docs/src/theme___a7a122b4ca42955e79c8db8083b092f8.png)

- **Global tokens** - structural styles responsible for establishing the behavior (e.g., showing/hiding a dropdown menu) and design pattern of a component.
- **Local tokens** - a set of configurable design tokens responsible for defining the appearance of graphical elements, such as typography, type scale, colors, borders, spacing, and more.

---

## Usage

By default, every FastStore Starter comes with the **Brandless** theme.

:::info
The Brandless theme does not specify any local tokens. It is composed only of structural styles defined by global tokens.
:::

You may wish, however, to use a different color palette, grid layout, or font style. To use a custom theme, change the `theme` property in the `store.config.js` file:

```js title="store.config.js"
theme: 'midnight',
```

You can either use one of the [available themes](#list-of-themes), [extend an existing theme with additional styles](/how-to-guides/theming/extending-a-theme) or [create a new custom theme from scratch](/how-to-guides/theming/creating-a-theme).

---

## List of themes

FastStore available themes include:

<table>
<thead>
<tr>
<th align="left">Name</th>
<th align="center">Preview</th>
</tr>
</thead>
<tbody>
<tr>
<td align="left"><a className=" whitespace-nowrap" href="/how-to-guides/theming/themes/soft-blue">Soft Blue</a></td>
<td align="center"><img className="w-1/2" src="https://vtexhelp.vtexassets.com/assets/docs/src/soft-blue___17c37d94c9840b6d761cb4247be7fd9f.webp"/> </td>
</tr>
<tr>
<td align="left"><a href="/how-to-guides/theming/themes/midnight">Midnight</a></td>
<td align="center"><img className="w-1/2" src="https://vtexhelp.vtexassets.com/assets/docs/src/midnight___23f91a5508d29e7e8a7ec7a209b81fe6.webp"/> </td>
</tr>
</tbody>
</table>

---

## Theming architecture

Starting from the bottom up, we have the **components**. Each component has its own CSS stylesheet scoped into a template that controls the component's final appearance.

Each template specifies **local design tokens** using **global tokens** as variable values. Take the following example of local design tokens defined within the template of the `OutOfStock` component:

```scss
  // Title
  --fs-out-of-stock-title-margin-bottom   : var(--fs-spacing-0);
  --fs-out-of-stock-title-size            : var(--fs-text-size-lead);
  --fs-out-of-stock-title-weight          : var(--fs-text-weight-bold);
  --fs-out-of-stock-title-color           : var(--fs-color-success-text);
```

---

## Token naming scheme

### Global tokens

Global design tokens are parameters that affect the whole UI's look and feel. They are the main configuration file of a Theme. 

Global design tokens are divided into three main groups:

- **Branding core** - colors and typography.
- **UI essentials** - spacing, grid, and interactive controls.
- **Refinements** - transitions, borders, and shadows.

The naming scheme for global tokens is presented in the following:

![Theme architecture](https://vtexhelp.vtexassets.com/assets/docs/src/theming-global-tokens___e4e339f287113ecae974234ecbad1bff.png)

### Local tokens

Local design tokens follow a strict naming scheme as presented in the following:

```
--{namespace}-{component}-{type}-{category}-{state}
```

- **Namespace**: Token's source (e.g.: `fs`).
- **Component**: Token's semantic meaning  (e.g., `button`).
- **Type**: Token's property type (e.g., `border`).
- **Category** Category of the token's affected type (e.g., `color`).
- **State**: Token's interactive state (e.g., `hover`).

![Naming scheme](https://vtexhelp.vtexassets.com/assets/docs/src/theming-naming-1___32778b6c40f12a94ac4a54a90879aeef.png)

In some cases, some optional values can also be added to the token's name:

```
--{namespace}-{component}-{hierarchy}-{nested-element}-{variant}-{situation}-{type}-{category}-{state}
```

- **Hierarchy**: Token's tier (e.g., `primary`).
- **Nested element**: Element contained within the component and affected by the token (e.g., `label`).
- **Variant**: Component's variant (e.g., `wide`).
- **Situation**: Usage case (e.g., `warning`).

![Naming scheme 2](https://vtexhelp.vtexassets.com/assets/docs/src/theming-naming-2___4668c9e8da8bec361681d41b6a2e7266.png)