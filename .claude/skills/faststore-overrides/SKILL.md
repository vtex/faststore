---
name: faststore-overrides
description: "Apply when deciding, designing, or implementing FastStore component overrides in src/components/overrides/. Covers getOverriddenSection API, component replacement, props overriding, and custom section creation. Use for any FastStore storefront customization beyond theming that requires changing component behavior or structure."
---

# FastStore Section & Component Overrides

## When this skill applies

Use this skill when:
- You need to customize the behavior or appearance of a FastStore storefront component beyond what theming and design tokens can achieve.
- You need to replace a native component entirely with a custom implementation.
- You need to inject custom logic or modify props on native components within a section.
- You are working with files in `src/components/overrides/`.

Do not use this skill for:
- Visual-only changes (colors, typography, spacing) — use the `faststore-theming` skill and design tokens instead.
- Building custom state management for cart, session, or search — use the `faststore-state-management` skill.
- Extending the GraphQL data layer — use the `faststore-data-fetching` skill.

## Decision rules

- Use overrides when theming alone cannot achieve the desired change (e.g., replacing a component, adding logic, changing behavior).
- Use the `components` map with `{ Component: CustomComponent }` when replacing a native component entirely.
- Use the `components` map with `{ props: { ... } }` when only changing props on a native component without replacing it.
- Use the `className` option on `getOverriddenSection()` for wrapper-level styling alongside behavioral changes.
- Prefer theming with design tokens for purely visual changes — overrides are heavier and more tightly coupled.
- Only override components listed as overridable in the FastStore native sections documentation. Undocumented component names are silently ignored.
- Components prefixed with `__experimental` can be overridden but their props are not accessible and may change without notice.

## Hard constraints

### Constraint: Use the Override API — Never Modify FastStore Core

MUST use `getOverriddenSection()` from `@faststore/core` to customize sections. MUST NOT directly modify files in `node_modules/@faststore/` or import internal source files.

**Why this matters**
Modifying `node_modules` is ephemeral (changes are lost on `npm install`) and importing from internal paths like `@faststore/core/src/` creates tight coupling to implementation details that can break on any FastStore update.

**Detection**
If you see imports from `@faststore/core/src/` (internal source paths) → STOP. These are private implementation details. Only import from the public API: `@faststore/core` and `@faststore/core/experimental`. If you see direct file edits in `node_modules/@faststore/` → STOP immediately and use the override system instead.

**Correct**
```typescript
// src/components/overrides/ProductDetails.tsx
import { getOverriddenSection } from '@faststore/core'
import { ProductDetailsSection } from '@faststore/core'

import CustomProductTitle from '../CustomProductTitle'

const OverriddenProductDetails = getOverriddenSection({
  Section: ProductDetailsSection,
  components: {
    ProductTitle: { Component: CustomProductTitle },
  },
})

export default OverriddenProductDetails
```

**Wrong**
```typescript
// WRONG: Importing from internal source paths
import { ProductDetails } from '@faststore/core/src/components/sections/ProductDetails'
// This path is an implementation detail that can change without notice.
// It bypasses the public API and will break on FastStore updates.

// WRONG: Modifying node_modules directly
// Editing node_modules/@faststore/core/dist/components/ProductDetails.js
// Changes are lost on every npm install and cannot be version-controlled.
```

---

### Constraint: Override Files Must Live in src/components/overrides/

MUST place override files in the `src/components/overrides/` directory, named after the section being overridden (e.g., `ProductDetails.tsx`).

**Why this matters**
FastStore's build system scans `src/components/overrides/` to discover and apply section overrides. Files placed elsewhere will not be detected and the override will silently fail — the native section will render instead with no error message.

**Detection**
If you see override-related code (calls to `getOverriddenSection`) in files outside `src/components/overrides/` → warn that the override will not be applied. Check that the filename matches a valid native section name from the FastStore section list.

**Correct**
```typescript
// src/components/overrides/Alert.tsx
// File is in the correct directory and named after the Alert section
import { getOverriddenSection } from '@faststore/core'
import { AlertSection } from '@faststore/core'

import CustomIcon from '../CustomIcon'

const OverriddenAlert = getOverriddenSection({
  Section: AlertSection,
  components: {
    Icon: { Component: CustomIcon },
  },
})

export default OverriddenAlert
```

**Wrong**
```typescript
// src/components/MyCustomAlert.tsx
// WRONG: File is NOT in src/components/overrides/
// FastStore will NOT discover this override.
// The native Alert section will render unchanged.
import { getOverriddenSection } from '@faststore/core'
import { AlertSection } from '@faststore/core'

const OverriddenAlert = getOverriddenSection({
  Section: AlertSection,
  components: {
    Icon: { Component: CustomIcon },
  },
})

export default OverriddenAlert
```

---

### Constraint: Override Only Documented Overridable Components

MUST only override components listed as overridable in the FastStore native sections documentation. Components prefixed with `__experimental` can be overridden but their props are not accessible.

**Why this matters**
Attempting to override a component not listed as overridable will silently fail. The override configuration will be ignored and the native component will render. Components marked `__experimental` have unstable prop interfaces that may change without notice.

