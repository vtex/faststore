---
name: faststore-styling
description: FastStore styling conventions including CSS custom properties (design tokens), SCSS modules for scoped component styles, component-level overrides using data-fs-* attributes, and how to import @faststore/ui styles for new sections. Use when styling components, creating SCSS modules, overriding design tokens in custom-theme.scss, targeting internal FastStore UI component styles, or importing styles for new custom sections.
metadata:
  author: vtex
  version: "1.0"
---

# FastStore Styling

## Core Rules

- All styling must use **SCSS** syntax in `.scss` files
- **No global SCSS** is permitted — all styles must be declared inside a wrapper class
- Import SCSS as **CSS Modules** inside components and apply it to the outmost wrapper element
- Prefer existing **CSS custom properties** (design tokens) over hardcoded values
- Create new variables only when no existing token fits
- In case of @faststore/core v3 is a dependency than use node-sass syntax if the it is a @faststore/core@v4 than most use dart sass.

## Design Tokens — `src/themes/custom-theme.scss`

FastStore uses CSS custom properties for theming. The token file is loaded based on the `theme` key in `discovery.config.js`.

```scss
// src/themes/custom-theme.scss
// Loaded automatically when discovery.config.js has `theme: "custom-theme"`
// Tokens must be declared inside @layer theme and .theme

@layer theme {
  .theme {
    // Colors
    --fs-color-main-0: #fff;

    // Component-level overrides using data-fs-* selectors
    [data-fs-hero][data-fs-hero-color-variant="main"] {
      --fs-hero-main-bkg-color: #000;
    }
  }
}
```

