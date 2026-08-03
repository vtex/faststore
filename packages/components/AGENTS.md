# AGENTS.md — `@faststore/components`

> Inherits from [`/AGENTS.md`](../../AGENTS.md) (root). This file adds context specific to the `@faststore/components` library.

## Purpose

`@faststore/components` is the **structure layer** of the FastStore design system. It builds component structure and functionality **without styling**. Styling lives in `@faststore/ui`.

When working in this package, follow these conventions in addition to the root principles.

## Two-Package Architecture

FastStore components are split across two complementary packages:

### `@faststore/components` (Structure Layer — this package)

**Responsibilities:**

- JSX structure and markup
- Component logic, hooks, and utilities
- Data attributes for styling hooks
- Semantic HTML for accessibility
- **No default styles applied**

**Key features:**

- All components accept `className` prop for custom styling
- Extensive use of data attributes for:
  - Component identification: `data-fs-{component-name}`
  - Internal structures: `data-fs-{component-name}-{internal-structure}`
  - Component states: `data-fs-{component-name}-{state}={value}`

### `@faststore/ui` (Styling Layer — sibling package)

Provides styling through two distinct layers:

1. **Structural Styles (Brandless):** minimum necessary styling for components to function.
2. **Themification:** additional customizable styles via theme templates (Soft Blue, Midnight, etc.).

**Global Tokens** ensure consistency across colors, typography, spacing, borders, and shadows. Always use global tokens to maintain compatibility with Themification.

## Atomic Design Pattern

`@faststore/components` follows Atomic Design hierarchically:

- **Atoms** (`src/atoms/`): basic building blocks — Button, Icon, Input, Label
- **Molecules** (`src/molecules/`): composite components — Accordion, CartItem, SearchInput
- **Organisms** (`src/organisms/`): complex feature components — ImageGallery, PriceRange, ProductShelf

**Key benefit:** when you update an atom like `Button`, all components that use it (like `IconButton`) automatically inherit those updates.

## Data Attributes Naming Convention

Follow this strict pattern:

| Context            | Pattern                                    | Example                            |
| ------------------ | ------------------------------------------ | ---------------------------------- |
| Root element       | `data-fs-{component-name}`                 | `data-fs-badge`                    |
| Internal structure | `data-fs-{component-name}-{structure}`     | `data-fs-badge-wrapper`            |
| Component state    | `data-fs-{component-name}-{state}={value}` | `data-fs-button-variant="primary"` |

**Example — `Button` data attributes:**

```typescript
// packages/components/src/atoms/Button/Button.tsx

export type Variant = 'primary' | 'secondary' | 'tertiary'
export type Size = 'small' | 'regular'
export type IconPosition = 'left' | 'right'

<button
  ref={ref}
  data-fs-button                          // Root identifier
  data-fs-button-inverse={inverse}        // State
  data-fs-button-size={size}              // Size variant
  data-fs-button-loading={loading}        // Loading state
  data-fs-button-variant={variant}        // Variant state
  disabled={disabled}
  data-testid={testId}
  {...otherProps}
>
  <div data-fs-button-wrapper>            // Internal structure
    {loading && (
      <p data-fs-button-loading-label>    // Internal structure
        {loadingLabel}
        <Loader variant={variant === 'primary' && !inverse ? 'light' : 'dark'} />
      </p>
    )}
    {!!icon && iconPosition === 'left' && (
      <span data-fs-button-icon>{icon}</span>
    )}
    {children && <span>{children}</span>}
    {!!icon && iconPosition === 'right' && (
      <span data-fs-button-icon>{icon}</span>
    )}
  </div>
</button>
```

## Implementing a New Component

### Step 1: Categorize the component

- **Atoms:** basic elements that can't be broken down further (Button, Input, Icon)
- **Molecules:** combinations of atoms serving a specific purpose (SearchInput, ProductCard)
- **Organisms:** complex sections combining molecules/atoms (CartSidebar, ImageGallery)

> Tip: if unsure, consult the FastStore team. Generally, if it uses other components, it's at least a molecule.

### Step 2: Create the structure (`@faststore/components`)

**Location:** `packages/components/src/{category}/{ComponentName}/`

Files to create:

- `ComponentName.tsx` — component implementation
- `index.ts` — exports

**Example `index.ts`:**

```typescript
// packages/components/src/atoms/Badge/index.ts
export { default } from "./Badge";
export type { BadgeProps } from "./Badge";
```

**Implementation guidelines:**

1. **Reuse existing components** whenever possible.
2. **Use semantic HTML** for accessibility and readability.

   ```tsx
   // Good
   <button>Click me</button>
   <nav>...</nav>

   // Avoid
   <div onClick={...}>Click me</div>
   ```

3. **Accessibility first:** provide ARIA attributes, full keyboard navigation, logical focus order, screen reader compatibility, sufficient color contrast.
4. **Define props interface** as `{ComponentName}Props`:

   ```typescript
   export interface BadgeProps {
     variant?: "success" | "warning" | "danger";
     size?: "small" | "big";
     children: ReactNode;
     className?: string;
   }
   ```