**Detection**
If you see a component name in the `components` override map that does not appear in the FastStore list of overridable components for that section → warn that this override may not work. If the component is prefixed with `__experimental` → warn about inaccessible props and instability.

**Correct**
```typescript
// src/components/overrides/ProductDetails.tsx
// ProductTitle is a documented overridable component of ProductDetails section
import { getOverriddenSection } from '@faststore/core'
import { ProductDetailsSection } from '@faststore/core'

const OverriddenProductDetails = getOverriddenSection({
  Section: ProductDetailsSection,
  components: {
    ProductTitle: {
      props: {
        refNumber: true,
        showDiscountBadge: false,
      },
    },
  },
})

export default OverriddenProductDetails
```

**Wrong**
```typescript
// src/components/overrides/ProductDetails.tsx
// "InternalPriceCalculator" is NOT a documented overridable component
import { getOverriddenSection } from '@faststore/core'
import { ProductDetailsSection } from '@faststore/core'

const OverriddenProductDetails = getOverriddenSection({
  Section: ProductDetailsSection,
  components: {
    // This component name does not exist in the overridable list.
    // The override will be silently ignored.
    InternalPriceCalculator: { Component: MyPriceCalculator },
  },
})

export default OverriddenProductDetails
```

## Preferred pattern

Recommended file layout:

```text
src/
├── components/
│   ├── overrides/
│   │   ├── ProductDetails.tsx    ← override file (named after section)
│   │   ├── Alert.tsx
│   │   └── simple-alert.module.scss
│   ├── CustomBuyButton.tsx       ← custom component
│   └── BoldIcon.tsx
```

Minimal override — replace a component:

```typescript
// src/components/overrides/ProductDetails.tsx
import { getOverriddenSection } from '@faststore/core'
import { ProductDetailsSection } from '@faststore/core'

import CustomBuyButton from '../CustomBuyButton'

const OverriddenProductDetails = getOverriddenSection({
  Section: ProductDetailsSection,
  components: {
    BuyButton: { Component: CustomBuyButton },
  },
})

export default OverriddenProductDetails
```

Override props without replacing the component:

```typescript
// src/components/overrides/ProductDetails.tsx
import { getOverriddenSection } from '@faststore/core'
import { ProductDetailsSection } from '@faststore/core'

const OverriddenProductDetails = getOverriddenSection({
  Section: ProductDetailsSection,
  components: {
    BuyButton: {
      props: {
        size: 'small',
        iconPosition: 'left',
      },
    },
  },
})

export default OverriddenProductDetails
```

Override with custom styling:

```typescript
// src/components/overrides/Alert.tsx
import { getOverriddenSection } from '@faststore/core'
import { AlertSection } from '@faststore/core'
import styles from './simple-alert.module.scss'

import BoldIcon from '../BoldIcon'

const OverriddenAlert = getOverriddenSection({
  Section: AlertSection,
  className: styles.simpleAlert,
  components: {
    Icon: { Component: BoldIcon },
  },
})

export default OverriddenAlert
```

## Common failure modes

- Monkey-patching `node_modules/@faststore/` or using `patch-package` for changes the override system supports. Changes are lost on install and create maintenance burden.
- Using CSS `!important` to force visual changes instead of the override API for behavioral changes or design tokens for visual changes.
- Creating wrapper components around native sections instead of using `getOverriddenSection()`. Wrappers bypass CMS integration, analytics tracking, and section discovery.
- Placing override files outside `src/components/overrides/` — they will be silently ignored.
- Overriding a component name not listed in the FastStore overridable components documentation — the override is silently ignored.

## Review checklist

- [ ] Is the override file located in `src/components/overrides/` and named after the target section?
- [ ] Does the file use `getOverriddenSection()` from `@faststore/core`?
- [ ] Are all overridden component names documented as overridable for that section?
- [ ] Are imports only from `@faststore/core` or `@faststore/core/experimental` (not internal source paths)?
- [ ] Could this change be achieved with design tokens instead of an override?
- [ ] Does the override export as default?

## Reference

- [Overrides overview](https://developers.vtex.com/docs/guides/faststore/overrides-overview) — Introduction to the FastStore override system and when to use it
- [getOverriddenSection function](https://developers.vtex.com/docs/guides/faststore/overrides-getoverriddensection-function) — API reference for the core override function
- [Override native components and props](https://developers.vtex.com/docs/guides/faststore/overrides-components-and-props-v1) — Step-by-step guide for overriding component props
- [Override a native component](https://developers.vtex.com/docs/guides/faststore/overrides-native-component) — Guide for replacing a native component entirely
- [List of native sections and overridable components](https://developers.vtex.com/docs/guides/faststore/building-sections-list-of-native-sections) — Complete reference of which components can be overridden per section
- [Creating a new section](https://developers.vtex.com/docs/guides/faststore/building-sections-creating-a-new-section) — Guide for creating custom sections when overrides are insufficient
- [Troubleshooting overrides](https://developers.vtex.com/docs/troubleshooting/my-store-does-not-reflect-the-overrides-i-created) — Common issues and solutions when overrides don't work
- [`faststore-theming`](../faststore-theming/SKILL.md) — Related skill for visual customizations that don't require overrides