### Full tokens reference: 
 - [colors](https://developers.vtex.com/docs/guides/faststore/global-tokens-colors)
 - [Typographi](https://developers.vtex.com/docs/guides/faststore/global-tokens-typography)
 - [Spacing](https://developers.vtex.com/docs/guides/faststore/global-tokens-spacing)
 - [Layout](https://developers.vtex.com/docs/guides/faststore/global-tokens-grid-and-layout)
 - [Controls](https://developers.vtex.com/docs/guides/faststore/global-tokens-interactive-controls)
 - [Refinements](https://developers.vtex.com/docs/guides/faststore/global-tokens-refinements)

## Component-Level Styles — SCSS Modules

Each component uses a `.module.scss` file for scoped styling:

```scss
// src/components/sections/CustomIconsAlert/custom-icons-alert.module.scss

.customIconsAlert {
  // Target internal FastStore UI component structure with data-fs-* selectors
  [data-fs-alert] {
    justify-content: center;
    color: var(--fs-color-neutral-0);
    background-color: var(--fs-color-neutral-7);
  }

  [data-fs-icon],
  [data-fs-link] {
    color: var(--fs-color-neutral-0);
  }
}
```

```tsx
// Import and apply in your component
import styles from "./custom-icons-alert.module.scss";

const CustomIconsAlert = getOverriddenSection({
  Section: AlertSection,
  className: styles.customIconsAlert, // Applied to the section root element
});
```

## Importing `@faststore/ui` Styles for New Sections

Native sections automatically get their styles. **New custom sections** must manually import styles for any `@faststore/ui` components they use:

```scss
// src/components/ContactForm/contact-form.module.scss

// Import @faststore/ui styles for components used in this section: use @use syntax from dart-sass if the @faststore/core deps is v4.
@import "@faststore/ui/src/components/atoms/Button/styles.scss";
@import "@faststore/ui/src/components/atoms/InputField/styles.scss";
@import "@faststore/ui/src/components/molecules/Textarea/styles.scss";

.contactForm {
  // Your scoped styles
  display: flex;
  flex-direction: column;
  gap: var(--fs-spacing-3);
}
```

## Targeting `@faststore/ui` Component Internals

`@faststore/ui` components use `data-fs-*` attributes for their internal structure. Target these in your SCSS to style sub-elements without worrying about class name conflicts:

```scss
.mySection {
  // Target the Button component internals
  [data-fs-button] {
    background-color: var(--fs-color-primary-bkg);
  }

  // Target a specific button variant
  [data-fs-button][data-fs-button-variant="primary"] {
    color: var(--fs-color-primary-text);
  }
}
```

See [references/REFERENCE.md](references/REFERENCE.md) for the complete list of all `data-fs-*` styling attributes and design token custom properties.

## Common Design Tokens

| Token category | Example tokens |
|---------------|---------------|
| Colors | `--fs-color-main-0`, `--fs-color-neutral-0`, `--fs-color-primary-bkg` |
| Spacing | `--fs-spacing-0` through `--fs-spacing-10` |
| Typography | `--fs-text-face-body`, `--fs-text-size-base` |
| Border | `--fs-border-radius-default`, `--fs-border-width-default` |
| Shadow | `--fs-shadow-0` through `--fs-shadow-3` |
# FastStore Styling

All Faststore CSS styling conventions and custom properties (design tokens and component variables) defined across the FastStore UI package, organized by design category.

## Design tokens (CSS custom properties)

FastStore uses **CSS custom properties** (design tokens) for theming. The token file is referenced by the `theme` key in `discovery.config.js`.

```scss
// src/themes/custom-theme.scss
// Global design token overrides. This file is automatically loaded by FastStore CLI
// when discovery.config.js has `theme: "custom-theme"`.
//
// Tokens are defined inside `@layer theme` and `.theme` to ensure correct specificity
// in the CSS cascade. FastStore Core applies the `.theme` class to the root element.
//
// Full token reference: https://developers.vtex.com/docs/guides/faststore/global-tokens-overview

@layer theme {
  .theme {
    // --------------------------------------------------------
    // Colors (Branding Core)
    // Override --fs-color-* tokens to change the global palette.
    // --------------------------------------------------------
    --fs-color-main-0: #fff;

    // --------------------------------------------------------
    // Typography (Branding Core)
    // Override --fs-text-face-*, --fs-text-size-* tokens here.
    // --------------------------------------------------------

    // --------------------------------------------------------
    // Spacing (UI Essentials)
    // Override --fs-spacing-* tokens here.
    // --------------------------------------------------------

    // --------------------------------------------------------
    // FS UI Component-level overrides
    // Target specific components using their data-fs-* attributes.
    // --------------------------------------------------------
    [data-fs-hero][data-fs-hero-color-variant="main"] {
      --fs-hero-main-bkg-color: #000;
    }
  }
}
```

## Component-level styles (SCSS modules)

Each component uses **CSS Modules** (`.module.scss`) for scoped styling:

```scss
// src/components/sections/CustomIconsAlert/custom-icons-alert.module.scss
// Scoped styles for the CustomIconsAlert section.
// Uses FastStore design tokens (--fs-color-*) for consistency.
// data-fs-* selectors target the internal structure of FastStore UI components.

.customIconsAlert {
  [data-fs-alert] {
    justify-content: center;
    color: var(--fs-color-neutral-0);
    background-color: var(--fs-color-neutral-7);
  }

  [data-fs-icon],
  [data-fs-link] {
    color: var(--fs-color-neutral-0);
  }
}
```
## Importing `@faststore/ui` styles for new sections

Native sections get their styles automatically. **New sections** (not overrides) must manually import the styles for any `@faststore/ui` components they use:

```scss
// src/components/ContactForm/contact-form.module.scss
// New sections don't inherit @faststore/ui styles automatically.
// Import them explicitly for each UI component used.
// Docs: https://developers.vtex.com/docs/guides/faststore/using-themes-importing-ui-components-styles

@import "@faststore/ui/src/styles/base/utilities";

.contactForm {
  // Import styles for @faststore/ui components used in this section.
  @import "~@faststore/ui/src/components/atoms/Button/styles.scss";
  @import "~@faststore/ui/src/components/atoms/Input/styles.scss";
  @import "~@faststore/ui/src/components/molecules/InputField/styles.scss";

  // Use the media mixin to add media query breakpoint rules..
  // Existins breakpoints and their sizes:
  // - "phone": 320px
  // - "phonemid": 375px
  // - "tablet": 768px
  // - "notebook": 1280px
  // - "desktop": 1440px
  @include media(">=notebook") {
    align-items: center;
    justify-content: space-between;
  }

  @include media("<=phone") {
    align-items: left;
  }

  display: grid;
  grid-template-columns: 1fr 1fr;
  column-gap: var(--fs-spacing-2);

  > div,
  form {
    margin: var(--fs-spacing-6) 0 var(--fs-spacing-3);
  }

  h2 {
    font-family: var(--fs-text-face-title);
    font-size: var(--fs-text-size-title-page);
    margin: var(--fs-spacing-6) 0 var(--fs-spacing-3);
  }

  [data-fs-input-field] {
    margin: var(--fs-spacing-3) 0;
  }

  [data-fs-textarea] {
    width: 100%;
    margin-bottom: var(--fs-spacing-4);
    padding: var(--fs-spacing-2) var(--fs-spacing-2) 0;
    height: 150px;
  }

  [data-fs-button] {
    min-width: 250px;
    margin: auto;
  }
}
```


## Styling conventions

- Use `data-fs-*` attribute selectors to target FastStore UI component internals.
- Use `@layer theme` for global token overrides.
- Use `.module.scss` for component-scoped styles.
- Import `@faststore/ui` component styles explicitly in new (non-override) sections.
- Use "@faststore/ui/src/styles/base/utilities" mixin `@include media` for media query breakpoints styles.


---

# Tokens reference

## Global Design Tokens

Defined in `packages/ui/src/styles/base/tokens.scss`.

---

### Colors — Palette

Raw brand palette. Tone values range from lightest (`0`) to darkest (`4`).

| Variable | Default Value |
|---|---|
| `--fs-color-main-0` | `#f1f2f3` |
| `--fs-color-main-1` | `#dbdbdb` |
| `--fs-color-main-2` | `#00419e` |
| `--fs-color-main-3` | `#002c71` |
| `--fs-color-main-4` | `#002155` |
| `--fs-color-accent-0` | `#efeaf5` |
| `--fs-color-accent-1` | `#d3c9de` |
| `--fs-color-accent-2` | `#9d8abf` |
| `--fs-color-accent-3` | `#74678c` |
| `--fs-color-accent-4` | `#423759` |
| `--fs-color-neutral-0` | `#ffffff` |
| `--fs-color-neutral-1` | `#f1f2f3` |
| `--fs-color-neutral-2` | `#e3e6e8` |
| `--fs-color-neutral-3` | `#c7ccd1` |
| `--fs-color-neutral-4` | `#9099a2` |
| `--fs-color-neutral-5` | `#74808b` |
| `--fs-color-neutral-6` | `#5d666f` |
| `--fs-color-neutral-7` | `#171a1c` |

---

### Colors — Hierarchy

Semantic color aliases for UI element hierarchy (primary, secondary, tertiary, action).

| Variable | Default Value |
|---|---|
| `--fs-color-primary-text` | `var(--fs-color-text-inverse)` |
| `--fs-color-primary-bkg` | `var(--fs-color-main-2)` |
| `--fs-color-primary-bkg-hover` | `var(--fs-color-main-3)` |
| `--fs-color-primary-bkg-active` | `var(--fs-color-main-4)` |
| `--fs-color-primary-bkg-light` | `var(--fs-color-main-0)` |
| `--fs-color-primary-bkg-light-active` | `var(--fs-color-main-1)` |
| `--fs-color-secondary-text` | `var(--fs-color-primary-bkg)` |
| `--fs-color-secondary-bkg` | `transparent` |
| `--fs-color-secondary-bkg-hover` | `var(--fs-color-primary-bkg)` |
| `--fs-color-secondary-bkg-active` | `var(--fs-color-main-3)` |
| `--fs-color-secondary-bkg-light` | `var(--fs-color-main-0)` |
| `--fs-color-secondary-bkg-light-active` | `var(--fs-color-secondary-bkg-light)` |
| `--fs-color-tertiary-text` | `var(--fs-color-link)` |
| `--fs-color-tertiary-bkg` | `transparent` |
| `--fs-color-tertiary-bkg-hover` | `var(--fs-color-main-0)` |
| `--fs-color-tertiary-bkg-active` | `var(--fs-color-main-1)` |
| `--fs-color-tertiary-bkg-light` | `var(--fs-color-neutral-0)` |
| `--fs-color-tertiary-bkg-light-active` | `var(--fs-color-tertiary-bkg-light)` |
| `--fs-color-action-text` | `var(--fs-color-text-inverse)` |
| `--fs-color-action-bkg` | `var(--fs-color-accent-4)` |
| `--fs-color-action-bkg-hover` | `var(--fs-color-accent-3)` |
| `--fs-color-action-bkg-active` | `var(--fs-color-accent-2)` |
| `--fs-color-action-bkg-light` | `var(--fs-color-neutral-0)` |
| `--fs-color-action-bkg-light-active` | `var(--fs-color-tertiary-bkg-light)` |

---

### Colors — Body, Text & Link

| Variable | Default Value |
|---|---|
| `--fs-color-body-bkg` | `var(--fs-color-neutral-0)` |
| `--fs-body-bkg` | `var(--fs-color-body-bkg)` |
| `--fs-color-text` | `var(--fs-color-neutral-7)` |
| `--fs-color-text-light` | `var(--fs-color-neutral-6)` |
| `--fs-color-text-inverse` | `var(--fs-color-neutral-0)` |
| `--fs-color-text-display` | `var(--fs-color-neutral-7)` |
| `--fs-color-link` | `var(--fs-color-main-2)` |
| `--fs-color-link-hover` | `var(--fs-color-main-2)` |
| `--fs-color-link-active` | `var(--fs-color-main-4)` |
| `--fs-color-link-visited` | `#6058ba` |
| `--fs-color-link-inverse` | `var(--fs-color-neutral-0)` |
| `--fs-color-disabled-text` | `var(--fs-color-neutral-6)` |
| `--fs-color-disabled-bkg` | `var(--fs-color-neutral-2)` |

---

### Colors — Focus Ring

| Variable | Default Value |
|---|---|
| `--fs-color-focus-ring` | `#8db6fa` |
| `--fs-color-focus-ring-outline` | `#8db6fa80` |
| `--fs-color-focus-ring-danger` | `#e1adad` |

---

### Colors — Situations

Semantic feedback colors for success, warning, danger, info, highlighted, and neutral states.

| Variable | Default Value |
|---|---|
| `--fs-color-success-0` | `#1e493b` |
| `--fs-color-success-1` | `#b3ebd5` |
| `--fs-color-success-2` | `#016810` |
| `--fs-color-success-text` | `var(--fs-color-success-0)` |
| `--fs-color-success-bkg` | `var(--fs-color-success-1)` |
| `--fs-color-success-border` | `var(--fs-color-success-text)` |
| `--fs-color-warning-text` | `var(--fs-color-text)` |
| `--fs-color-warning-bkg` | `#fdec8d` |
| `--fs-color-warning-border` | `var(--fs-color-warning-text)` |
| `--fs-color-danger-text` | `#cb4242` |
| `--fs-color-danger-bkg` | `var(--fs-color-focus-ring-danger)` |
| `--fs-color-danger-border` | `var(--fs-color-danger-text)` |
| `--fs-color-info-text` | `var(--fs-color-text)` |
| `--fs-color-info-bkg` | `var(--fs-color-main-1)` |
| `--fs-color-highlighted-text` | `var(--fs-color-text-display)` |
| `--fs-color-highlighted-bkg` | `var(--fs-color-accent-0)` |
| `--fs-color-neutral-text` | `var(--fs-color-text)` |
| `--fs-color-neutral-bkg` | `var(--fs-color-neutral-1)` |

---

### Typography — Font Face

| Variable | Default Value |
|---|---|
| `--fs-text-face-body` | `-apple-system, system-ui, BlinkMacSystemFont, sans-serif` |
| `--fs-text-face-title` | `var(--fs-text-face-body)` |

---

### Typography — Font Weight

| Variable | Default Value |
|---|---|
| `--fs-text-weight-light` | `300` |
| `--fs-text-weight-regular` | `400` |
| `--fs-text-weight-medium` | `500` |
| `--fs-text-weight-semibold` | `600` |
| `--fs-text-weight-bold` | `700` |
| `--fs-text-weight-black` | `900` |

---

### Typography — Numeric Scale

Fluid scale with breakpoint overrides: mobile step = `2px`, desktop step = `4px`.

| Variable | Mobile | Desktop |
|---|---|---|
| `--fs-text-size-base` | `16px` | `16px` |
| `--fs-text-size-0` | `12px` | `12px` |
| `--fs-text-size-1` | `14px` | `14px` |
| `--fs-text-size-2` | `16px` | `16px` |
| `--fs-text-size-3` | `18px` | `20px` |
| `--fs-text-size-4` | `20px` | `24px` |
| `--fs-text-size-5` | `22px` | `28px` |
| `--fs-text-size-6` | `24px` | `32px` |
| `--fs-text-size-7` | `28px` | `40px` |
| `--fs-text-size-8` | `32px` | `48px` |
| `--fs-text-size-9` | `36px` | `56px` |
| `--fs-text-scale-mobile` | `2px` | — |
| `--fs-text-scale-desktop` | — | `4px` |
| `--fs-scale` | `var(--fs-text-scale-mobile)` | `var(--fs-text-scale-desktop)` |
| `--fs-text-max-lines` | `2` | — |

---

### Typography — Semantic Sizes

| Variable | Default Value |
|---|---|
| `--fs-text-size-title-huge` | `var(--fs-text-size-8)` |
| `--fs-text-size-title-page` | `var(--fs-text-size-7)` |
| `--fs-text-size-title-product` | `var(--fs-text-size-4)` |
| `--fs-text-size-title-section` | `var(--fs-text-size-4)` |
| `--fs-text-size-title-subsection` | `var(--fs-text-size-4)` |
| `--fs-text-size-title-mini` | `var(--fs-text-size-4)` |
| `--fs-text-size-lead` | `var(--fs-text-size-3)` |
| `--fs-text-size-menu` | `var(--fs-text-size-base)` |
| `--fs-text-size-body` | `var(--fs-text-size-base)` |
| `--fs-text-size-legend` | `var(--fs-text-size-1)` |
| `--fs-text-size-tiny` | `var(--fs-text-size-0)` |

---

### Spacing

8-point-like scale from `4px` to `96px`.

| Variable | Value |
|---|---|
| `--fs-spacing-0` | `.25rem` (4px) |
| `--fs-spacing-1` | `.5rem` (8px) |
| `--fs-spacing-2` | `.75rem` (12px) |
| `--fs-spacing-3` | `1rem` (16px) |
| `--fs-spacing-4` | `1.5rem` (24px) |
| `--fs-spacing-5` | `2rem` (32px) |
| `--fs-spacing-6` | `2.5rem` (40px) |
| `--fs-spacing-7` | `3rem` (48px) |
| `--fs-spacing-8` | `3.5rem` (56px) |
| `--fs-spacing-9` | `4rem` (64px) |
| `--fs-spacing-10` | `4.5rem` (72px) |
| `--fs-spacing-11` | `5rem` (80px) |
| `--fs-spacing-12` | `5.5rem` (88px) |
| `--fs-spacing-13` | `6rem` (96px) |

---

### Grid & Layout

| Variable | Default Value |
|---|---|
| **Padding** | |
| `--fs-grid-padding` | `var(--fs-spacing-3)` (≥tablet: `--fs-spacing-4`, ≥notebook: `--fs-spacing-5`) |
| **Container** | |
| `--fs-grid-max-width` | `calc(--fs-grid-breakpoint-notebook - 2 × --fs-grid-padding)` |
| **Gaps** | |
| `--fs-grid-gap-0` | `var(--fs-spacing-1)` |
| `--fs-grid-gap-1` | `var(--fs-spacing-2)` |
| `--fs-grid-gap-2` | `var(--fs-spacing-3)` |
| `--fs-grid-gap-3` | `var(--fs-spacing-4)` |
| `--fs-grid-gap-4` | `var(--fs-spacing-5)` |
| **Breakpoints** | |
| `--fs-grid-breakpoint-phone` | Sass map value |
| `--fs-grid-breakpoint-phonemid` | Sass map value |
| `--fs-grid-breakpoint-tablet` | Sass map value |
| `--fs-grid-breakpoint-notebook` | Sass map value |
| `--fs-grid-breakpoint-desktop` | Sass map value |
| **Z-Index** | |
| `--fs-z-index-below` | `-1` |
| `--fs-z-index-default` | `0` |
| `--fs-z-index-top` | `1` |
| `--fs-z-index-high` | `2` |
| `--fs-z-index-highest` | `3` |

---

### Interactive Controls

| Variable | Default Value |
|---|---|
| `--fs-control-tap-size` | `var(--fs-spacing-7)` (48px) |
| `--fs-control-tap-size-smallest` | `calc(--fs-control-tap-size / 2)` |
| `--fs-control-min-height` | `var(--fs-control-tap-size)` |
| `--fs-control-bkg` | `var(--fs-color-neutral-0)` |
| `--fs-control-bkg-disabled` | `var(--fs-color-disabled-bkg)` |

---

### Transitions & Animation

| Variable | Default Value |
|---|---|
| `--fs-transition-timing` | `.2s` |
| `--fs-transition-property` | `all` |
| `--fs-transition-function` | `ease-in-out` |

---

### Borders — Radius

| Variable | Default Value |
|---|---|
| `--fs-border-radius-small` | `1px` |
| `--fs-border-radius` | `2px` |
| `--fs-border-radius-medium` | `8px` |
| `--fs-border-radius-pill` | `100px` |
| `--fs-border-radius-circle` | `100%` |

---

### Borders — Width

| Variable | Default Value |
|---|---|
| `--fs-border-width` | `1px` |
| `--fs-border-width-thick` | `2px` |
| `--fs-border-width-thickest` | `3px` |

---

### Borders — Color

| Variable | Default Value |
|---|---|
| `--fs-border-color` | `var(--fs-color-neutral-4)` |
| `--fs-border-color-hover` | `var(--fs-color-main-3)` |
| `--fs-border-color-active` | `var(--fs-color-main-2)` |
| `--fs-border-color-disabled` | `var(--fs-color-neutral-6)` |
| `--fs-border-color-light` | `var(--fs-color-neutral-2)` |
| `--fs-border-color-light-hover` | `var(--fs-color-neutral-3)` |
| `--fs-border-color-light-active` | `var(--fs-color-neutral-3)` |
| `--fs-border-color-light-disabled` | `var(--fs-color-neutral-5)` |

---

### Shadows

| Variable | Default Value |
|---|---|
| `--fs-shadow` | `none` |
| `--fs-shadow-darker` | `0 0 10px rgb(0 0 0 / 20%)` |
| `--fs-shadow-hover` | `0 2px 3px rgb(0 0 0 / 10%)` |

---

### Miscellaneous

| Variable | Default Value |
|---|---|
| `--fs-logo-width` | `7rem` |

---

## Component Variables

---

## Atoms

### Badge

| Variable | Default Value |
|---|---|
| `--fs-badge-padding` | `var(--fs-spacing-0) var(--fs-spacing-2)` |
| `--fs-badge-big-padding` | `var(--fs-spacing-1) var(--fs-spacing-2)` |
| `--fs-badge-bkg-color` | `var(--fs-color-neutral-bkg)` |
| `--fs-badge-border-color` | `transparent` |
| `--fs-badge-border-radius` | `var(--fs-border-radius-pill)` |
| `--fs-badge-border-style` | `none` |
| `--fs-badge-border-width` | `0` |
| `--fs-badge-text-color` | `var(--fs-color-text)` |
| `--fs-badge-text-size` | `var(--fs-text-size-tiny)` |
| `--fs-badge-big-text-size` | `var(--fs-text-size-legend)` |
| `--fs-badge-text-weight` | `var(--fs-text-weight-bold)` |
| `--fs-badge-transition-timing` | `var(--fs-transition-timing)` |
| `--fs-badge-transition-property` | `var(--fs-transition-property)` |
| `--fs-badge-transition-function` | `var(--fs-transition-function)` |
| **Variants** | |
| `--fs-badge-success-bkg-color` | `var(--fs-color-success-bkg)` |
| `--fs-badge-success-border-color` | `var(--fs-color-success-bkg)` |
| `--fs-badge-success-text-color` | `var(--fs-badge-text-color)` |
| `--fs-badge-warning-bkg-color` | `var(--fs-color-warning-bkg)` |
| `--fs-badge-warning-border-color` | `var(--fs-color-warning-bkg)` |
| `--fs-badge-warning-text-color` | `var(--fs-color-warning-text)` |
| `--fs-badge-danger-bkg-color` | `var(--fs-color-danger-bkg)` |
| `--fs-badge-danger-border-color` | `var(--fs-color-danger-bkg)` |
| `--fs-badge-danger-text-color` | `var(--fs-badge-text-color)` |
| `--fs-badge-info-bkg-color` | `var(--fs-color-info-bkg)` |
| `--fs-badge-info-border-color` | `var(--fs-color-info-bkg)` |
| `--fs-badge-info-text-color` | `var(--fs-color-info-text)` |
| `--fs-badge-highlighted-bkg-color` | `var(--fs-color-highlighted-bkg)` |
| `--fs-badge-highlighted-border-color` | `var(--fs-color-highlighted-bkg)` |
| `--fs-badge-highlighted-text-color` | `var(--fs-color-highlighted-text)` |
| `--fs-badge-neutral-bkg-color` | `var(--fs-color-neutral-bkg)` |
| `--fs-badge-neutral-border-color` | `var(--fs-color-neutral-bkg)` |
| `--fs-badge-neutral-text-color` | `var(--fs-badge-text-color)` |
| **Counter** | |
| `--fs-badge-counter-bkg-color` | `var(--fs-color-link)` |
| `--fs-badge-counter-border-color` | `var(--fs-color-body-bkg)` |
| `--fs-badge-counter-border-radius` | `var(--fs-border-radius-pill)` |
| `--fs-badge-counter-padding` | `var(--fs-spacing-0)` |
| `--fs-badge-counter-size` | `var(--fs-spacing-3)` |
| `--fs-badge-counter-text-color` | `var(--fs-color-text-inverse)` |
| `--fs-badge-counter-text-size` | `var(--fs-text-size-0)` |

---

### Button

| Variable | Default Value |
|---|---|
| **Size & Shape** | |
| `--fs-button-height` | `var(--fs-control-tap-size)` |
| `--fs-button-padding` | `calc(var(--fs-spacing-1) - (var(--fs-button-border-width) * 2)) var(--fs-spacing-3)` |
| `--fs-button-gap` | `var(--fs-spacing-2)` |
| `--fs-button-icon-padding` | `0 var(--fs-spacing-1)` |
| `--fs-button-border-radius` | `var(--fs-border-radius)` |
| `--fs-button-border-width` | `var(--fs-border-width-thick)` |
| `--fs-button-border-color` | `transparent` |
| **Typography** | |
| `--fs-button-text-size` | `var(--fs-text-size-base)` |
| `--fs-button-text-weight` | `var(--fs-text-weight-bold)` |
| **States — Disabled** | |
| `--fs-button-disabled-bkg-color` | `var(--fs-color-disabled-bkg)` |
| `--fs-button-disabled-text-color` | `var(--fs-color-disabled-text)` |
| **Shadow** | |
| `--fs-button-shadow` | `var(--fs-shadow)` |
| `--fs-button-shadow-hover` | `var(--fs-button-shadow)` |
| **Loading** | |
| `--fs-button-loading-label-column-gap` | `var(--fs-spacing-3)` |
| **Transition** | |
| `--fs-button-transition-timing` | `var(--fs-transition-timing)` |
| `--fs-button-transition-property` | `var(--fs-transition-property)` |
| `--fs-button-transition-function` | `var(--fs-transition-function)` |
| **Small variant** | |
| `--fs-button-small-gap` | `var(--fs-spacing-1)` |
| `--fs-button-small-padding` | `var(--fs-spacing-0) var(--fs-spacing-1)` |
| `--fs-button-small-min-height` | `var(--fs-spacing-7)` |
| `--fs-button-small-icon-width` | `var(--fs-spacing-3)` |
| `--fs-button-small-icon-height` | `var(--fs-button-small-icon-width)` |
| **Primary** | |
| `--fs-button-primary-bkg-color` | `var(--fs-color-primary-bkg)` |
| `--fs-button-primary-bkg-color-hover` | `var(--fs-color-primary-bkg-hover)` |
| `--fs-button-primary-bkg-color-active` | `var(--fs-color-primary-bkg-active)` |
| `--fs-button-primary-text-color` | `var(--fs-color-primary-text)` |
| `--fs-button-primary-text-color-hover` | `var(--fs-button-primary-text-color)` |
| `--fs-button-primary-text-color-active` | `var(--fs-button-primary-text-color)` |
| `--fs-button-primary-border-color` | `transparent` |
| `--fs-button-primary-border-color-hover` | `var(--fs-button-primary-border-color)` |
| `--fs-button-primary-border-color-active` | `var(--fs-button-primary-border-color)` |
| `--fs-button-primary-shadow-hover` | `var(--fs-button-shadow-hover)` |
| **Primary Inverse** | |
| `--fs-button-primary-inverse-bkg-color` | `var(--fs-button-primary-text-color)` |
| `--fs-button-primary-inverse-bkg-color-hover` | `var(--fs-color-primary-bkg-light)` |
| `--fs-button-primary-inverse-bkg-color-active` | `var(--fs-color-primary-bkg-light-active)` |
| `--fs-button-primary-inverse-text-color` | `var(--fs-button-primary-bkg-color)` |
| `--fs-button-primary-inverse-text-color-hover` | `var(--fs-button-primary-bkg-color)` |
| `--fs-button-primary-inverse-text-color-active` | `var(--fs-button-primary-bkg-color)` |
| `--fs-button-primary-inverse-border-color` | `var(--fs-button-primary-border-color)` |
| `--fs-button-primary-inverse-border-color-hover` | `var(--fs-button-primary-border-color)` |
| `--fs-button-primary-inverse-border-color-active` | `var(--fs-button-primary-border-color)` |
| `--fs-button-primary-inverse-shadow-hover` | `var(--fs-button-shadow-hover)` |
| **Secondary** | |
| `--fs-button-secondary-bkg-color` | `var(--fs-color-secondary-bkg)` |
| `--fs-button-secondary-bkg-color-hover` | `var(--fs-color-secondary-bkg-hover)` |
| `--fs-button-secondary-bkg-color-active` | `var(--fs-color-secondary-bkg-active)` |
| `--fs-button-secondary-text-color` | `var(--fs-color-secondary-text)` |
| `--fs-button-secondary-text-color-hover` | `var(--fs-color-text-inverse)` |
| `--fs-button-secondary-text-color-active` | `var(--fs-button-secondary-text-color-hover)` |
| `--fs-button-secondary-border-color` | `var(--fs-button-secondary-text-color)` |
| `--fs-button-secondary-border-color-hover` | `var(--fs-button-secondary-bkg-color-hover)` |
| `--fs-button-secondary-border-color-active` | `var(--fs-button-secondary-bkg-color-active)` |
| `--fs-button-secondary-shadow-hover` | `var(--fs-button-shadow-hover)` |
| **Secondary Inverse** | |
| `--fs-button-secondary-inverse-bkg-color` | `var(--fs-button-secondary-bkg-color)` |
| `--fs-button-secondary-inverse-bkg-color-hover` | `var(--fs-button-secondary-text-color-hover)` |
| `--fs-button-secondary-inverse-bkg-color-active` | `var(--fs-color-secondary-bkg-light)` |
| `--fs-button-secondary-inverse-text-color` | `var(--fs-button-secondary-text-color-hover)` |
| `--fs-button-secondary-inverse-text-color-hover` | `var(--fs-button-secondary-text-color)` |
| `--fs-button-secondary-inverse-text-color-active` | `var(--fs-button-secondary-inverse-text-color-hover)` |
| `--fs-button-secondary-inverse-border-color` | `var(--fs-button-secondary-inverse-text-color)` |
| `--fs-button-secondary-inverse-border-color-hover` | `var(--fs-button-secondary-inverse-bkg-color-hover)` |
| `--fs-button-secondary-inverse-border-color-active` | `var(--fs-button-secondary-inverse-bkg-color-active)` |
| `--fs-button-secondary-inverse-shadow-hover` | `var(--fs-button-shadow-hover)` |
| **Tertiary** | |
| `--fs-button-tertiary-bkg-color` | `var(--fs-color-tertiary-bkg)` |
| `--fs-button-tertiary-bkg-color-hover` | `var(--fs-color-tertiary-bkg-hover)` |
| `--fs-button-tertiary-bkg-color-active` | `var(--fs-color-tertiary-bkg-active)` |
| `--fs-button-tertiary-text-color` | `var(--fs-color-tertiary-text)` |
| `--fs-button-tertiary-text-color-hover` | `var(--fs-button-tertiary-text-color)` |
| `--fs-button-tertiary-text-color-active` | `var(--fs-button-primary-bkg-color)` |
| `--fs-button-tertiary-border-color` | `transparent` |
| `--fs-button-tertiary-border-color-hover` | `var(--fs-button-tertiary-border-color)` |
| `--fs-button-tertiary-border-color-active` | `var(--fs-button-tertiary-border-color)` |
| `--fs-button-tertiary-shadow-hover` | `var(--fs-button-shadow-hover)` |
| **Tertiary Inverse** | |
| `--fs-button-tertiary-inverse-bkg-color` | `var(--fs-button-secondary-inverse-bkg-color)` |
| `--fs-button-tertiary-inverse-bkg-color-hover` | `var(--fs-button-primary-bkg-color-hover)` |
| `--fs-button-tertiary-inverse-bkg-color-active` | `var(--fs-button-primary-bkg-color-active)` |
| `--fs-button-tertiary-inverse-text-color` | `var(--fs-button-secondary-text-color-hover)` |
| `--fs-button-tertiary-inverse-text-color-hover` | `var(--fs-button-secondary-text-color-hover)` |
| `--fs-button-tertiary-inverse-text-color-active` | `var(--fs-button-secondary-text-color-hover)` |
| `--fs-button-tertiary-inverse-border-color` | `var(--fs-button-tertiary-border-color)` |
| `--fs-button-tertiary-inverse-border-color-hover` | `var(--fs-button-tertiary-border-color)` |
| `--fs-button-tertiary-inverse-border-color-active` | `var(--fs-button-tertiary-border-color)` |
| `--fs-button-tertiary-inverse-shadow-hover` | `var(--fs-button-shadow-hover)` |

---

### Checkbox

| Variable | Default Value |
|---|---|
| `--fs-checkbox-width` | `1.25rem` |
| `--fs-checkbox-height` | `var(--fs-checkbox-width)` |
| `--fs-checkbox-border-radius` | `var(--fs-border-radius)` |
| `--fs-checkbox-border-color` | `var(--fs-border-color)` |
| `--fs-checkbox-border-color-hover` | `var(--fs-border-color-active)` |
| `--fs-checkbox-border-width` | `var(--fs-border-width)` |
| `--fs-checkbox-bkg-color-hover` | `var(--fs-color-primary-bkg-light)` |
| `--fs-checkbox-shadow-hover` | `0 0 0 var(--fs-checkbox-border-width) var(--fs-border-color-active)` |
| `--fs-checkbox-transition` | `border, background-color, box-shadow` |
| **Checked** | |
| `--fs-checkbox-checked-bkg-color` | `var(--fs-color-primary-bkg)` |
| `--fs-checkbox-checked-bkg-color-hover` | `var(--fs-color-primary-bkg-hover)` |
| `--fs-checkbox-checked-border-color-hover` | `var(--fs-border-color-hover)` |
| `--fs-checkbox-checked-shadow-hover` | `0 0 0 var(--fs-checkbox-border-width) var(--fs-checkbox-checked-border-color-hover)` |
| **Partial** | |
| `--fs-checkbox-partial-bkg-color` | `var(--fs-color-body-bkg)` |
| `--fs-checkbox-partial-bkg-color-hover` | `var(--fs-color-primary-bkg-light)` |
| `--fs-checkbox-partial-border-color` | `var(--fs-color-primary-bkg)` |
| `--fs-checkbox-partial-border-width` | `var(--fs-checkbox-border-width)` |
| **Disabled** | |
| `--fs-checkbox-disabled-bkg-color` | `var(--fs-color-disabled-bkg)` |
| `--fs-checkbox-disabled-border-color` | `var(--fs-border-color-disabled)` |
| `--fs-checkbox-disabled-border-width` | `var(--fs-checkbox-border-width)` |
| `--fs-checkbox-disabled-text-color` | `var(--fs-color-disabled-text)` |
| **Field (label + error)** | |
| `--fs-checkbox-field-gap` | `var(--fs-spacing-1)` |
| `--fs-checkbox-field-label-color` | `var(--fs-color-text-light)` |
| `--fs-checkbox-field-label-line-height` | `1.42` |
| `--fs-checkbox-field-label-size` | `var(--fs-text-size-1)` |
| `--fs-checkbox-field-label-weight` | `var(--fs-text-weight-regular)` |
| `--fs-checkbox-field-error-border-color` | `var(--fs-color-danger-border)` |
| `--fs-checkbox-field-error-message-color` | `var(--fs-color-danger-text)` |
| `--fs-checkbox-field-error-message-line-height` | `1.1` |
| `--fs-checkbox-field-error-message-margin-top` | `var(--fs-spacing-0)` |
| `--fs-checkbox-field-error-message-size` | `var(--fs-text-size-legend)` |

---

### Input

| Variable | Default Value |
|---|---|
| `--fs-input-height` | `var(--fs-control-tap-size)` |
| `--fs-input-padding` | `var(--fs-spacing-1) var(--fs-spacing-2)` |
| `--fs-input-line-height` | `1.25` |
| `--fs-input-bkg-color` | `var(--fs-color-body-bkg)` |
| `--fs-input-border-color` | `var(--fs-border-color)` |
| `--fs-input-border-color-hover` | `var(--fs-border-color-active)` |
| `--fs-input-border-radius` | `var(--fs-border-radius)` |
| `--fs-input-border-width` | `var(--fs-border-width)` |
| `--fs-input-box-shadow` | `none` |
| `--fs-input-box-shadow-hover` | `0 0 0 var(--fs-border-width) var(--fs-border-color-active)` |
| `--fs-input-text-color` | `var(--fs-color-text)` |
| `--fs-input-text-size` | `var(--fs-text-size-body)` |
| `--fs-input-transition-timing` | `var(--fs-transition-timing)` |
| `--fs-input-transition-property` | `var(--fs-transition-property)` |
| `--fs-input-transition-function` | `var(--fs-transition-function)` |
| **Disabled** | |
| `--fs-input-disabled-bkg-color` | `var(--fs-color-disabled-bkg)` |
| `--fs-input-disabled-border-color` | `var(--fs-border-color)` |
| `--fs-input-disabled-border-width` | `var(--fs-border-width)` |
| `--fs-input-disabled-text-color` | `var(--fs-color-disabled-text)` |

---

### Link

| Variable | Default Value |
|---|---|
| `--fs-link-padding` | `var(--fs-spacing-2) var(--fs-spacing-0)` |
| `--fs-link-small-padding` | `var(--fs-spacing-1) var(--fs-spacing-0)` |
| `--fs-link-small-text-size` | `var(--fs-text-size-1)` |
| `--fs-link-min-width` | `auto` |
| `--fs-link-min-height` | `var(--fs-link-min-width)` |
| `--fs-link-border-radius` | `var(--fs-border-radius)` |
| `--fs-link-text-color` | `var(--fs-color-link)` |
| `--fs-link-text-color-visited` | `var(--fs-color-link-visited)` |
| `--fs-link-text-decoration` | `none` |
| `--fs-link-text-decoration-hover` | `underline` |
| `--fs-link-text-line-height` | `1.5` |
| `--fs-link-transition-timing` | `var(--fs-transition-timing)` |
| `--fs-link-transition-property` | `var(--fs-transition-property)` |
| `--fs-link-transition-function` | `var(--fs-transition-function)` |
| **Inline variant** | |
| `--fs-link-inline-padding` | `0` |
| `--fs-link-inline-text-color` | `var(--fs-link-text-color)` |
| `--fs-link-inline-text-decoration` | `underline` |
| **Display variant** | |
| `--fs-link-display-text-color` | `var(--fs-color-text-display)` |
| `--fs-link-display-text-color-visited` | `var(--fs-link-display-text-color)` |
| `--fs-link-display-text-line-height` | `var(--fs-link-text-line-height)` |
| **Inverse variant** | |
| `--fs-link-inverse-text-color` | `var(--fs-color-link-inverse)` |
| `--fs-link-inverse-text-color-visited` | `var(--fs-link-inverse-text-color)` |

---

### List

| Variable | Default Value |
|---|---|
| `--fs-list-style-ordered` | `decimal` |
| `--fs-list-style-unordered` | `initial` |

---

### Loader

| Variable | Default Value |
|---|---|
| `--fs-loader-gap` | `var(--fs-spacing-0)` |
| `--fs-loader-item-width` | `var(--fs-spacing-0)` |
| `--fs-loader-item-height` | `var(--fs-loader-item-width)` |
| `--fs-loader-item-border-radius` | `var(--fs-border-radius-circle)` |
| `--fs-loader-item-initial-opacity` | `.6` |
| `--fs-loader-animation-timing` | `var(--fs-transition-timing)` |
| `--fs-loader-animation-function` | `var(--fs-transition-function)` |
| `--fs-loader-dark-item-bkg-color` | `var(--fs-color-primary-bkg-active)` |
| `--fs-loader-light-item-bkg-color` | `var(--fs-color-tertiary-bkg-light)` |

---

### Overlay

| Variable | Default Value |
|---|---|
| `--fs-overlay-bkg-color` | `rgb(0 0 0 / 20%)` |

---

### Price

| Variable | Default Value |
|---|---|
| `--fs-price-spot-color` | `var(--fs-color-text)` |
| `--fs-price-spot-font-weight` | `var(--fs-text-weight-bold)` |
| `--fs-price-listing-color` | `var(--fs-color-text-light)` |
| `--fs-price-listing-text-decoration` | `line-through` |
| `--fs-price-listing-text-size` | `var(--fs-text-size-legend)` |

---

### Radio

| Variable | Default Value |
|---|---|
| `--fs-radio-width` | `1.25rem` |
| `--fs-radio-height` | `var(--fs-radio-width)` |
| `--fs-radio-border-radius` | `var(--fs-border-radius-circle)` |
| `--fs-radio-border-color` | `var(--fs-border-color)` |
| `--fs-radio-border-color-hover` | `var(--fs-border-color-hover)` |
| `--fs-radio-border-width` | `var(--fs-border-width)` |
| `--fs-radio-bkg-color-hover` | `var(--fs-color-primary-bkg-light)` |
| `--fs-radio-shadow-hover` | `0 0 0 var(--fs-radio-border-width) var(--fs-border-color-active)` |
| `--fs-radio-transition` | `border, background-color, box-shadow` |
| `--fs-radio-field-gap` | `var(--fs-spacing-1)` |
| `--fs-radio-knob-bkg-color` | `var(--fs-color-body-bkg)` |
| `--fs-radio-knob-width` | `var(--fs-spacing-1)` |
| `--fs-radio-knob-height` | `var(--fs-radio-knob-width)` |
| **Checked** | |
| `--fs-radio-checked-bkg-color` | `var(--fs-color-primary-bkg)` |
| `--fs-radio-checked-bkg-color-hover` | `var(--fs-color-primary-bkg-hover)` |
| **Disabled** | |
| `--fs-radio-disabled-bkg-color` | `var(--fs-color-disabled-bkg)` |
| `--fs-radio-disabled-border-color` | `var(--fs-border-color-disabled)` |
| `--fs-radio-disabled-border-width` | `var(--fs-radio-border-width)` |
| `--fs-radio-disabled-text-color` | `var(--fs-color-disabled-text)` |
| `--fs-radio-knob-disabled-bkg-color` | `var(--fs-color-neutral-5)` |

---

### Select

| Variable | Default Value |
|---|---|
| `--fs-select-height` | `var(--fs-spacing-6)` |
| `--fs-select-min-height` | `var(--fs-control-tap-size)` |
| `--fs-select-padding` | `var(--fs-spacing-1) var(--fs-spacing-5) var(--fs-spacing-1) var(--fs-spacing-2)` |
| `--fs-select-border-radius` | `var(--fs-border-radius)` |
| `--fs-select-bkg` | `transparent` |
| `--fs-select-bkg-color-hover` | `var(--fs-select-bkg-color-focus)` |
| `--fs-select-bkg-color-focus` | `var(--fs-color-primary-bkg-light)` |
| `--fs-select-text-color` | `var(--fs-color-link)` |
| `--fs-select-icon-color` | `var(--fs-color-link)` |
| `--fs-select-icon-width` | `var(--fs-spacing-3)` |
| `--fs-select-icon-height` | `var(--fs-select-icon-width)` |
| `--fs-select-icon-position-right` | `var(--fs-spacing-1)` |
| `--fs-select-transition-timing` | `var(--fs-transition-timing)` |
| `--fs-select-transition-property` | `var(--fs-transition-property)` |
| `--fs-select-transition-function` | `var(--fs-transition-function)` |
| `--fs-select-disabled-text-color` | `var(--fs-color-disabled-text)` |
| `--fs-select-disabled-text-opacity` | `1` |
| **Field** | |
| `--fs-select-field-label-color` | `var(--fs-color-text-light)` |
| `--fs-select-field-label-margin-right` | `var(--fs-spacing-1)` |

---

### Skeleton

| Variable | Default Value |
|---|---|
| `--fs-skeleton-bkg-color` | `var(--fs-color-disabled-bkg)` |
| `--fs-skeleton-border-radius` | `var(--fs-border-radius)` |
| `--fs-skeleton-shimmer-bkg-color` | `rgb(255 255 255 / 20%)` |
| `--fs-skeleton-shimmer-box-shadow` | `0 0 var(--fs-spacing-5) var(--fs-spacing-5) var(--fs-skeleton-shimmer-bkg-color)` |
| `--fs-skeleton-shimmer-height` | `100%` |
| `--fs-skeleton-shimmer-width` | `50%` |
| `--fs-skeleton-shimmer-transition-timing` | `850ms` |
| `--fs-skeleton-shimmer-transition-iteration` | `infinite` |
| `--fs-skeleton-shimmer-transition-function` | `linear` |

---

### Slider

| Variable | Default Value |
|---|---|
| `--fs-slider-height` | `var(--fs-spacing-2)` |
| `--fs-slider-border-radius` | `var(--fs-border-radius-pill)` |
| `--fs-slider-margin-bottom` | `var(--fs-spacing-3)` |
| `--fs-slider-bkg-color` | `var(--fs-color-neutral-bkg)` |
| `--fs-slider-selection-bkg-color` | `var(--fs-color-primary-bkg-light-active)` |
| `--fs-slider-absolute-values-text-color` | `var(--fs-color-disabled-text)` |
| `--fs-slider-thumb-size` | `var(--fs-spacing-4)` |
| `--fs-slider-thumb-bkg-color` | `var(--fs-color-primary-bkg)` |
| `--fs-slider-thumb-bkg-color-hover` | `var(--fs-color-primary-bkg-hover)` |
| `--fs-slider-thumb-border-color` | `var(--fs-slider-thumb-bkg-color)` |
| `--fs-slider-thumb-border-color-hover` | `var(--fs-slider-thumb-bkg-color-hover)` |
| `--fs-slider-thumb-border-radius` | `var(--fs-border-radius-circle)` |
| `--fs-slider-thumb-border-width` | `var(--fs-border-width)` |
| `--fs-slider-value-label-bkg-color` | `var(--fs-color-body-bkg)` |
| `--fs-slider-value-label-bottom` | `var(--fs-spacing-3)` |
| `--fs-slider-transition-timing` | `var(--fs-transition-timing)` |
| `--fs-slider-transition-property` | `var(--fs-transition-property)` |
| `--fs-slider-transition-function` | `var(--fs-transition-function)` |

---

### Textarea

| Variable | Default Value |
|---|---|
| `--fs-textarea-height` | `calc(var(--fs-control-tap-size) * 3)` |
| `--fs-textarea-width` | `100%` |
| `--fs-textarea-padding` | `var(--fs-spacing-1) var(--fs-spacing-2)` |
| `--fs-textarea-line-height` | `1.25` |
| `--fs-textarea-bkg-color` | `var(--fs-color-body-bkg)` |
| `--fs-textarea-border-color` | `var(--fs-border-color)` |
| `--fs-textarea-border-color-hover` | `var(--fs-border-color-active)` |
| `--fs-textarea-border-radius` | `var(--fs-border-radius)` |
| `--fs-textarea-border-width` | `var(--fs-border-width)` |
| `--fs-textarea-box-shadow` | `none` |
| `--fs-textarea-box-shadow-hover` | `0 0 0 var(--fs-border-width) var(--fs-border-color-active)` |
| `--fs-textarea-text-color` | `var(--fs-color-text)` |
| `--fs-textarea-text-size` | `var(--fs-text-size-body)` |
| `--fs-textarea-transition-timing` | `var(--fs-transition-timing)` |
| `--fs-textarea-transition-property` | `var(--fs-transition-property)` |
| `--fs-textarea-transition-function` | `var(--fs-transition-function)` |
| **Disabled** | |
| `--fs-textarea-disabled-bkg-color` | `var(--fs-color-disabled-bkg)` |
| `--fs-textarea-disabled-border-color` | `var(--fs-border-color)` |
| `--fs-textarea-disabled-border-width` | `var(--fs-border-width)` |
| `--fs-textarea-disabled-text-color` | `var(--fs-color-disabled-text)` |

---

## Molecules

### Accordion

| Variable | Default Value |
|---|---|
| `--fs-accordion-button-padding` | `var(--fs-spacing-3) 0` |
| `--fs-accordion-button-bkg-color` | `transparent` |
| `--fs-accordion-button-color` | `var(--fs-color-text)` |
| `--fs-accordion-button-font-size` | `var(--fs-text-size-3)` |
| `--fs-accordion-button-font-weight` | `var(--fs-text-weight-bold)` |
| `--fs-accordion-button-line-height` | `1.2` |
| `--fs-accordion-item-border-bottom-color` | `var(--fs-border-color-light)` |
| `--fs-accordion-item-border-bottom-width` | `var(--fs-border-width)` |
| `--fs-accordion-panel-padding-bottom` | `var(--fs-spacing-4)` |

---

### Alert

| Variable | Default Value |
|---|---|
| `--fs-alert-height` | `var(--fs-spacing-7)` |
| `--fs-alert-padding-left` | `var(--fs-spacing-3)` |
| `--fs-alert-padding-right` | `var(--fs-alert-padding-left)` |
| `--fs-alert-bkg-color` | `var(--fs-color-highlighted-bkg)` |
| `--fs-alert-text-color` | `var(--fs-color-highlighted-text)` |
| `--fs-alert-text-size` | `var(--fs-text-size-1)` |
| `--fs-alert-icon-color` | `var(--fs-alert-text-color)` |
| `--fs-alert-icon-width` | `var(--fs-spacing-4)` |
| `--fs-alert-icon-height` | `var(--fs-alert-icon-width)` |
| `--fs-alert-icon-margin-right` | `var(--fs-spacing-1)` |
| `--fs-alert-link-color` | `var(--fs-alert-text-color)` |
| `--fs-alert-link-color-visited` | `var(--fs-alert-text-color)` |
| `--fs-alert-button-bkg-color` | `var(--fs-alert-bkg-color)` |
| `--fs-alert-button-border-radius` | `var(--fs-border-radius)` |
| `--fs-alert-button-text-color` | `var(--fs-alert-text-color)` |

---

### Breadcrumb

| Variable | Default Value |
|---|---|
| `--fs-breadcrumb-padding` | `var(--fs-spacing-2) 0` |
| `--fs-breadcrumb-margin-left` | `var(--fs-spacing-0)` |
| `--fs-breadcrumb-divider-height` | `var(--fs-spacing-3)` |
| `--fs-breadcrumb-divider-margin` | `var(--fs-spacing-1)` |
| `--fs-breadcrumb-divider-border-left-color` | `var(--fs-border-color-light)` |
| `--fs-breadcrumb-divider-border-left-width` | `var(--fs-border-width)` |
| `--fs-breadcrumb-list-item-padding` | `var(--fs-spacing-0)` |
| `--fs-breadcrumb-list-item-max-width-mobile` | `30%` |
| `--fs-breadcrumb-list-item-last-text-color` | `var(--fs-color-text-light)` |
| `--fs-breadcrumb-link-home-color` | `var(--fs-color-text)` |
| `--fs-breadcrumb-link-home-padding` | `var(--fs-spacing-1)` |
| `--fs-breadcrumb-link-home-border-radius` | `var(--fs-border-radius-circle)` |
| `--fs-breadcrumb-link-home-hover-bkg-color` | `var(--fs-color-primary-bkg-light)` |
| `--fs-breadcrumb-link-color-visited` | `var(--fs-color-link)` |
| `--fs-breadcrumb-dropdown-button-color` | `var(--fs-color-link)` |
| `--fs-breadcrumb-dropdown-button-border-radius` | `var(--fs-spacing-0)` |
| `--fs-breadcrumb-dropdown-button-margin-left` | `var(--fs-breadcrumb-margin-left)` |
| `--fs-breadcrumb-dropdown-button-transition-timing` | `var(--fs-transition-timing)` |
| `--fs-breadcrumb-dropdown-button-transition-property` | `var(--fs-transition-property)` |
| `--fs-breadcrumb-dropdown-button-transition-function` | `var(--fs-transition-function)` |

---

### BuyButton

| Variable | Default Value |
|---|---|
| `--fs-buy-button-bkg-color` | `var(--fs-color-action-bkg)` |
| `--fs-buy-button-bkg-color-hover` | `var(--fs-color-action-bkg-hover)` |
| `--fs-buy-button-bkg-color-active` | `var(--fs-color-action-bkg-active)` |
| `--fs-buy-button-border-color` | `var(--fs-buy-button-bkg-color)` |
| `--fs-buy-button-border-color-hover` | `var(--fs-buy-button-bkg-color-hover)` |
| `--fs-buy-button-border-color-active` | `var(--fs-buy-button-bkg-color-active)` |
| `--fs-buy-button-text-color` | `var(--fs-color-action-text)` |
| `--fs-buy-button-text-color-hover` | `var(--fs-color-action-text)` |
| `--fs-buy-button-text-color-active` | `var(--fs-color-action-text)` |
| `--fs-buy-button-shadow-hover` | `var(--fs-button-shadow-hover)` |

---

### Card

| Variable | Default Value |
|---|---|
| `--fs-card-border-radius` | `var(--fs-border-radius)` |
| `--fs-card-border-color` | `var(--fs-border-color-light)` |
| `--fs-card-border-width` | `var(--fs-border-width)` |
| `--fs-card-body-padding` | `var(--fs-spacing-3)` |
| `--fs-card-header-bkg-color` | `var(--fs-color-neutral-bkg)` |
| `--fs-card-header-padding` | `var(--fs-spacing-3)` |
| `--fs-card-header-font-weight` | `var(--fs-text-weight-bold)` |
| `--fs-card-header-icon-color` | `var(--fs-color-main-2)` |

---

### Carousel

| Variable | Default Value |
|---|---|
| `--fs-carousel-padding-mobile` | `var(--fs-spacing-0) var(--fs-grid-padding)` |
| `--fs-carousel-padding-desktop` | `var(--fs-spacing-0) calc((100% - var(--fs-grid-max-width)) / 2) var(--fs-spacing-0)` |
| `--fs-carousel-item-margin-right` | `var(--fs-spacing-3)` |
| **Controls** | |
| `--fs-carousel-controls-width` | `3.125rem` |
| `--fs-carousel-controls-height` | `var(--fs-carousel-controls-width)` |
| `--fs-carousel-controls-bkg-color` | `var(--fs-color-neutral-0)` |
| `--fs-carousel-controls-border-radius` | `var(--fs-border-radius-circle)` |
| `--fs-carousel-controls-box-shadow` | `var(--fs-shadow-darker)` |
| `--fs-carousel-controls-icon-color` | `var(--fs-color-neutral-7)` |
| `--fs-carousel-controls-control-left` | `var(--fs-spacing-4)` |
| `--fs-carousel-controls-control-right` | `var(--fs-carousel-controls-control-left)` |
| `--fs-carousel-controls-control-max-left` | `calc(-1 * var(--fs-spacing-11))` |
| `--fs-carousel-controls-control-max-right` | `var(--fs-carousel-controls-control-max-left)` |
| **Bullets** | |
| `--fs-carousel-bullet-bkg-color` | `var(--fs-color-neutral-3)` |
| `--fs-carousel-bullet-bkg-color-selected` | `var(--fs-color-main-4)` |
| `--fs-carousel-bullet-border-radius` | `var(--fs-carousel-controls-border-radius)` |
| `--fs-carousel-bullet-width-mobile` | `100%` |
| `--fs-carousel-bullet-height-mobile` | `var(--fs-spacing-0)` |
| `--fs-carousel-bullet-width-desktop` | `var(--fs-spacing-1)` |
| `--fs-carousel-bullet-height-desktop` | `var(--fs-carousel-bullet-width-desktop)` |
| `--fs-carousel-bullets-padding-top` | `var(--fs-carousel-controls-control-left)` |
| `--fs-carousel-bullets-padding-left` | `var(--fs-grid-padding)` |
| `--fs-carousel-bullets-padding-right` | `var(--fs-carousel-bullets-padding-left)` |
| `--fs-carousel-bullets-column-gap-mobile` | `var(--fs-spacing-0)` |
| `--fs-carousel-bullets-column-gap-tablet` | `var(--fs-spacing-3)` |

---

### CartItem

| Variable | Default Value |
|---|---|
| `--fs-cart-item-padding` | `var(--fs-spacing-2)` |
| `--fs-cart-item-bkg-color` | `var(--fs-control-bkg)` |
| `--fs-cart-item-border-radius` | `var(--fs-border-radius)` |
| `--fs-cart-item-border-color` | `var(--fs-border-color-light)` |
| `--fs-cart-item-border-width` | `var(--fs-border-width)` |
| `--fs-cart-item-image-width` | `var(--fs-spacing-8)` |
| `--fs-cart-item-image-height` | `var(--fs-cart-item-image-width)` |
| `--fs-cart-item-image-border-radius` | `var(--fs-cart-item-border-radius)` |
| `--fs-cart-item-title-color` | `var(--fs-color-text)` |
| `--fs-cart-item-title-weight` | `var(--fs-text-weight-bold)` |
| `--fs-cart-item-title-line-height` | `1.2` |
| `--fs-cart-item-skus-text-color` | `var(--fs-color-text-light)` |
| `--fs-cart-item-skus-text-size` | `var(--fs-text-size-legend)` |
| `--fs-cart-item-skus-line-height` | `var(--fs-text-size-body)` |
| `--fs-cart-item-skus-margin-top` | `var(--fs-spacing-0)` |
| `--fs-cart-item-skus-row-gap` | `var(--fs-spacing-0)` |
| `--fs-cart-item-skus-column-gap` | `var(--fs-spacing-1)` |

---

### DiscountBadge

| Variable | Default Value |
|---|---|
| `--fs-discount-badge-low-bkg-color` | `var(--fs-badge-success-bkg-color)` |
| `--fs-discount-badge-low-border-color` | `var(--fs-badge-success-border-color)` |
| `--fs-discount-badge-low-text-color` | `var(--fs-badge-success-text-color)` |
| `--fs-discount-badge-medium-bkg-color` | `var(--fs-badge-warning-bkg-color)` |
| `--fs-discount-badge-medium-border-color` | `var(--fs-badge-warning-border-color)` |
| `--fs-discount-badge-medium-text-color` | `var(--fs-badge-warning-text-color)` |
| `--fs-discount-badge-high-bkg-color` | `var(--fs-badge-danger-bkg-color)` |
| `--fs-discount-badge-high-border-color` | `var(--fs-badge-danger-border-color)` |
| `--fs-discount-badge-high-text-color` | `var(--fs-badge-danger-text-color)` |

---

### Dropdown

| Variable | Default Value |
|---|---|
| **Menu** | |
| `--fs-dropdown-menu-bkg-color` | `var(--fs-color-tertiary-bkg)` |
| `--fs-dropdown-menu-border-radius` | `var(--fs-border-radius)` |
| `--fs-dropdown-menu-box-shadow` | `var(--fs-shadow-hover)` |
| **Item** | |
| `--fs-dropdown-item-bkg-color` | `var(--fs-color-tertiary-bkg-light)` |
| `--fs-dropdown-item-bkg-color-hover` | `var(--fs-color-primary-bkg-light)` |
| `--fs-dropdown-item-border-bottom-color` | `var(--fs-border-color-light)` |
| `--fs-dropdown-item-color` | `var(--fs-color-link)` |
| `--fs-dropdown-item-min-height` | `2.375rem` |
| `--fs-dropdown-item-padding` | `var(--fs-spacing-1) var(--fs-spacing-2) var(--fs-spacing-1) var(--fs-spacing-1)` |
| `--fs-dropdown-item-text-size` | `var(--fs-text-size-base)` |
| `--fs-dropdown-item-text-weight` | `var(--fs-text-weight-regular)` |
| `--fs-dropdown-item-icon-margin-right` | `var(--fs-spacing-0)` |
| `--fs-dropdown-item-icon-margin-top` | `calc(-1 * var(--fs-spacing-1))` |
| `--fs-dropdown-item-icon-min-width` | `1.125rem` |
| `--fs-dropdown-item-small-min-height` | `1.75rem` |
| `--fs-dropdown-item-small-padding` | `var(--fs-spacing-0) var(--fs-spacing-2) var(--fs-spacing-0) var(--fs-spacing-1)` |
| `--fs-dropdown-item-small-text-size` | `var(--fs-text-size-1)` |

---

### Gift

| Variable | Default Value |
|---|---|
| `--fs-gift-height` | `var(--fs-spacing-12)` |
| `--fs-gift-bkg-color` | `var(--fs-control-bkg)` |
| `--fs-gift-border-radius` | `var(--fs-border-radius)` |
| `--fs-gift-border-color` | `var(--fs-border-color-light)` |
| `--fs-gift-border-width` | `var(--fs-border-width)` |
| `--fs-gift-content-padding` | `var(--fs-spacing-1) var(--fs-spacing-2)` |
| `--fs-gift-content-row-gap` | `var(--fs-spacing-0)` |
| `--fs-gift-icon-bkg-color` | `var(--fs-color-body-bkg)` |
| `--fs-gift-icon-color` | `var(--fs-gift-title-color)` |
| `--fs-gift-icon-size` | `1.5rem` |
| `--fs-gift-icon-padding` | `var(--fs-spacing-0)` |
| `--fs-gift-title-color` | `var(--fs-color-text)` |
| `--fs-gift-title-size` | `var(--fs-text-size-body)` |
| `--fs-gift-title-line-height` | `1.25` |
| `--fs-gift-price-size` | `var(--fs-text-size-legend)` |

---

### InputField

| Variable | Default Value |
|---|---|
| `--fs-input-field-color` | `var(--fs-color-text)` |
| `--fs-input-field-size` | `var(--fs-text-size-body)` |
| `--fs-input-field-padding` | `var(--fs-spacing-2) var(--fs-spacing-2) 0` |
| `--fs-input-field-border-color` | `var(--fs-border-color)` |
| `--fs-input-field-button-height` | `var(--fs-control-tap-size)` |
| `--fs-input-field-label-color` | `var(--fs-color-text-light)` |
| `--fs-input-field-label-size` | `var(--fs-text-size-tiny)` |
| `--fs-input-field-label-padding` | `0 var(--fs-spacing-2)` |
| `--fs-input-field-transition-timing` | `var(--fs-transition-timing)` |
| `--fs-input-field-transition-property` | `var(--fs-transition-property)` |
| `--fs-input-field-transition-function` | `var(--fs-transition-function)` |
| **Disabled** | |
| `--fs-input-field-disabled-bkg-color` | `var(--fs-color-disabled-bkg)` |
| `--fs-input-field-disabled-border-color` | `var(--fs-border-color)` |
| `--fs-input-field-disabled-border-width` | `var(--fs-border-width)` |
| `--fs-input-field-disabled-text-color` | `var(--fs-color-disabled-text)` |
| **Error** | |
| `--fs-input-field-error-border-color` | `var(--fs-color-danger-border)` |
| `--fs-input-field-error-box-shadow` | `0 0 0 var(--fs-border-width) var(--fs-input-field-error-border-color)` |
| `--fs-input-field-error-focus-ring` | `var(--fs-color-focus-ring-danger)` |
| `--fs-input-field-error-message-color` | `var(--fs-color-danger-text)` |
| `--fs-input-field-error-message-size` | `var(--fs-text-size-legend)` |
| `--fs-input-field-error-message-line-height` | `1.1` |
| `--fs-input-field-error-message-margin-top` | `var(--fs-spacing-0)` |

---

### Modal

| Variable | Default Value |
|---|---|
| `--fs-modal-background-color` | `var(--fs-color-body-bkg)` |
| `--fs-modal-border-radius` | `var(--fs-border-radius)` |
| `--fs-modal-margin` | `auto` |
| `--fs-modal-min-height` | `var(--fs-spacing-5)` |
| `--fs-modal-max-width` | `calc(var(--fs-grid-breakpoint-desktop) / 3)` |
| `--fs-modal-width-tablet` | `calc(100vw / 3)` |
| `--fs-modal-min-width-tablet` | `calc(var(--fs-grid-breakpoint-desktop) / 3)` |
| `--fs-modal-position-top` | `30vh` |
| `--fs-modal-position-left` | `var(--fs-spacing-4)` |
| `--fs-modal-position-right` | `var(--fs-spacing-4)` |
| `--fs-modal-transition-timing` | `var(--fs-transition-timing)` |
| `--fs-modal-transition-property` | `transform` |
| `--fs-modal-transition-in-function` | `ease-in` |
| `--fs-modal-transition-out-function` | `ease-in` |
| **Header** | |
| `--fs-modal-header-padding` | `var(--fs-spacing-4) var(--fs-spacing-7) var(--fs-spacing-4) var(--fs-spacing-4)` |
| `--fs-modal-header-title-size` | `var(--fs-text-size-lead)` |
| `--fs-modal-header-title-weight` | `var(--fs-text-weight-bold)` |
| `--fs-modal-header-title-line-height` | `1.2` |
| `--fs-modal-header-title-margin-bottom` | `.625rem` |
| `--fs-modal-header-description-color` | `var(--fs-color-text-light)` |
| `--fs-modal-header-description-size` | `var(--fs-text-size-body)` |
| `--fs-modal-header-description-line-height` | `1.5` |
| `--fs-modal-header-close-button-position-top` | `0` |
| `--fs-modal-header-close-button-position-right` | `0` |
| **Body** | |
| `--fs-modal-body-padding` | `var(--fs-spacing-1) var(--fs-spacing-4) var(--fs-spacing-5)` |
| **Footer** | |
| `--fs-modal-footer-padding` | `var(--fs-spacing-3) 0 var(--fs-spacing-3)` |
| `--fs-modal-footer-box-shadow` | `0 -1px 15px 0 rgb(0 0 0 / 10.2%)` |
| `--fs-modal-footer-actions-gap` | `var(--fs-spacing-3)` |
| `--fs-modal-footer-actions-padding` | `var(--fs-spacing-1) var(--fs-spacing-4)` |

---

### NavbarLinks

| Variable | Default Value |
|---|---|
| `--fs-navbar-links-bkg-color` | `var(--fs-color-body-bkg)` |
| `--fs-navbar-links-border-top-color-mobile` | `var(--fs-border-color-light)` |
| `--fs-navbar-links-border-top-width-mobile` | `var(--fs-border-width)` |
| `--fs-navbar-links-border-bottom-color-mobile` | `var(--fs-navbar-links-border-top-color-mobile)` |
| `--fs-navbar-links-border-bottom-width-mobile` | `var(--fs-navbar-links-border-top-width-mobile)` |
| `--fs-navbar-links-link-padding-notebook` | `0 var(--fs-spacing-0)` |
| `--fs-navbar-links-link-width-notebook` | `auto` |
| `--fs-navbar-links-list-margin-left-notebook` | `var(--fs-spacing-2)` |
| `--fs-navbar-links-list-padding-left-notebook` | `var(--fs-spacing-3)` |
| `--fs-navbar-links-list-border-left-color-notebook` | `var(--fs-border-color-light)` |
| `--fs-navbar-links-list-border-left-width-notebook` | `var(--fs-border-width)` |
| `--fs-navbar-links-transition-timing` | `var(--fs-transition-timing)` |
| `--fs-navbar-links-transition-property` | `var(--fs-transition-property)` |
| `--fs-navbar-links-transition-function` | `var(--fs-transition-function)` |

---

### OrderSummary

| Variable | Default Value |
|---|---|
| `--fs-order-summary-padding` | `var(--fs-spacing-3)` |
| `--fs-order-summary-margin-bottom` | `var(--fs-spacing-2)` |
| `--fs-order-summary-row-gap` | `0` |
| `--fs-order-summary-discount-text-color` | `var(--fs-color-success-text)` |
| `--fs-order-summary-taxes-label-color` | `var(--fs-color-info-text)` |
| `--fs-order-summary-taxes-text-size` | `var(--fs-text-size-tiny)` |
| `--fs-order-summary-taxes-text-weight` | `var(--fs-text-weight-regular)` |
| `--fs-order-summary-total-text-size` | `var(--fs-text-size-3)` |
| `--fs-order-summary-total-text-font-weight` | `var(--fs-text-weight-bold)` |

---

### PickupPointCard

| Variable | Default Value |
|---|---|
| `--fs-pickup-point-card-height` | `140px` |
| `--fs-pickup-point-card-padding` | `var(--fs-spacing-3)` |
| `--fs-pickup-point-card-border-radius` | `var(--fs-border-radius)` |
| `--fs-pickup-point-card-border-color` | `var(--fs-border-color-light)` |
| `--fs-pickup-point-card-border-width` | `var(--fs-border-width)` |
| `--fs-pickup-point-card-row-gap` | `var(--fs-grid-gap-2)` |
| `--fs-pickup-point-card-header-title-font-weight` | `var(--fs-text-weight-medium)` |
| `--fs-pickup-point-card-header-icon-color` | `var(--fs-border-color-disabled)` |
| `--fs-pickup-point-card-distance-color` | `var(--fs-color-text-light)` |
| `--fs-pickup-point-card-distance-font-size` | `var(--fs-text-size-legend)` |

---

### Popover

| Variable | Default Value |
|---|---|
| `--fs-popover-margin` | `0 var(--fs-spacing-3)` |
| `--fs-popover-padding` | `var(--fs-spacing-3) var(--fs-spacing-4) var(--fs-spacing-4)` |
| `--fs-popover-padding-inline` | `var(--fs-spacing-4)` |
| `--fs-popover-border-radius` | `var(--fs-border-radius)` |
| `--fs-popover-bkg-color` | `var(--fs-color-body-bkg)` |
| `--fs-popover-box-shadow` | `var(--fs-shadow-darker)` |
| `--fs-popover-z-index` | `var(--fs-z-index-top)` |
| `--fs-popover-indicator-size` | `var(--fs-spacing-1)` |
| `--fs-popover-indicator-distance-base` | `var(--fs-spacing-1)` |
| `--fs-popover-indicator-distance-edge` | `var(--fs-spacing-3)` |
| `--fs-popover-indicator-translate` | `calc(--fs-popover-indicator-size + --fs-popover-indicator-distance-base)` |

---

### ProductCard

| Variable | Default Value |
|---|---|
| `--fs-product-card-min-width` | `10rem` |
| `--fs-product-card-padding` | `var(--fs-spacing-1) var(--fs-spacing-1) var(--fs-spacing-2) var(--fs-spacing-1)` |
| `--fs-product-card-gap` | `var(--fs-spacing-2)` |
| `--fs-product-card-bkg-color` | `var(--fs-color-body-bkg)` |
| `--fs-product-card-bkg-color-hover` | `var(--fs-product-card-bkg-color)` |
| `--fs-product-card-bkg-color-focus` | `var(--fs-product-card-bkg-color-hover)` |
| `--fs-product-card-border-radius` | `var(--fs-border-radius)` |
| `--fs-product-card-border-color` | `var(--fs-border-color-light)` |
| `--fs-product-card-border-color-hover` | `var(--fs-border-color-hover)` |
| `--fs-product-card-border-width` | `var(--fs-border-width)` |
| `--fs-product-card-shadow` | `var(--fs-shadow)` |
| `--fs-product-card-shadow-hover` | `var(--fs-shadow-hover)` |
| `--fs-product-card-img-radius` | `var(--fs-product-card-border-radius)` |
| `--fs-product-card-img-scale-hover` | `1` |
| `--fs-product-card-title-color` | `var(--fs-color-text)` |
| `--fs-product-card-title-size` | `var(--fs-text-size-base)` |
| `--fs-product-card-title-weight` | `var(--fs-text-weight-regular)` |
| `--fs-product-card-title-max-lines` | `var(--fs-text-max-lines)` |
| `--fs-product-card-price-color` | `var(--fs-color-text)` |
| `--fs-product-card-price-size` | `var(--fs-text-size-base)` |
| `--fs-product-card-sponsored-label-color` | `var(--fs-color-text-light)` |
| `--fs-product-card-sponsored-label-size` | `var(--fs-text-size-tiny)` |
| `--fs-product-card-taxes-label-color` | `var(--fs-color-info-text)` |
| `--fs-product-card-taxes-text-size` | `var(--fs-text-size-tiny)` |
| `--fs-product-card-taxes-text-weight` | `var(--fs-text-weight-regular)` |
| `--fs-product-card-transition-timing` | `var(--fs-transition-timing)` |
| `--fs-product-card-transition-property` | `var(--fs-transition-property)` |
| `--fs-product-card-transition-function` | `var(--fs-transition-function)` |
| **Wide variant** | |
| `--fs-product-card-wide-min-width` | `9rem` |
| `--fs-product-card-wide-padding` | `0` |
| `--fs-product-card-wide-bkg-color` | `var(--fs-color-neutral-bkg)` |
| `--fs-product-card-wide-content-padding` | `var(--fs-spacing-2)` |
| **Out of stock** | |
| `--fs-product-card-out-of-stock-bkg-color` | `transparent` |
| `--fs-product-card-out-of-stock-border-color` | `var(--fs-color-neutral-1)` |
| `--fs-product-card-out-of-stock-img-opacity` | `.5` |
| **Delivery Promise** | |
| `--fs-product-card-delivery-promise-badge-text-size` | `var(--fs-text-size-tiny)` |
| `--fs-product-card-delivery-promise-badge-status-width` | `var(--fs-spacing-1)` |
| `--fs-product-card-delivery-promise-badge-status-border-radius` | `var(--fs-border-radius-circle)` |
| `--fs-product-card-delivery-promise-badge-status-available` | `var(--fs-color-success-2)` |
| `--fs-product-card-delivery-promise-badge-status-unavailable` | `var(--fs-color-neutral-bkg)` |

---

### ProductCardSkeleton

| Variable | Default Value |
|---|---|
| `--fs-product-card-skeleton-border-radius` | `var(--fs-border-radius)` |
| `--fs-product-card-skeleton-bordered` | `var(--fs-border-width) solid var(--fs-border-color-light)` |
| `--fs-product-card-skeleton-gap` | `var(--fs-spacing-1)` |
| `--fs-product-card-skeleton-padding` | `var(--fs-spacing-1) var(--fs-spacing-1) var(--fs-spacing-2)` |
| `--fs-product-card-skeleton-sectioned-min-width` | `10rem` |

---

### ProductPrice

| Variable | Default Value |
|---|---|
| `--fs-product-price-gap` | `var(--fs-spacing-1)` |

---

### ProductTile

| Variable | Default Value |
|---|---|
| `--fs-product-tile-skeleton-gap` | `var(--fs-spacing-1)` |
| `--fs-product-tile-skeleton-content-padding` | `var(--fs-spacing-3)` |
| `--fs-product-tile-skeleton-wide-bkg-color` | `var(--fs-color-neutral-bkg)` |
| `--fs-product-tile-skeleton-wide-padding` | `var(--fs-spacing-2) var(--fs-spacing-3) var(--fs-spacing-3)` |

---

### ProductTitle

| Variable | Default Value |
|---|---|
| `--fs-product-title-text-size` | `var(--fs-text-size-title-product)` |
| `--fs-product-title-text-weight` | `var(--fs-text-weight-regular)` |
| `--fs-product-title-line-height` | `1.12` |
| `--fs-product-title-column-gap` | `var(--fs-spacing-2)` |
| `--fs-product-title-row-gap` | `var(--fs-spacing-3)` |
| `--fs-product-title-addendum-color` | `var(--fs-color-text-light)` |
| `--fs-product-title-addendum-size` | `var(--fs-text-size-1)` |
| `--fs-product-title-addendum-line-height` | `1.7` |

---

### QuantitySelector

| Variable | Default Value |
|---|---|
| `--fs-qty-selector-width` | `calc(var(--fs-control-tap-size) * 2.7)` |
| `--fs-qty-selector-height` | `calc(var(--fs-control-tap-size) + (var(--fs-qty-selector-border-width) * 2))` |
| `--fs-qty-selector-border-radius` | `var(--fs-border-radius)` |
| `--fs-qty-selector-border-color` | `var(--fs-border-color)` |
| `--fs-qty-selector-border-color-hover` | `var(--fs-border-color-active)` |
| `--fs-qty-selector-border-width` | `var(--fs-border-width)` |
| `--fs-qty-selector-border-width-hover` | `var(--fs-border-width)` |
| `--fs-qty-selector-bkg-color` | `var(--fs-color-body-bkg)` |
| `--fs-qty-selector-bkg-color-hover` | `var(--fs-qty-selector-bkg-color)` |
| `--fs-qty-selector-button-bkg-color` | `transparent` |
| `--fs-qty-selector-button-border-radius` | `var(--fs-qty-selector-border-radius)` |
| `--fs-qty-selector-text-color` | `var(--fs-color-text)` |
| `--fs-qty-selector-text-size` | `var(--fs-text-size-base)` |
| `--fs-qty-selector-shadow` | `none` |
| `--fs-qty-selector-shadow-hover` | `0 0 0 var(--fs-border-width) var(--fs-border-color-active)` |
| `--fs-qty-selector-disabled-bkg-color` | `var(--fs-color-disabled-bkg)` |
| `--fs-qty-selector-disabled-border-color` | `var(--fs-qty-selector-disabled-bkg-color)` |
| `--fs-qty-selector-disabled-text-color` | `var(--fs-color-disabled-text)` |

---

### Rating

| Variable | Default Value |
|---|---|
| `--fs-rating-color` | `var(--fs-color-main-2)` |
| `--fs-rating-color-empty` | `var(--fs-color-neutral-4)` |
| `--fs-rating-gap` | `var(--fs-spacing-0)` |
| `--fs-rating-icon-width` | `var(--fs-spacing-3)` |
| `--fs-rating-icon-height` | `var(--fs-rating-icon-width)` |
| `--fs-rating-button-min-height` | `var(--fs-spacing-5)` |
| **Actionable** | |
| `--fs-rating-actionable-gap` | `0` |
| `--fs-rating-actionable-icon-color` | `var(--fs-rating-color-empty)` |
| `--fs-rating-actionable-icon-color-selected` | `var(--fs-rating-color)` |
| `--fs-rating-actionable-icon-width` | `var(--fs-rating-icon-width)` |
| `--fs-rating-actionable-icon-height` | `var(--fs-rating-actionable-icon-width)` |
| **Field** | |
| `--fs-rating-field-label-color` | `var(--fs-color-text-light)` |
| `--fs-rating-field-label-size` | `var(--fs-text-size-2)` |
| `--fs-rating-field-label-line-height` | `var(--fs-text-size-4)` |
| `--fs-rating-field-error-message-color` | `var(--fs-color-danger-text)` |
| `--fs-rating-field-error-message-size` | `var(--fs-text-size-legend)` |
| `--fs-rating-field-error-message-line-height` | `1.1` |

---

### RegionBar

| Variable | Default Value |
|---|---|
| `--fs-region-bar-width` | `100%` |
| `--fs-region-bar-padding` | `var(--fs-spacing-0) 0 var(--fs-spacing-0) var(--fs-spacing-2)` |
| `--fs-region-bar-padding-inline-start` | `var(--fs-spacing-2)` |
| `--fs-region-bar-bkg-color` | `var(--fs-color-body-bkg)` |
| `--fs-region-bar-border-bottom-color` | `var(--fs-border-color-light)` |
| `--fs-region-bar-border-bottom-width` | `var(--fs-border-width)` |
| `--fs-region-bar-text-color` | `var(--fs-color-text-display)` |
| `--fs-region-bar-location-height` | `var(--fs-spacing-4)` |
| `--fs-region-bar-icon-margin-right` | `var(--fs-spacing-1)` |
| `--fs-region-bar-message-margin-right` | `auto` |
| `--fs-region-bar-postal-code-margin-right` | `auto` |
| `--fs-region-bar-cta-margin-left` | `auto` |
| `--fs-region-bar-cta-text-decoration` | `underline` |

---

### Search Components

**SearchAutoComplete**

| Variable | Default Value |
|---|---|
| `--fs-search-auto-complete-padding-top` | `var(--fs-spacing-2)` |
| `--fs-search-auto-complete-padding-bottom` | `var(--fs-search-auto-complete-padding-top)` |
| `--fs-search-auto-complete-padding-right` | `var(--fs-spacing-3)` |
| `--fs-search-auto-complete-padding-left` | `var(--fs-search-auto-complete-padding-right)` |
| `--fs-search-auto-complete-item-column-gap` | `var(--fs-spacing-1)` |
| `--fs-search-auto-complete-item-line-height` | `1.25` |
| `--fs-search-auto-complete-item-text-size` | `var(--fs-text-size-2)` |
| `--fs-search-auto-complete-item-bkg-color-hover` | `var(--fs-color-tertiary-bkg-hover)` |
| `--fs-search-auto-complete-item-icon-color` | `var(--fs-color-neutral-4)` |
| `--fs-search-auto-complete-item-icon-size` | `1.125rem` |
| `--fs-search-auto-complete-transition-timing` | `var(--fs-transition-timing)` |
| `--fs-search-auto-complete-transition-property` | `var(--fs-transition-property)` |
| `--fs-search-auto-complete-transition-function` | `var(--fs-transition-function)` |

**SearchDropdown**

| Variable | Default Value |
|---|---|
| `--fs-search-dropdown-bkg-color` | `var(--fs-color-neutral-0)` |
| `--fs-search-dropdown-border-radius` | `0 0 var(--fs-border-radius) var(--fs-border-radius)` |
| `--fs-search-dropdown-border-color` | `var(--fs-border-color)` |
| `--fs-search-dropdown-border-width` | `var(--fs-border-width)` |
| `--fs-search-dropdown-box-shadow` | `var(--fs-shadow)` |
| `--fs-search-dropdown-section-border-color` | `var(--fs-border-color-light)` |
| `--fs-search-dropdown-width-mobile` | `100vw` |
| `--fs-search-dropdown-width-desktop` | `100%` |
| `--fs-search-dropdown-position-top-mobile` | `calc(var(--fs-search-dropdown-position-top-tablet) + 1px)` |
| `--fs-search-dropdown-position-top-tablet` | `calc(var(--fs-control-tap-size) + var(--fs-border-width))` |
| `--fs-search-dropdown-position-top-desktop` | `var(--fs-search-input-height-desktop)` |
| `--fs-search-dropdown-position-left-mobile` | `calc(-1 * var(--fs-control-tap-size))` |
| `--fs-search-dropdown-position-left-tablet` | `calc(var(--fs-search-dropdown-position-left-mobile) - var(--fs-spacing-1))` |

**SearchHistory**

| Variable | Default Value |
|---|---|
| `--fs-search-history-padding-top` | `var(--fs-spacing-2)` |
| `--fs-search-history-padding-bottom` | `var(--fs-search-history-padding-top)` |
| `--fs-search-history-padding-right` | `var(--fs-spacing-3)` |
| `--fs-search-history-padding-left` | `var(--fs-search-history-padding-right)` |
| `--fs-search-history-title-size` | `var(--fs-text-size-lead)` |
| `--fs-search-history-title-line-height` | `1.5` |
| `--fs-search-history-item-text-size` | `var(--fs-text-size-2)` |
| `--fs-search-history-item-line-height` | `1.25` |
| `--fs-search-history-item-column-gap` | `var(--fs-spacing-1)` |
| `--fs-search-history-item-bkg-color-hover` | `var(--fs-color-tertiary-bkg-hover)` |
| `--fs-search-history-item-icon-color` | `var(--fs-color-neutral-4)` |
| `--fs-search-history-item-icon-size` | `1.125rem` |
| `--fs-search-history-transition-timing` | `var(--fs-transition-timing)` |
| `--fs-search-history-transition-property` | `var(--fs-transition-property)` |
| `--fs-search-history-transition-function` | `var(--fs-transition-function)` |

**SearchInputField**

| Variable | Default Value |
|---|---|
| `--fs-search-input-field-height-mobile` | `var(--fs-control-tap-size)` |
| `--fs-search-input-field-height-desktop` | `var(--fs-spacing-6)` |
| `--fs-search-input-field-input-bkg-color` | `var(--fs-color-body-bkg)` |
| `--fs-search-input-field-input-padding-right` | `var(--fs-spacing-7)` |
| `--fs-search-input-field-button-min-height` | `var(--fs-search-input-field-height-desktop)` |
| `--fs-search-input-field-button-padding-top-desktop` | `var(--fs-spacing-0)` |
| `--fs-search-input-field-button-padding-bottom-desktop` | `var(--fs-search-input-field-button-padding-top-desktop)` |
| `--fs-search-input-field-transition-timing` | `var(--fs-transition-timing)` |
| `--fs-search-input-field-transition-function` | `ease` |

**SearchProducts**

| Variable | Default Value |
|---|---|
| `--fs-search-products-padding-top` | `var(--fs-spacing-2)` |
| `--fs-search-products-padding-bottom` | `var(--fs-search-products-padding-top)` |
| `--fs-search-products-padding-right` | `var(--fs-spacing-3)` |
| `--fs-search-products-padding-left` | `var(--fs-search-products-padding-right)` |
| `--fs-search-products-title-size` | `var(--fs-text-size-lead)` |
| `--fs-search-products-title-line-height` | `1.5` |
| `--fs-search-product-item-padding-top` | `var(--fs-spacing-1)` |
| `--fs-search-product-item-padding-bottom` | `var(--fs-search-product-item-padding-top)` |
| `--fs-search-product-item-image-size` | `3.5rem` |
| `--fs-search-product-item-image-border-radius` | `var(--fs-border-radius)` |
| `--fs-search-product-item-image-margin-right` | `var(--fs-spacing-3)` |
| `--fs-search-product-item-title-color` | `var(--fs-color-text)` |
| `--fs-search-product-item-title-size` | `var(--fs-text-size-2)` |
| `--fs-search-product-item-title-line-height` | `1.2` |
| `--fs-search-product-item-title-margin-bottom` | `var(--fs-spacing-0)` |
| `--fs-search-product-item-price-size` | `var(--fs-text-size-base)` |
| `--fs-search-product-item-bkg-color-hover` | `var(--fs-color-tertiary-bkg-hover)` |
| `--fs-search-product-item-control-input-width` | `4.625rem` |
| `--fs-search-product-item-control-actions-gap` | `var(--fs-spacing-1)` |

**SearchTop**

| Variable | Default Value |
|---|---|
| `--fs-search-top-padding-top` | `var(--fs-spacing-2)` |
| `--fs-search-top-padding-bottom` | `var(--fs-search-top-padding-top)` |
| `--fs-search-top-padding-right` | `var(--fs-spacing-3)` |
| `--fs-search-top-padding-left` | `var(--fs-search-top-padding-right)` |
| `--fs-search-top-title-size` | `var(--fs-text-size-lead)` |
| `--fs-search-top-title-line-height` | `1.5` |
| `--fs-search-top-title-padding-top` | `var(--fs-spacing-1)` |
| `--fs-search-top-title-padding-bottom` | `var(--fs-search-top-title-padding-top)` |
| `--fs-search-top-item-text-size` | `var(--fs-text-size-2)` |
| `--fs-search-top-item-line-height` | `1.25` |
| `--fs-search-top-item-column-gap` | `var(--fs-spacing-1)` |
| `--fs-search-top-item-bkg-color-hover` | `var(--fs-color-tertiary-bkg-hover)` |
| `--fs-search-top-transition-timing` | `var(--fs-transition-timing)` |
| `--fs-search-top-transition-property` | `var(--fs-transition-property)` |
| `--fs-search-top-transition-function` | `var(--fs-transition-function)` |

---

### SkuSelector

| Variable | Default Value |
|---|---|
| `--fs-sku-selector-text-size` | `var(--fs-text-size-1)` |
| `--fs-sku-selector-row-gap` | `var(--fs-spacing-2)` |
| `--fs-sku-selector-column-gap` | `var(--fs-sku-selector-row-gap)` |
| `--fs-sku-selector-image-width` | `var(--fs-spacing-6)` |
| `--fs-sku-selector-image-height` | `var(--fs-sku-selector-image-width)` |
| `--fs-sku-selector-image-border-radius` | `var(--fs-border-radius-small)` |
| `--fs-sku-selector-color-width` | `var(--fs-sku-selector-image-width)` |
| `--fs-sku-selector-color-height` | `var(--fs-sku-selector-color-width)` |
| `--fs-sku-selector-color-border-radius` | `var(--fs-sku-selector-image-border-radius)` |
| **Option** | |
| `--fs-sku-selector-option-width` | `var(--fs-spacing-7)` |
| `--fs-sku-selector-option-height` | `var(--fs-sku-selector-option-width)` |
| `--fs-sku-selector-option-border-radius` | `var(--fs-border-radius)` |
| `--fs-sku-selector-option-border-color` | `var(--fs-color-neutral-7)` |
| `--fs-sku-selector-option-border-color-hover` | `var(--fs-border-color-active)` |
| `--fs-sku-selector-option-border-width` | `var(--fs-border-width-thick)` |
| `--fs-sku-selector-option-bkg-color-hover` | `var(--fs-color-primary-bkg-light)` |
| `--fs-sku-selector-option-transition-timing` | `var(--fs-transition-timing)` |
| `--fs-sku-selector-option-transition-function` | `ease` |
| **Checked** | |
| `--fs-sku-selector-option-checked-bkg-color` | `var(--fs-sku-selector-option-bkg-color-hover)` |
| `--fs-sku-selector-option-checked-border-color` | `var(--fs-sku-selector-option-border-color-hover)` |
| `--fs-sku-selector-option-checked-border-width` | `var(--fs-sku-selector-option-border-width)` |
| `--fs-sku-selector-option-checked-box-shadow` | `0 0 0 var(--fs-border-width-thickest) var(--fs-color-focus-ring-outline)` |
| **Disabled** | |
| `--fs-sku-selector-option-disabled-bkg-color` | `var(--fs-sku-selector-option-disabled-border-color)` |
| `--fs-sku-selector-option-disabled-border-color` | `var(--fs-border-color-disabled)` |
| `--fs-sku-selector-option-disabled-color` | `var(--fs-color-disabled-text)` |
| `--fs-sku-selector-option-disabled-width` | `var(--fs-border-width)` |

---

### Table

| Variable | Default Value |
|---|---|
| `--fs-table-cell-padding-x` | `var(--fs-spacing-3)` |
| `--fs-table-cell-padding-y` | `var(--fs-spacing-1)` |
| `--fs-table-head-bkg-color` | `none` |
| `--fs-table-head-weight` | `var(--fs-text-weight-bold)` |
| `--fs-table-head-padding-y` | `var(--fs-spacing-2)` |
| `--fs-table-footer-bkg-color` | `none` |
| `--fs-table-footer-weight` | `var(--fs-table-head-weight)` |
| `--fs-table-colored-bkg-color` | `var(--fs-color-neutral-1)` |
| `--fs-table-colored-border-radius` | `var(--fs-border-radius)` |
| `--fs-table-bordered-border-color` | `var(--fs-border-color-light)` |
| `--fs-table-bordered-border-width` | `var(--fs-border-width)` |

---

### Tag

| Variable | Default Value |
|---|---|
| `--fs-tag-text-color` | `var(--fs-color-text)` |
| `--fs-tag-icon-size` | `var(--fs-spacing-4)` |
| `--fs-tag-icon-stroke-width` | `var(--fs-spacing-4)` |

---

### TextareaField

| Variable | Default Value |
|---|---|
| `--fs-textarea-field-color` | `var(--fs-color-text)` |
| `--fs-textarea-field-size` | `var(--fs-text-size-body)` |
| `--fs-textarea-field-padding` | `22px var(--fs-spacing-2) 0` |
| `--fs-textarea-field-border-color` | `var(--fs-border-color)` |
| `--fs-textarea-field-button-height` | `var(--fs-control-tap-size)` |
| `--fs-textarea-field-label-color` | `var(--fs-color-text-light)` |
| `--fs-textarea-field-label-size` | `var(--fs-text-size-tiny)` |
| `--fs-textarea-field-label-padding` | `0 var(--fs-spacing-2) var(--fs-spacing-0) 0` |
| `--fs-textarea-field-label-left` | `var(--fs-spacing-2)` |
| `--fs-textarea-field-label-max-width` | `var(--fs-textarea-width)` |
| `--fs-textarea-field-label-placeholder-top-padding` | `var(--fs-spacing-2)` |
| `--fs-textarea-field-label-max-height` | `calc(var(--fs-textarea-height) - var(--fs-textarea-field-label-placeholder-top-padding))` |
| `--fs-textarea-field-label-background-color` | `var(--fs-color-neutral-0)` |
| `--fs-textarea-field-transition-timing` | `var(--fs-transition-timing)` |
| `--fs-textarea-field-transition-property` | `var(--fs-transition-property)` |
| `--fs-textarea-field-transition-function` | `var(--fs-transition-function)` |
| **Disabled** | |
| `--fs-textarea-field-disabled-bkg-color` | `var(--fs-color-disabled-bkg)` |
| `--fs-textarea-field-disabled-border-color` | `var(--fs-border-color)` |
| `--fs-textarea-field-disabled-border-width` | `var(--fs-border-width)` |
| `--fs-textarea-field-disabled-text-color` | `var(--fs-color-disabled-text)` |
| **Error** | |
| `--fs-textarea-field-error-border-color` | `var(--fs-color-danger-border)` |
| `--fs-textarea-field-error-focus-ring` | `var(--fs-color-focus-ring-danger)` |
| `--fs-textarea-field-error-message-color` | `var(--fs-color-danger-text)` |
| `--fs-textarea-field-error-message-size` | `var(--fs-text-size-legend)` |
| `--fs-textarea-field-error-message-line-height` | `1.1` |
| `--fs-textarea-field-error-message-margin-top` | `var(--fs-spacing-0)` |

---

### Toast

| Variable | Default Value |
|---|---|
| `--fs-toast-width` | `calc(100% - (2 * var(--fs-spacing-3)))` |
| `--fs-toast-min-height` | `var(--fs-spacing-9)` |
| `--fs-toast-margin` | `var(--fs-spacing-3) var(--fs-spacing-3) 0 var(--fs-spacing-3)` |
| `--fs-toast-padding` | `var(--fs-spacing-1) var(--fs-spacing-3) var(--fs-spacing-1) var(--fs-spacing-1)` |
| `--fs-toast-bkg-color` | `var(--fs-color-neutral-0)` |
| `--fs-toast-border-radius` | `var(--fs-border-radius-medium)` |
| `--fs-toast-border-color` | `transparent` |
| `--fs-toast-border-width` | `var(--fs-border-width)` |
| `--fs-toast-shadow` | `0 1px 3px rgb(0 0 0 / 10%)` |
| `--fs-toast-top-mobile` | `3.125rem` |
| `--fs-toast-top-tablet` | `6.25rem` |
| `--fs-toast-title-size` | `var(--fs-text-size-body)` |
| `--fs-toast-title-weight` | `var(--fs-text-weight-bold)` |
| `--fs-toast-title-line-height` | `1.2` |
| `--fs-toast-title-margin-left` | `var(--fs-spacing-3)` |
| `--fs-toast-message-size` | `var(--fs-toast-title-size)` |
| `--fs-toast-message-line-height` | `var(--fs-toast-title-line-height)` |
| `--fs-toast-message-margin-left` | `var(--fs-spacing-3)` |
| `--fs-toast-transition-timing` | `var(--fs-transition-timing)` |
| `--fs-toast-transition-property` | `var(--fs-transition-property)` |
| `--fs-toast-transition-function` | `var(--fs-transition-function)` |
| **Icon container** | |
| `--fs-toast-icon-container-min-width` | `var(--fs-spacing-7)` |
| `--fs-toast-icon-container-height` | `var(--fs-toast-icon-container-min-width)` |
| `--fs-toast-icon-container-bkg-color` | `var(--fs-color-primary-bkg-light)` |
| `--fs-toast-icon-container-border-radius` | `var(--fs-border-radius)` |

---

### Toggle

| Variable | Default Value |
|---|---|
| `--fs-toggle-height` | `calc(var(--fs-control-min-height) / 1.75)` |
| `--fs-toggle-border-radius` | `var(--fs-border-radius)` |
| `--fs-toggle-border-color` | `var(--fs-border-color)` |
| `--fs-toggle-border-color-hover` | `var(--fs-border-color-hover)` |
| `--fs-toggle-border-width` | `var(--fs-border-width)` |
| `--fs-toggle-bkg-color` | `var(--fs-control-bkg)` |
| `--fs-toggle-bkg-color-hover` | `var(--fs-color-primary-bkg-light)` |
| `--fs-toggle-shadow` | `var(--fs-shadow)` |
| `--fs-toggle-shadow-hover` | `var(--fs-shadow)` |
| `--fs-toggle-transition-timing` | `var(--fs-transition-timing)` |
| `--fs-toggle-transition-property` | `var(--fs-transition-property)` |
| `--fs-toggle-transition-function` | `var(--fs-transition-function)` |
| **Checked** | |
| `--fs-toggle-checked-bkg-color` | `var(--fs-color-primary-bkg-active)` |
| `--fs-toggle-checked-bkg-color-hover` | `var(--fs-color-primary-bkg-hover)` |
| `--fs-toggle-checked-border-color` | `var(--fs-toggle-checked-bkg-color)` |
| `--fs-toggle-checked-border-color-hover` | `var(--fs-toggle-checked-bkg-color-hover)` |
| **Disabled** | |
| `--fs-toggle-disabled-bkg-color` | `var(--fs-color-disabled-bkg)` |
| `--fs-toggle-disabled-border-color` | `var(--fs-border-color-disabled)` |
| **Knob** | |
| `--fs-toggle-knob-bkg-color` | `var(--fs-color-primary-bkg)` |
| `--fs-toggle-knob-bkg-color-hover` | `var(--fs-toggle-border-color-hover)` |
| `--fs-toggle-knob-border-color` | `var(--fs-toggle-knob-bkg-color)` |
| `--fs-toggle-knob-border-color-hover` | `var(--fs-toggle-knob-bkg-color-hover)` |
| `--fs-toggle-knob-border-radius` | `var(--fs-border-radius-small)` |
| `--fs-toggle-knob-border-width` | `var(--fs-border-width-thick)` |
| `--fs-toggle-knob-shadow` | `var(--fs-shadow)` |
| `--fs-toggle-knob-icon-color` | `transparent` |
| `--fs-toggle-knob-icon-checked-color` | `var(--fs-toggle-checked-bkg-color)` |
| `--fs-toggle-knob-icon-checked-color-hover` | `var(--fs-toggle-checked-bkg-color-hover)` |
| `--fs-toggle-knob-checked-bkg-color` | `var(--fs-control-bkg)` |
| `--fs-toggle-knob-checked-border-color` | `var(--fs-toggle-knob-checked-bkg-color)` |
| `--fs-toggle-knob-disabled-bkg-color` | `var(--fs-color-neutral-5)` |
| `--fs-toggle-knob-disabled-border-color` | `var(--fs-toggle-knob-disabled-bkg-color)` |
| `--fs-toggle-knob-icon-disabled-color` | `var(--fs-toggle-disabled-bkg-color)` |

---

### Tooltip

| Variable | Default Value |
|---|---|
| `--fs-tooltip-padding` | `var(--fs-spacing-2)` |
| `--fs-tooltip-gap` | `var(--fs-spacing-1)` |
| `--fs-tooltip-border-radius` | `var(--fs-border-radius)` |
| `--fs-tooltip-background` | `var(--fs-color-neutral-6)` |
| `--fs-tooltip-text-color` | `var(--fs-color-text-inverse)` |
| `--fs-tooltip-z-index` | `var(--fs-z-index-high)` |
| `--fs-tooltip-indicator-size` | `var(--fs-spacing-1)` |
| `--fs-tooltip-indicator-distance-base` | `var(--fs-spacing-1)` |
| `--fs-tooltip-indicator-distance-edge` | `var(--fs-spacing-3)` |
| `--fs-tooltip-indicator-translate` | `calc(--fs-tooltip-indicator-size + --fs-tooltip-indicator-distance-base)` |
| `--fs-tooltip-transition-timing` | `var(--fs-transition-timing)` |
| `--fs-tooltip-transition-property` | `opacity` |
| `--fs-tooltip-transition-function` | `var(--fs-transition-function)` |

---

## Organisms

### BannerText

| Variable | Default Value |
|---|---|
| `--fs-banner-text-padding-mobile` | `var(--fs-spacing-6) 5%` |
| `--fs-banner-text-padding-desktop` | `var(--fs-spacing-9) 10%` |
| `--fs-banner-text-border-radius` | `var(--fs-border-radius)` |
| `--fs-banner-text-title-size` | `var(--fs-text-size-lead)` |
| `--fs-banner-text-title-weight` | `var(--fs-text-weight-bold)` |
| `--fs-banner-text-title-line-height` | `1.2` |
| `--fs-banner-text-primary-title-size` | `var(--fs-text-size-title-page)` |
| `--fs-banner-text-secondary-title-size` | `var(--fs-text-size-4)` |
| `--fs-banner-text-secondary-caption-size` | `var(--fs-text-size-base)` |
| `--fs-banner-text-secondary-caption-weight` | `var(--fs-text-weight-regular)` |
| `--fs-banner-text-secondary-caption-line-height` | `1.5` |
| `--fs-banner-text-button-link-min-width` | `11.25rem` |
| `--fs-banner-text-button-link-margin-top` | `var(--fs-spacing-6)` |
| **Variants** | |
| `--fs-banner-text-main-bkg-color` | `var(--fs-color-primary-bkg)` |
| `--fs-banner-text-main-text-color` | `var(--fs-color-primary-text)` |
| `--fs-banner-text-light-bkg-color` | `var(--fs-color-secondary-bkg-light)` |
| `--fs-banner-text-light-text-color` | `var(--fs-color-text-display)` |
| `--fs-banner-text-accent-bkg-color` | `var(--fs-color-highlighted-bkg)` |
| `--fs-banner-text-accent-text-color` | `var(--fs-banner-text-light-text-color)` |

---

### CartSidebar

| Variable | Default Value |
|---|---|
| `--fs-cart-sidebar-bkg-color` | `var(--fs-color-neutral-bkg)` |
| `--fs-cart-sidebar-list-padding` | `var(--fs-spacing-3)` |
| `--fs-cart-sidebar-header-title-column-gap` | `var(--fs-spacing-2)` |
| `--fs-cart-sidebar-footer-bkg-color` | `var(--fs-color-neutral-0)` |
| `--fs-cart-sidebar-footer-box-shadow` | `0 0 6px rgb(0 0 0 / 20%)` |

---

### EmptyState

| Variable | Default Value |
|---|---|
| `--fs-empty-state-height` | `100%` |
| `--fs-empty-state-min-height` | `50vh` |
| `--fs-empty-state-border-radius` | `var(--fs-border-radius)` |
| `--fs-empty-state-padding` | `0 var(--fs-spacing-8)` |
| `--fs-empty-state-bkg-color-default` | `var(--fs-color-neutral-bkg)` |
| `--fs-empty-state-bkg-color-light` | `var(--fs-color-body-bkg)` |
| `--fs-empty-state-title-color` | `var(--fs-color-disabled-text)` |
| `--fs-empty-state-title-size` | `var(--fs-text-size-lead)` |
| `--fs-empty-state-title-margin-bottom` | `var(--fs-spacing-2)` |
| `--fs-empty-state-link-min-width` | `11.875rem` |

---

### Filter

| Variable | Default Value |
|---|---|
| `--fs-filter-title-height` | `var(--fs-spacing-6)` |
| `--fs-filter-title-margin-bottom` | `var(--fs-spacing-0)` |
| `--fs-filter-title-text-size` | `var(--fs-text-size-2)` |
| `--fs-filter-title-line-height` | `1.25` |
| `--fs-filter-link-color` | `var(--fs-color-link)` |
| `--fs-filter-link-column-gap` | `var(--fs-spacing-0)` |
| `--fs-filter-link-padding` | `0` |
| `--fs-filter-list-padding-bottom` | `var(--fs-spacing-3)` |
| `--fs-filter-list-item-not-last-margin-bottom` | `var(--fs-spacing-3)` |
| `--fs-filter-list-item-checkbox-width` | `1.25rem` |
| `--fs-filter-list-item-checkbox-height` | `var(--fs-filter-list-item-checkbox-width)` |
| `--fs-filter-list-item-label-text-size` | `var(--fs-text-size-2)` |
| `--fs-filter-list-item-label-line-height` | `1.25` |
| `--fs-filter-list-item-label-width` | `100%` |
| `--fs-filter-list-item-label-margin-left` | `var(--fs-spacing-1)` |
| `--fs-filter-list-item-badge-margin-left` | `var(--fs-spacing-1)` |
| **Accordion (notebook)** | |
| `--fs-filter-accordion-border-width-notebook` | `var(--fs-border-width)` |
| `--fs-filter-accordion-border-color-notebook` | `var(--fs-border-color-light)` |
| `--fs-filter-accordion-border-radius-notebook` | `var(--fs-border-radius)` |
| `--fs-filter-accordion-button-text-size` | `var(--fs-text-size-lead)` |
| `--fs-filter-accordion-button-text-size-notebook` | `var(--fs-text-size-2)` |
| `--fs-filter-accordion-button-text-weight` | `var(--fs-text-weight-regular)` |
| `--fs-filter-accordion-button-line-height` | `1.5` |
| `--fs-filter-accordion-button-line-height-notebook` | `1.25` |
| `--fs-filter-accordion-button-padding-right-notebook` | `var(--fs-spacing-4)` |
| `--fs-filter-accordion-button-padding-left-notebook` | `var(--fs-filter-accordion-button-padding-right-notebook)` |
| `--fs-filter-accordion-item-panel-padding-right-notebook` | `var(--fs-spacing-4)` |
| `--fs-filter-accordion-item-panel-padding-left-notebook` | `var(--fs-filter-accordion-item-panel-padding-right-notebook)` |

---

### FilterSkeleton

| Variable | Default Value |
|---|---|
| `--fs-filter-skeleton-margin-top` | `var(--fs-spacing-1)` |
| `--fs-filter-skeleton-title-max-width` | `30%` |
| `--fs-filter-skeleton-title-margin-bottom` | `var(--fs-spacing-2)` |
| `--fs-filter-skeleton-content-min-height` | `var(--fs-spacing-8)` |
| `--fs-filter-skeleton-content-margin-bottom` | `var(--fs-spacing-0)` |
| `--fs-filter-skeleton-content-padding` | `var(--fs-spacing-1) var(--fs-spacing-1) var(--fs-spacing-0)` |
| `--fs-filter-skeleton-content-border-color` | `var(--fs-border-color-light)` |
| `--fs-filter-skeleton-content-border-width` | `var(--fs-border-width)` |
| `--fs-filter-skeleton-content-border-radius` | `var(--fs-border-radius)` |

---

### FilterSlider

| Variable | Default Value |
|---|---|
| `--fs-filter-slider-footer-height` | `5rem` |
| `--fs-filter-slider-footer-width` | `100%` |
| `--fs-filter-slider-footer-padding` | `var(--fs-spacing-3)` |
| `--fs-filter-slider-footer-bkg-color` | `var(--fs-color-neutral-0)` |
| `--fs-filter-slider-footer-box-shadow` | `0 0 6px rgb(0 0 0 / 20%)` |
| `--fs-filter-slider-footer-button-clear-width` | `40%` |
| `--fs-filter-slider-footer-button-clear-margin-right` | `var(--fs-spacing-3)` |
| `--fs-filter-slider-footer-button-apply-width` | `60%` |
| `--fs-filter-slider-content-height` | `calc(100vh - var(--fs-filter-slider-footer-height))` |
| `--fs-filter-slider-content-padding` | `0 var(--fs-spacing-3)` |
| `--fs-filter-slider-title-font-size` | `var(--fs-text-size-3)` |
| `--fs-filter-slider-title-font-weight` | `var(--fs-text-weight-semibold)` |
| `--fs-filter-slider-title-line-height` | `1.12` |

---

### Footer

| Variable | Default Value |
|---|---|
| `--fs-footer-spacing-vertical-mobile` | `var(--fs-spacing-4)` |
| `--fs-footer-spacing-vertical-notebook` | `var(--fs-spacing-5)` |
| `--fs-footer-spacing-horizontal-notebook` | `var(--fs-grid-gap-3)` |
| `--fs-footer-bkg-color` | `var(--fs-color-neutral-bkg)` |
| `--fs-footer-divisor-border-width` | `var(--fs-border-width)` |
| `--fs-footer-divisor-border-color` | `var(--fs-border-color-light)` |
| `--fs-footer-title-size` | `var(--fs-text-size-body)` |
| `--fs-footer-title-line-height` | `1.25` |
| `--fs-footer-title-weight` | `var(--fs-text-weight-bold)` |
| `--fs-footer-title-margin-bottom` | `var(--fs-spacing-1)` |
| `--fs-footer-logo-width` | `var(--fs-logo-width)` |

---

### Hero

| Variable | Default Value |
|---|---|
| `--fs-hero-text-size` | `var(--fs-text-size-lead)` |
| `--fs-hero-text-line-height` | `1.33` |
| `--fs-hero-image-border-radius` | `0` |
| `--fs-hero-title-padding` | `var(--fs-spacing-5) 0 var(--fs-spacing-6)` |
| `--fs-hero-title-weight` | `var(--fs-text-weight-black)` |
| `--fs-hero-title-line-height` | `1.1` |
| `--fs-hero-subtitle-margin-top-mobile` | `var(--fs-spacing-2)` |
| `--fs-hero-subtitle-margin-top-tablet` | `var(--fs-spacing-4)` |
| `--fs-hero-subtitle-size` | `var(--fs-hero-text-size)` |
| `--fs-hero-subtitle-line-height` | `var(--fs-hero-text-line-height)` |
| `--fs-hero-primary-title-size` | `var(--fs-text-size-title-huge)` |
| `--fs-hero-primary-image-height-mobile` | `15rem` |
| `--fs-hero-primary-image-height-desktop` | `29rem` |
| `--fs-hero-secondary-title-size` | `var(--fs-text-size-title-page)` |
| `--fs-hero-secondary-image-height-mobile` | `11.25rem` |
| `--fs-hero-secondary-image-height-desktop` | `14.188rem` |
| **Variants** | |
| `--fs-hero-main-bkg-color` | `var(--fs-color-primary-bkg)` |
| `--fs-hero-main-text-color` | `var(--fs-color-primary-text)` |
| `--fs-hero-light-bkg-color` | `var(--fs-color-secondary-bkg-light)` |
| `--fs-hero-light-text-color` | `var(--fs-color-text-display)` |
| `--fs-hero-accent-bkg-color` | `var(--fs-color-highlighted-bkg)` |
| `--fs-hero-accent-text-color` | `var(--fs-hero-light-text-color)` |

---

### ImageGallery

| Variable | Default Value |
|---|---|
| `--fs-image-gallery-width` | `calc(100% + (2 * var(--fs-grid-padding)))` |
| `--fs-image-gallery-gap-mobile` | `var(--fs-spacing-2)` |
| `--fs-image-gallery-gap-notebook` | `var(--fs-spacing-3)` |
| `--fs-image-gallery-transition-timing` | `var(--fs-transition-timing)` |
| `--fs-image-gallery-transition-function` | `var(--fs-transition-function)` |
| **Current image** | |
| `--fs-image-gallery-current-height` | `33.125rem` |
| `--fs-image-gallery-current-border-radius` | `var(--fs-border-radius)` |
| **Selector** | |
| `--fs-image-gallery-selector-max-height` | `var(--fs-image-gallery-current-height)` |
| `--fs-image-gallery-selector-elements-gap` | `var(--fs-spacing-1)` |
| `--fs-image-gallery-selector-elements-gap-notebook` | `var(--fs-spacing-2)` |
| `--fs-image-gallery-selector-elements-padding-mobile` | `var(--fs-spacing-0) var(--fs-grid-padding)` |
| `--fs-image-gallery-selecssctor-elements-padding-notebook` | `var(--fs-spacing-0) 0` |
| `--fs-image-gallery-selector-control-bkg-color` | `var(--fs-control-bkg)` |
| `--fs-image-gallery-selector-control-border-radius` | `var(--fs-border-radius-circle)` |
| `--fs-image-gallery-selector-control-shadow` | `var(--fs-shadow-darker)` |
| `--fs-image-gallery-selector-control-gradient-bkg-color` | `var(--fs-color-body-bkg)` |
| **Thumbnails** | |
| `--fs-image-gallery-selector-thumbnail-width-mobile` | `var(--fs-spacing-8)` |
| `--fs-image-gallery-selector-thumbnail-height-mobile` | `var(--fs-image-gallery-selector-thumbnail-width-mobile)` |
| `--fs-image-gallery-selector-thumbnail-width-notebook` | `var(--fs-spacing-10)` |
| `--fs-image-gallery-selector-thumbnail-height-notebook` | `var(--fs-image-gallery-selector-thumbnail-width-notebook)` |
| `--fs-image-gallery-selector-thumbnail-border-radius` | `var(--fs-border-radius)` |
| `--fs-image-gallery-selector-thumbnail-border-width` | `var(--fs-border-width-thick)` |
| `--fs-image-gallery-selector-thumbnail-image-border-radius` | `var(--fs-border-radius-small)` |
| `--fs-image-gallery-selector-thumbnail-selected-border-color` | `var(--fs-border-color-active)` |
| `--fs-image-gallery-selector-thumbnail-selected-border-width` | `var(--fs-border-width-thickest)` |

---

### Incentives

| Variable | Default Value |
|---|---|
| `--fs-incentives-gap` | `var(--fs-spacing-4)` |
| `--fs-incentives-padding-top` | `var(--fs-incentives-gap)` |
| `--fs-incentives-padding-bottom` | `var(--fs-incentives-gap)` |
| `--fs-incentives-bkg-color` | `var(--fs-color-primary-bkg-light)` |
| `--fs-incentives-border-color` | `var(--fs-border-color-light)` |
| `--fs-incentives-border-width` | `var(--fs-border-width)` |
| `--fs-incentives-title-size` | `var(--fs-text-size-1)` |
| `--fs-incentives-title-weight` | `var(--fs-text-weight-bold)` |
| `--fs-incentives-title-line-height` | `1.42` |
| `--fs-incentives-title-color` | `var(--fs-color-text)` |
| `--fs-incentives-description-size` | `var(--fs-incentives-title-size)` |
| `--fs-incentives-description-line-height` | `1.14` |
| `--fs-incentives-description-color` | `var(--fs-incentives-title-color)` |
| `--fs-incentives-icon-color` | `var(--fs-incentives-title-color)` |

---

### Navbar

| Variable | Default Value |
|---|---|
| `--fs-navbar-height-mobile` | `3.5rem` |
| `--fs-navbar-bkg-color` | `rgb(255 255 255 / 90%)` |
| `--fs-navbar-box-shadow` | `0 var(--fs-spacing-0) var(--fs-spacing-3) rgb(0 0 0 / 5%)` |
| `--fs-navbar-transition-timing` | `var(--fs-transition-timing)` |
| `--fs-navbar-transition-function` | `var(--fs-transition-function)` |
| `--fs-navbar-header-padding` | `0 var(--fs-spacing-0)` |
| `--fs-navbar-header-padding-top-notebook` | `var(--fs-spacing-1)` |
| `--fs-navbar-header-padding-bottom-notebook` | `var(--fs-navbar-header-padding-top-notebook)` |
| **Search** | |
| `--fs-navbar-search-button-icon-width-mobile` | `var(--fs-spacing-5)` |
| `--fs-navbar-search-button-icon-height-mobile` | `var(--fs-navbar-search-button-icon-width-mobile)` |
| `--fs-navbar-search-expanded-input-width` | `calc(100% - var(--fs-spacing-7))` |
| `--fs-navbar-search-expanded-button-icon-margin-right` | `-4.063rem` |
| **Logo** | |
| `--fs-navbar-logo-width` | `var(--fs-logo-width)` |
| `--fs-navbar-logo-border-left-width` | `var(--fs-border-width)` |
| `--fs-navbar-logo-border-left-color` | `var(--fs-border-color-light)` |

---

### NavbarSlider

| Variable | Default Value |
|---|---|
| `--fs-navbar-slider-padding` | `var(--fs-spacing-3)` |
| `--fs-navbar-slider-header-height` | `5rem` |
| `--fs-navbar-slider-header-padding-bottom` | `var(--fs-spacing-2)` |
| `--fs-navbar-slider-header-button-margin-right` | `calc(-1 * var(--fs-spacing-1))` |
| `--fs-navbar-slider-footer-padding-top` | `var(--fs-navbar-slider-header-padding-bottom)` |
| `--fs-navbar-slider-footer-margin-top` | `var(--fs-navbar-slider-header-padding-bottom)` |
| `--fs-navbar-slider-logo-padding` | `0` |
| `--fs-navbar-slider-logo-margin-right` | `var(--fs-spacing-5)` |

---

### Newsletter

| Variable | Default Value |
|---|---|
| `--fs-newsletter-padding-mobile` | `var(--fs-spacing-5)` |
| `--fs-newsletter-padding-desktop` | `var(--fs-spacing-9) 10%` |
| `--fs-newsletter-border-radius` | `var(--fs-border-radius)` |
| `--fs-newsletter-card-border-radius` | `var(--fs-border-radius)` |
| `--fs-newsletter-icon-size` | `var(--fs-spacing-5)` |
| `--fs-newsletter-title-size` | `var(--fs-text-size-title-section)` |
| `--fs-newsletter-title-weight` | `var(--fs-text-weight-bold)` |
| **Variants** | |
| `--fs-newsletter-main-bkg-color` | `var(--fs-color-primary-bkg)` |
| `--fs-newsletter-main-text-color` | `var(--fs-color-primary-text)` |
| `--fs-newsletter-light-bkg-color` | `var(--fs-color-secondary-bkg-light)` |
| `--fs-newsletter-light-text-color` | `var(--fs-color-text-display)` |
| `--fs-newsletter-accent-bkg-color` | `var(--fs-color-highlighted-bkg)` |
| `--fs-newsletter-accent-text-color` | `var(--fs-newsletter-light-text-color)` |

---

### OutOfStock

| Variable | Default Value |
|---|---|
| `--fs-out-of-stock-title-size` | `var(--fs-text-size-lead)` |
| `--fs-out-of-stock-title-weight` | `var(--fs-text-weight-bold)` |
| `--fs-out-of-stock-title-line-height` | `1.15` |
| `--fs-out-of-stock-title-margin-bottom` | `var(--fs-spacing-0)` |
| `--fs-out-of-stock-title-color` | `var(--fs-color-neutral-text)` |
| `--fs-out-of-stock-message-size` | `var(--fs-text-size-body)` |
| `--fs-out-of-stock-message-weight` | `var(--fs-text-weight-regular)` |
| `--fs-out-of-stock-message-line-height` | `1.15` |
| `--fs-out-of-stock-message-color` | `var(--fs-color-success-text)` |
| `--fs-out-of-stock-message-column-gap` | `var(--fs-spacing-0)` |
| `--fs-out-of-stock-message-margin-bottom` | `var(--fs-spacing-3)` |
| `--fs-out-of-stock-button-width` | `100%` |
| `--fs-out-of-stock-button-margin-top` | `var(--fs-spacing-3)` |

---

### PaymentMethods

| Variable | Default Value |
|---|---|
| `--fs-payment-methods-title-size` | `var(--fs-text-size-body)` |
| `--fs-payment-methods-title-weight` | `var(--fs-text-weight-bold)` |
| `--fs-payment-methods-title-line-height` | `1.25` |
| `--fs-payment-methods-flag-width` | `var(--fs-spacing-5)` |
| `--fs-payment-methods-flag-height` | `var(--fs-spacing-4)` |
| `--fs-payment-methods-flag-bkg-color` | `var(--fs-color-neutral-0)` |
| `--fs-payment-methods-flag-border-width` | `var(--fs-border-width)` |
| `--fs-payment-methods-flag-border-color` | `var(--fs-color-neutral-3)` |
| `--fs-payment-methods-flag-border-radius` | `var(--fs-border-radius-small)` |
| `--fs-payment-methods-flags-row-gap` | `var(--fs-spacing-1)` |
| `--fs-payment-methods-flags-margin-top` | `var(--fs-spacing-3)` |

---

### PickupPointCards

| Variable | Default Value |
|---|---|
| `--fs-pickup-point-cards-row-gap` | `var(--fs-grid-gap-2)` |
| `--fs-pickup-point-cards-item-bkg-color-hover` | `var(--fs-color-neutral-bkg)` |
| `--fs-pickup-point-cards-item-border-color-selected` | `var(--fs-border-color-active)` |
| `--fs-pickup-point-cards-item-border-width-selected` | `var(--fs-border-width-thick)` |

---

### ProductComparison

| Variable | Default Value |
|---|---|
| `--fs-product-comparison-bkg-color` | `var(--fs-color-body-bkg)` |
| `--fs-product-comparison-bkg-color-neutral` | `var(--fs-color-neutral-1)` |
| `--fs-product-comparison-box-shadow` | `var(--fs-shadow-darker)` |
| `--fs-product-comparison-padding` | `var(--fs-spacing-8)` |
| `--fs-product-comparison-text-weight` | `var(--fs-text-weight-light)` |
| `--fs-product-comparison-text-color` | `var(--fs-border-color-light)` |
| `--fs-product-comparison-title-size` | `var(--fs-text-size-6)` |
| `--fs-product-comparison-title-weight` | `var(--fs-text-weight-semibold)` |
| `--fs-product-comparison-slide-over-partial-gap` | `calc(2 * var(--fs-grid-padding))` |
| `--fs-product-comparison-slide-over-partial-width-mobile` | `calc(100vw - var(--fs-slide-over-partial-gap))` |
| `--fs-product-comparison-slide-over-partial-width-notebook` | `calc(100% / 3)` |
| `--fs-product-comparison-slide-over-partial-max-width-notebook` | `calc(var(--fs-grid-breakpoint-notebook) / 3)` |

---

### ProductDetails

| Variable | Default Value |
|---|---|
| `--fs-product-details-vertical-spacing` | `var(--fs-spacing-4)` |
| `--fs-product-details-horizontal-spacing` | `var(--fs-product-details-vertical-spacing)` |
| `--fs-product-details-section-bkg-color` | `transparent` |
| `--fs-product-details-section-border-radius` | `var(--fs-border-radius)` |
| `--fs-product-details-section-border-color` | `var(--fs-border-color-light)` |
| `--fs-product-details-section-border-width` | `var(--fs-border-width)` |

---

### ProductGrid

| Variable | Default Value |
|---|---|
| `--fs-product-grid-gap-mobile` | `var(--fs-grid-gap-0)` |
| `--fs-product-grid-gap-tablet` | `var(--fs-product-grid-gap-mobile)` |
| `--fs-product-grid-gap-desktop` | `var(--fs-grid-gap-2)` |
| `--fs-product-grid-columns-mobile` | `2` |
| `--fs-product-grid-columns-tablet` | `4` |
| `--fs-product-grid-columns-desktop` | `var(--fs-product-grid-columns-tablet)` |

---

### ProductShelf

| Variable | Default Value |
|---|---|
| `--fs-product-shelf-items-gap` | `var(--fs-grid-gap-1)` |
| `--fs-product-shelf-items-padding-top` | `var(--fs-spacing-0)` |
| `--fs-product-shelf-items-padding-bottom` | `var(--fs-spacing-3)` |

---

### RegionModal

| Variable | Default Value |
|---|---|
| `--fs-region-modal-margin-bottom` | `var(--fs-spacing-6)` |
| `--fs-region-modal-link-color` | `var(--fs-color-link)` |
| `--fs-region-modal-link-padding` | `0` |
| `--fs-region-modal-link-column-gap` | `var(--fs-spacing-0)` |

---

### RegionPopover

| Variable | Default Value |
|---|---|
| `--fs-region-popover-width` | `406px` |
| `--fs-region-popover-row-gap` | `var(--fs-spacing-2)` |
| `--fs-region-popover-description-text-size` | `var(--fs-text-size-legend)` |
| `--fs-region-popover-link-padding` | `0` |
| `--fs-region-popover-link-column-gap` | `var(--fs-spacing-0)` |
| `--fs-region-popover-link-color` | `var(--fs-color-link)` |

---

### SearchInput

| Variable | Default Value |
|---|---|
| `--fs-search-input-height-desktop` | `var(--fs-spacing-6)` |

---

### ShippingSimulation

| Variable | Default Value |
|---|---|
| `--fs-shipping-simulation-header-padding-top` | `var(--fs-spacing-3)` |
| `--fs-shipping-simulation-title-font-size` | `var(--fs-text-size-3)` |
| `--fs-shipping-simulation-title-font-weight` | `var(--fs-text-weight-bold)` |
| `--fs-shipping-simulation-title-line-height` | `1.2` |
| `--fs-shipping-simulation-title-padding-bottom` | `var(--fs-spacing-2)` |
| `--fs-shipping-simulation-subtitle-size` | `var(--fs-text-size-2)` |
| `--fs-shipping-simulation-subtitle-weight` | `var(--fs-text-weight-bold)` |
| `--fs-shipping-simulation-subtitle-line-height` | `1.5` |
| `--fs-shipping-simulation-text-size` | `var(--fs-text-size-legend)` |
| `--fs-shipping-simulation-location-font-size` | `var(--fs-text-size-2)` |
| `--fs-shipping-simulation-location-line-height` | `1.5` |
| `--fs-shipping-simulation-location-padding-bottom` | `var(--fs-spacing-2)` |
| `--fs-shipping-simulation-link-padding-top` | `var(--fs-spacing-1)` |

---

### SKUMatrix

| Variable | Default Value |
|---|---|
| `--fs-sku-matrix-sidebar-bkg-color` | `var(--fs-color-body-bkg)` |
| `--fs-sku-matrix-sidebar-title-size` | `var(--fs-text-size-6)` |
| `--fs-sku-matrix-sidebar-title-text-weight` | `var(--fs-text-weight-semibold)` |
| `--fs-sku-matrix-sidebar-table-cell-font-size` | `var(--fs-text-size-tiny)` |
| `--fs-sku-matrix-sidebar-table-cell-text-weight` | `var(--fs-text-weight-medium)` |
| `--fs-sku-matrix-sidebar-table-cell-image-width` | `var(--fs-spacing-7)` |
| `--fs-sku-matrix-sidebar-table-cell-image-border-radius` | `var(--fs-border-radius)` |
| `--fs-sku-matrix-slide-over-partial-gap` | `calc(2 * var(--fs-grid-padding))` |
| `--fs-sku-matrix-slide-over-partial-width-mobile` | `calc(100vw - var(--fs-sku-matrix-slide-over-partial-gap))` |

---

### SlideOver

| Variable | Default Value |
|---|---|
| `--fs-slide-over-bkg-color` | `var(--fs-color-body-bkg)` |
| `--fs-slide-over-transition-timing` | `var(--fs-transition-timing)` |
| `--fs-slide-over-header-padding` | `var(--fs-spacing-2) var(--fs-spacing-3) var(--fs-spacing-2)` |
| `--fs-slide-over-header-bkg-color` | `var(--fs-color-neutral-0)` |
| `--fs-slide-over-partial-gap` | `calc(2 * var(--fs-grid-padding))` |
| `--fs-slide-over-partial-width-mobile` | `calc(100vw - var(--fs-slide-over-partial-gap))` |
| `--fs-slide-over-partial-width-notebook` | `calc(100% / 3)` |
| `--fs-slide-over-partial-max-width-notebook` | `calc(var(--fs-grid-breakpoint-notebook) / 3)` |

---

### Tiles

| Variable | Default Value |
|---|---|
| `--fs-tiles-gap-mobile` | `var(--fs-grid-gap-2)` |
| `--fs-tiles-gap-notebook` | `var(--fs-grid-gap-3)` |
| `--fs-tiles-tile-min-width` | `9rem` |
| `--fs-tiles-tile-border-radius` | `var(--fs-border-radius)` |