5. **Single Responsibility Principle.**
6. **Composability** — design components to work well together.
7. **Composed components pattern** for complex components:

   ```tsx
   <Accordion>
     <AccordionItem>
       <AccordionButton>Title</AccordionButton>
       <AccordionPanel>Content</AccordionPanel>
     </AccordionItem>
   </Accordion>
   ```

**Export from the root barrel:**

```typescript
// packages/components/src/index.ts
export { Badge } from "./atoms/Badge";
export type { BadgeProps } from "./atoms/Badge";
```

**Build:**

```bash
cd packages/components
pnpm build
```

### Step 3: Add styling (`@faststore/ui`)

**Location:** `packages/ui/src/components/{category}/{ComponentName}/styles.scss`

**Structure:**

```scss
// packages/ui/src/components/atoms/Badge/styles.scss

[data-fs-badge] {
  // --------------------------------------------------------
  // Design Tokens for Badge
  // --------------------------------------------------------

  // Map local tokens to global tokens
  --fs-badge-padding: var(--fs-spacing-0) var(--fs-spacing-2);
  --fs-badge-border-radius: var(--fs-border-radius-pill);
  --fs-badge-border-width: 0;
  --fs-badge-border-style: none;
  --fs-badge-border-color: transparent;
  --fs-badge-bkg-color: var(--fs-color-neutral-bkg);
  --fs-badge-text-color: var(--fs-color-text);
  --fs-badge-text-size: var(--fs-text-size-tiny);
  --fs-badge-text-weight: var(--fs-text-weight-bold);

  // --------------------------------------------------------
  // Structural Styles
  // --------------------------------------------------------

  width: fit-content;
  height: fit-content;
  font-size: var(--fs-badge-text-size);
  font-weight: var(--fs-badge-text-weight);
  line-height: 1;
  color: var(--fs-badge-text-color);
  text-transform: uppercase;
  white-space: nowrap;
  border: var(--fs-badge-border-width) var(--fs-badge-border-style)
    var(--fs-badge-border-color);
  border-radius: var(--fs-badge-border-radius);

  [data-fs-badge-wrapper] {
    padding: var(--fs-badge-padding);
    overflow: hidden;
    border-radius: var(--fs-badge-border-radius);
  }

  // --------------------------------------------------------
  // Variant Styles
  // --------------------------------------------------------

  &[data-fs-badge-size="big"] {
    font-size: var(--fs-badge-big-text-size);

    [data-fs-badge-wrapper] {
      padding: var(--fs-badge-big-padding);
    }
  }

  &[data-fs-badge-variant="success"] {
    color: var(--fs-badge-success-text-color);

    [data-fs-badge-wrapper] {
      background-color: var(--fs-badge-success-bkg-color);
      border-color: var(--fs-badge-success-border-color);
    }
  }
}
```

**Styling guidelines:**

1. **Always start with the root data attribute:** `[data-fs-component-name]`.
2. **Define local tokens first, mapped to global tokens:**

   ```scss
   --fs-badge-padding: var(--fs-spacing-2); // Good
   padding: 8px; // Avoid — not using tokens
   ```

3. **Not every property needs a token.** Context-specific styles can be plain:

   ```scss
   overflow: hidden;
   display: flex;
   ```

4. **Mobile-first approach:**

   ```scss
   @use "@faststore/ui/src/styles/base/utilities" as u;

   [data-fs-banner-text-content] {
     padding: var(--fs-banner-text-padding-mobile);

     @include u.media(">=notebook") {
       padding: var(--fs-banner-text-padding-desktop);
     }
   }
   ```

5. **Use `include-media` for breakpoints.** Available breakpoints: `phone`, `phoneMedium`, `tablet`, `notebook`, `desktop`. See the [styling overview](https://developers.vtex.com/docs/guides/faststore/styling-overview).

**Register the stylesheet:**

```scss
// packages/ui/src/styles/components.scss
@import "../components/atoms/Badge/styles";
```

**Test with styles** (temporary, remove before PR):

```scss
// packages/core/src/styles/global/index.scss
@import "@faststore/ui/src/components/atoms/Badge/styles.scss";
```

## Component Implementation Checklist

- [ ] Component categorized (atom/molecule/organism)
- [ ] Structure created in `@faststore/components`
- [ ] Uses semantic HTML tags
- [ ] Accessibility features implemented (ARIA, keyboard nav, focus order)
- [ ] Props interface defined as `{ComponentName}Props`
- [ ] Follows Single Responsibility Principle
- [ ] Data attributes follow the naming convention
- [ ] Accepts `className` prop
- [ ] Exported from `packages/components/src/index.ts`
- [ ] Component built successfully
- [ ] Styles added to `@faststore/ui`
- [ ] Local tokens mapped to global tokens
- [ ] Mobile-first responsive styles
- [ ] Stylesheet registered in `components.scss`
