---
name: faststore-theming
description: "Apply when deciding, designing, or implementing FastStore theme customizations in src/themes/ or working with design tokens and SCSS variables. Covers global tokens, local component tokens, Sass variables, CSS custom properties, and Brandless architecture. Use for any visual customization of FastStore storefronts that does not require component overrides."
---

# FastStore Theming & Design Tokens

## When this skill applies

Use this skill when:
- You need to change the visual appearance of a FastStore storefront — colors, typography, spacing, borders, or component-specific styles.
- You are working with files in `src/themes/` or creating `custom-theme.scss`.
- You need to customize individual component styles using local tokens and `[data-fs-*]` data attributes.
- You are setting up a brand identity on top of the Brandless default theme.

Do not use this skill for:
- Changes that require replacing a component, injecting logic, or modifying behavior — use the `faststore-overrides` skill.
- Client-side state management — use the `faststore-state-management` skill.
- Data fetching or API extensions — use the `faststore-data-fetching` skill.

## Decision rules

- Use theming as the first approach before considering overrides — it is lighter and more maintainable.
- Use global tokens (`:root` scope) when the change should propagate store-wide (e.g., brand colors, font families).
- Use local tokens (`[data-fs-*]` scope) when the change applies to a single component (e.g., button background color).
- Use `[data-fs-*]` data attributes to target components — never use `.fs-*` class names or generic tag selectors.
- Place all theme files in `src/themes/` with `custom-theme.scss` as the entry point — files elsewhere are not discovered.
- Reference design tokens via `var(--fs-*)` instead of hardcoding hex colors, pixel sizes, or font values.
- Use CSS modules for custom (non-FastStore) components to avoid conflicting with FastStore's structural styles.

## Hard constraints

### Constraint: Use Design Tokens — Not Inline Styles

MUST use design tokens (global or local) to style FastStore components. MUST NOT use inline `style={}` props on FastStore components for theming purposes.

**Why this matters**
Inline styles bypass the design token hierarchy, cannot be overridden by themes, do not participate in responsive breakpoints, and create maintenance nightmares. They also defeat CSS caching since styles are embedded in HTML. Design tokens ensure consistency and allow store-wide changes from a single file.

**Detection**
If you see `style={{` or `style={` on FastStore native components (components imported from `@faststore/ui` or `@faststore/core`) → warn that this bypasses the theming system. Suggest using design tokens or CSS modules instead. Exception: inline styles are acceptable on fully custom components that are not part of the FastStore UI library.

**Correct**
```scss
// src/themes/custom-theme.scss
// Override the BuyButton's primary background color using design tokens
[data-fs-buy-button] {
  --fs-button-primary-bkg-color: #e31c58;
  --fs-button-primary-bkg-color-hover: #c4174d;
  --fs-button-primary-text-color: var(--fs-color-text-inverse);

  [data-fs-button-wrapper] {
    border-radius: var(--fs-border-radius-pill);
  }
}
```

**Wrong**
```typescript
// WRONG: Using inline styles on a FastStore component
import { BuyButton } from '@faststore/ui'

function ProductActions() {
  return (
    <BuyButton
      style={{ backgroundColor: '#e31c58', color: 'white', borderRadius: '999px' }}
    >
      Add to Cart
    </BuyButton>
  )
  // Inline styles bypass the design token hierarchy.
  // They cannot be changed store-wide from the theme file.
  // They do not respond to dark mode or other theme variants.
}
```

---

### Constraint: Place Theme Files in src/themes/

MUST place custom theme SCSS files in the `src/themes/` directory. The primary theme file must be named `custom-theme.scss`.

**Why this matters**
FastStore's build system imports theme files from `src/themes/custom-theme.scss`. Files placed elsewhere will not be picked up by the build and your token overrides will have no effect. There will be no error — the default Brandless theme will render instead.

**Detection**
If you see token override declarations (variables starting with `--fs-`) in SCSS files outside `src/themes/` → warn that these may not be applied. If the file `src/themes/custom-theme.scss` does not exist in the project → warn that no custom theme is active.

**Correct**
```scss
// src/themes/custom-theme.scss
// Global token overrides — applied store-wide
:root {
  --fs-color-main-0: #003232;
  --fs-color-main-1: #004c4c;
  --fs-color-main-2: #006666;
  --fs-color-main-3: #008080;
  --fs-color-main-4: #00b3b3;

  --fs-color-accent-0: #e31c58;
  --fs-color-accent-1: #c4174d;
  --fs-color-accent-2: #a51342;

  --fs-text-face-body: 'Inter', -apple-system, system-ui, BlinkMacSystemFont, sans-serif;
  --fs-text-face-title: 'Poppins', var(--fs-text-face-body);

  --fs-text-size-title-huge: 3.5rem;
  --fs-text-size-title-page: 2.25rem;
}

// Component-specific token overrides
[data-fs-price] {
  --fs-price-listing-color: #cb4242;
}
```

**Wrong**
```scss
// src/styles/my-theme.scss
// WRONG: This file is in src/styles/, not src/themes/
// FastStore will NOT import this file. Token overrides will be ignored.
:root {
  --fs-color-main-0: #003232;
  --fs-color-accent-0: #e31c58;
}

// Also WRONG: Creating a theme in the project root
// ./theme.scss — this will not be discovered by the build system
```

---

### Constraint: Use Data Attributes for Component Targeting

MUST use FastStore's `data-fs-*` data attributes to target components in theme SCSS files. MUST NOT use class names or tag selectors to target FastStore native components.

**Why this matters**
FastStore components use data attributes as their public styling API (e.g., `data-fs-button`, `data-fs-price`, `data-fs-hero`). Class names are implementation details that can change between versions. Using data attributes ensures your theme survives FastStore updates. Each component documents its available data attributes in the customization section of its docs.

**Detection**
If you see CSS selectors targeting `.fs-*` class names or generic tag selectors (`button`, `h1`, `div`) to style FastStore components → warn about fragility. Suggest using `[data-fs-*]` selectors instead.

**Correct**
```scss
// src/themes/custom-theme.scss
// Target the Hero section using its data attribute
[data-fs-hero] {
  --fs-hero-text-size: var(--fs-text-size-title-huge);
  --fs-hero-heading-weight: var(--fs-text-weight-bold);

  [data-fs-hero-heading] {
    text-transform: uppercase;
    letter-spacing: 0.05em;
  }

  [data-fs-hero-image] {
    border-radius: var(--fs-border-radius);
    filter: brightness(0.9);
  }
}
```

**Wrong**
```scss
// src/themes/custom-theme.scss
// WRONG: Targeting by class names — these are internal and may change
.fs-hero {
  font-size: 3.5rem;
}

.fs-hero h1 {
  text-transform: uppercase;
}

// WRONG: Using generic tag selectors
section > div > h1 {
  font-weight: bold;
}
// These are fragile selectors that break when FastStore restructures its HTML.
```

## Preferred pattern

Recommended file layout:

```text
src/
└── themes/
    └── custom-theme.scss    ← main entry point (auto-imported by FastStore)
```

Minimal custom theme:

```scss
// src/themes/custom-theme.scss
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Poppins:wght@600;700;800&display=swap');

// Global Token Overrides
:root {
  --fs-color-main-0: #003232;
  --fs-color-main-1: #004c4c;
  --fs-color-accent-0: #e31c58;
  --fs-color-accent-1: #c4174d;

  --fs-text-face-body: 'Inter', -apple-system, system-ui, sans-serif;
  --fs-text-face-title: 'Poppins', var(--fs-text-face-body);
}

// Component-specific overrides
[data-fs-button] {
  --fs-button-border-radius: var(--fs-border-radius-pill);

  &[data-fs-button-variant="primary"] {
    --fs-button-primary-bkg-color: var(--fs-color-accent-0);
    --fs-button-primary-bkg-color-hover: var(--fs-color-accent-1);
    --fs-button-primary-text-color: var(--fs-color-text-inverse);
  }
}

[data-fs-price] {
  --fs-price-listing-color: #cb4242;
  --fs-price-listing-text-decoration: line-through;
}

[data-fs-navbar] {
  --fs-navbar-bkg-color: var(--fs-color-main-0);
  --fs-navbar-text-color: var(--fs-color-text-inverse);
}
```

For custom (non-FastStore) components, use CSS modules to avoid conflicts:

```scss
// src/components/CustomBanner.module.scss
.customBanner {
  display: flex;
  align-items: center;
  gap: var(--fs-spacing-3); // Still reference FastStore tokens for consistency
  padding: var(--fs-spacing-4);
  background-color: var(--fs-color-main-0);
  color: var(--fs-color-text-inverse);
  border-radius: var(--fs-border-radius);
}
```

## Common failure modes

- Using `!important` declarations — creates specificity dead-ends and defeats the cascading nature of design tokens. Use the correct token at the correct selector specificity instead.
- Hardcoding hex colors, pixel sizes, and font values directly in component styles instead of referencing `var(--fs-*)` tokens. Changes cannot propagate store-wide.
- Creating a parallel CSS system (Tailwind, Bootstrap, custom global stylesheet) that conflicts with FastStore's structural styles and doubles the CSS payload.
- Placing theme files outside `src/themes/` — they will not be discovered by the build system.
- Targeting FastStore components with `.fs-*` class names or generic tag selectors instead of `[data-fs-*]` data attributes.

## Review checklist

- [ ] Is the theme file located in `src/themes/custom-theme.scss`?
- [ ] Are global token overrides placed in `:root` scope?
- [ ] Are component-level overrides using `[data-fs-*]` data attribute selectors?
- [ ] Are all values referencing design tokens via `var(--fs-*)` instead of hardcoded values?
- [ ] Is there no use of `!important` declarations?
- [ ] Could this change be achieved without overrides (is theming sufficient)?
- [ ] Are custom component styles scoped with CSS modules to avoid conflicts?

## Reference

- [Theming overview](https://developers.vtex.com/docs/guides/faststore/using-themes-overview) — Introduction to theming concepts, Brandless architecture, and token hierarchy
- [Global tokens](https://developers.vtex.com/docs/guides/faststore/global-tokens-overview) — Complete reference for all global design tokens (colors, typography, spacing, borders)
- [Global tokens: Colors](https://developers.vtex.com/docs/guides/faststore/global-tokens-colors) — Color token reference and palette structure
- [Global tokens: Typography](https://developers.vtex.com/docs/guides/faststore/global-tokens-typography) — Font family, size, and weight tokens
- [Global tokens: Spacing](https://developers.vtex.com/docs/guides/faststore/global-tokens-spacing) — Spacing scale tokens
- [Styling a component](https://developers.vtex.com/docs/guides/faststore/using-themes-components) — Guide for customizing individual component styles with local tokens
- [Available themes](https://developers.vtex.com/docs/guides/faststore/themes-overview) — Pre-built themes (Midnight, Soft Blue) available as starting points
- [Importing FastStore UI component styles](https://developers.vtex.com/docs/guides/faststore/using-themes-importing-ui-components-styles) — How to import and use component styles in custom sections
- [`faststore-overrides`](../faststore-overrides/SKILL.md) — Related skill for when theming alone is insufficient and behavioral changes are needed
