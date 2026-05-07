# AGENTS.md - FastStore Project Guide for AI Agents

> **Purpose**: This document helps AI agents understand the FastStore codebase architecture, conventions, and workflows to provide better assistance.

## 📋 Project Overview

**FastStore** is a fullstack e-commerce toolkit built on React and Next.js that helps developers build performant, stable, SEO-ready e-commerce sites. It's a monorepo project maintained by VTEX, designed to provide everything needed to create fast, scalable online stores.

**Key Features:**
- 🚀 Performance-focused with strict budgets
- 🔒 Jamstack architecture for stability
- 📊 Analytics and SEO ready
- ⚛️ React and Next.js based
- 🎨 Customizable UI components
- 🔌 GraphQL API layer

**License**: MIT
**Repository**: https://github.com/vtex/faststore

## 🏗️ Architecture Overview

FastStore follows a layered architecture:

```
┌─────────────────────────────────────────┐
│         @faststore/core                 │
│  (Next.js app + components + pages)     │
└─────────────────────────────────────────┘
           ↓              ↓
    ┌──────────┐    ┌──────────┐
    │   SDK    │    │   API    │
    └──────────┘    └──────────┘
           ↓              ↓
    ┌──────────┐    ┌──────────┐
    │    UI    │    │ GraphQL  │
    │Components│    │  Layer   │
    └──────────┘    └──────────┘
```

### Key Architectural Patterns

1. **Component-Based**: Organized into atoms, molecules, and organisms
2. **GraphQL First**: All data fetching through GraphQL API
3. **Server-Side Rendering**: Next.js for SSR/SSG
4. **Headless CMS**: Integration with VTEX CMS
5. **Analytics Ready**: Built-in analytics hooks and events

## 📦 Monorepo Structure

FastStore uses a **pnpm workspace** monorepo managed by:
- **pnpm** (v9.15.5): Package manager
- **Lerna** (v8.1.9): Version management and publishing
- **Turbo** (v2.3.4): Build system and task orchestration
- **Biome**: Linting and formatting

### Package Organization

```
packages/
├── api/              # GraphQL API layer
├── cli/              # Command-line tools
├── components/       # React components structure layer (unstyled)
├── core/             # Main application (Next.js)
├── graphql-utils/    # GraphQL utilities
├── lighthouse/       # Performance testing
├── sdk/              # Business logic hooks
├── storybook/        # Component documentation
└── ui/               # UI components and styles layer
```

## 🎯 Key Packages

### @faststore/core
**Purpose**: Main application package bundling everything together
**Location**: `packages/core/`
**Tech**: Next.js, React, GraphQL

**Key Directories:**
- `src/components/` - Application components (sections, organisms, molecules, atoms)
- `src/pages/` - Next.js pages
- `src/sdk/` - SDK logic and hooks
- `src/server/` - Server-side utilities
- `cms/faststore/` - CMS configuration
- `@generated/` - Auto-generated GraphQL types

**Key Files:**
- `next.config.js` - Next.js configuration
- `discovery.config.default.js` - Store configuration
- `codegen.ts` - GraphQL code generation config

### @faststore/api
**Purpose**: GraphQL API layer connecting to e-commerce platforms
**Location**: `packages/api/`
**Tech**: GraphQL, TypeScript

**Key Directories:**
- `src/platforms/vtex/` - VTEX platform integration
- `src/typeDefs/` - GraphQL type definitions
- `src/directives/` - GraphQL directives (auth, caching)

**Key Files:**
- `codegen.yml` - GraphQL codegen configuration
- `src/__generated__/schema.ts` - Generated GraphQL schema

### @faststore/sdk
**Purpose**: Business logic and state management hooks
**Location**: `packages/sdk/`

**Key Modules:**
- `analytics/` - Analytics events and tracking
- `cart/` - Cart management
- `search/` - Search management
- `session/` - Session management
- `ui/` - UI state management

### @faststore/ui
**Purpose**: Base UI components and styling system
**Location**: `packages/ui/`
**Tech**: React, SCSS

**Key Directories:**
- `src/components/` - components and styles
- `src/styles/` - Global styles and variables

### @faststore/components
**Purpose**: Higher-level React components
**Location**: `packages/components/`

**Structure:**
- `atoms/` - Basic UI elements
- `molecules/` - Composite components
- `organisms/` - Complex components

### @faststore/cli
**Purpose**: Command-line interface for development
**Location**: `packages/cli/`

**Commands** (in `src/commands/`):
- Build, dev, test, cms-sync, create, generate-graphql.ts commands

## 🔄 Development Workflow

### Setup
```bash
# Install dependencies
pnpm install

# Build all packages
pnpm build

# Run development mode for all packages
pnpm dev

# Run specific package
pnpm turbo run dev --filter=@faststore/core
```

### Common Commands

```bash
# Linting
pnpm lint              # Check with Biome
pnpm lint:fix          # Auto-fix with Biome
pnpm stylelint         # Check SCSS files
pnpm stylelint:fix     # Auto-fix SCSS

# Testing
pnpm test              # Run all tests

# Building
pnpm build             # Build all packages

# Releasing
pnpm release           # Release new version (main)
pnpm release:dev       # Release dev version (dev tag)
```

### Branch Strategy

- **Main branch**: Production releases (tagged `latest`)
- **Dev branch**: Active development (tagged `dev`)
- **Feature branches**: Use `feat/`, `fix/`, `chore/` prefixes
- **Hotfixes**: Direct to main (requires communication)
- **Release cadence**: Dev → Main every 2 weeks

### Testing Changes in a Store

1. Create a PR (can be draft)
2. Find `ci/codesandbox` check → Click "Details"
3. Use "Local Install Instructions" to test in starter store
4. Update dependencies: `pnpm install`

## 📂 Code Organization

### Component Hierarchy

FastStore uses Atomic Design principles:

1. **Atoms** (`/atoms/`): Basic building blocks
   - Badge, Button, Icon, Input, Label, etc.

2. **Molecules** (`/molecules/`): Simple component combinations
   - Accordion, CartItem, SearchInput, ProductCard, etc.

3. **Organisms** (`/organisms/`): Complex feature components
   - ImageGallery, PriceRange, ProductShelf, etc.

4. **Sections** (`/sections/` in core): Page sections
   - ProductDetails, Hero, Newsletter, etc.

### File Naming Conventions

- **Components**: PascalCase (e.g., `ProductCard.tsx`)
- **Hooks**: camelCase with "use" prefix (e.g., `useFormattedPrice.ts`)
- **Utilities**: camelCase (e.g., `formatPrice.ts`)
- **Styles**: Match component name (e.g., `ProductCard.scss`)
- **Tests**: Match source with `.test.` (e.g., `ProductCard.test.tsx`)

### GraphQL Conventions

- **Queries**: Defined in `src/typeDefs/` as `.graphql` files
- **Generated types**: In `@generated/` directories (DO NOT edit manually)
- **Codegen**: Run `pnpm generate:codegen` to regenerate types
- **Schema**: Auto-generated from type definitions

## 🎨 Common Patterns

### Patterns for @faststore/core (Application Layer)

These patterns are used when building sections, pages, and features in `@faststore/core`:

#### 1. Section/Page Component with SCSS Modules

```typescript
// Used in: packages/core/src/components/sections/
import { ComponentType } from 'react'
import styles from './section.module.scss'

export interface ProductDetailsProps {
  // Props definition
  productTitle: { ... }
  buyButton: { ... }
}

function ProductDetails({ productTitle, buyButton }: ProductDetailsProps) {
  // Application logic
  return (
    <Section className={styles.section}>
      {/* JSX using library components */}
    </Section>
  )
}

export default ProductDetails
```

#### 2. Composing with Library Components

```typescript
// Used in: packages/core/src/components/ui/
import {
  Accordion as UIAccordion,
  AccordionButton as UIAccordionButton,
  AccordionItem as UIAccordionItem,
  AccordionPanel as UIAccordionPanel,
} from '@faststore/ui'

function ProductDescription({ descriptionData }: Props) {
  return (
    <UIAccordion>
      <UIAccordionItem>
        <UIAccordionButton>Title</UIAccordionButton>
        <UIAccordionPanel>Content</UIAccordionPanel>
      </UIAccordionItem>
    </UIAccordion>
  )
}

export default ProductDescription
```

### Patterns for @faststore/components (Library Layer)

These patterns are used when **contributing new components** to the component library:

#### 3. Unstyled Component with Data Attributes
```typescript
// Used in: packages/components/src/{category}/{ComponentName}/
import type { HTMLAttributes } from 'react'
import React, { forwardRef } from 'react'

export interface BadgeProps extends HTMLAttributes<HTMLDivElement> {
  size?: 'small' | 'big'
  variant?: 'info' | 'success' | 'warning'
}

const Badge = forwardRef<HTMLDivElement, BadgeProps>(function Badge(
  { size = 'small', variant = 'info', children, ...otherProps },
  ref
) {
  return (
    <div
      ref={ref}
      data-fs-badge                    // Root identifier
      data-fs-badge-size={size}        // State attribute
      data-fs-badge-variant={variant}  // State attribute
      {...otherProps}                  // Accepts className
    >
      <div data-fs-badge-wrapper>      // Internal structure
        {children}
      </div>
    </div>
  )
})

export default Badge
// Note: No style imports in this package.
```

#### 4. Custom Hooks

```typescript
// SDK hooks pattern (used in both core and library)
export function useFormattedPrice(price: number) {
  const { currency } = useSession()

  return useMemo(
    () => formatPrice(price, currency),
    [price, currency]
  )
}
```

#### 5. GraphQL Query Pattern

```graphql
# Define query in .graphql file
query GetProduct($id: ID!) {
  product(id: $id) {
    id
    name
    price
  }
}
```

```typescript
// Use generated types
import { useQuery } from '@faststore/sdk'
import type { GetProductQuery } from '@generated/graphql'

const { data } = useQuery<GetProductQuery>(GET_PRODUCT_QUERY, { id })
```

#### 6. Analytics Events

```typescript
import { sendAnalyticsEvent } from '@faststore/sdk'

// Send custom analytics event
sendAnalyticsEvent({
  name: 'event_name',
  params: { /* event data */ }
})
```

#### 7. Section Configuration

Sections are configured in `packages/core/cms/faststore/sections.json`:
- Defines available sections for CMS
- Specifies props and their types
- Controls what can be customized

## 🧩 FastStore Components Implementation Guidelines

> **⚠️ Important Context**: This section describes how to **contribute new components to the `@faststore/components` library**. If you're building features in your store using `@faststore/core`, see the [Common Patterns](#-common-patterns) section instead.

### Atomic Design Pattern

FastStore UI is designed and built following the **Atomic Design** pattern, which breaks user interfaces hierarchically into smaller and simpler components:

- **Atoms**: Basic building blocks (e.g., Button, Icon, Input, Label)
- **Molecules**: Simple component combinations (e.g., Accordion, CartItem, SearchInput)
- **Organisms**: Complex feature components (e.g., ImageGallery, PriceRange, ProductShelf)

**Key Benefit**: When you update an atom like `Button`, all components that use it (like `IconButton`) automatically inherit those updates, streamlining maintenance and keeping the design system cohesive.

### Two-Package Architecture

FastStore components are split across two complementary packages:

#### @faststore/components (Structure Layer)

**Purpose**: Builds component structure and functionality without styling.

**Responsibilities**:
- JSX structure and markup
- Component logic, hooks, and utilities
- Data attributes for styling hooks
- Semantic HTML for accessibility
- No default styles applied

**Key Features**:
- All components accept `className` prop for custom styling
- Extensive use of data attributes for:
  - Component identification: `data-fs-{component-name}`
  - Internal structures: `data-fs-{component-name}-{internal-structure}`
  - Component states: `data-fs-{component-name}-{state}={value}`

**Example - Button Component Data Attributes**:

```typescript
// packages/components/src/atoms/Button/Button.tsx

export type Variant = 'primary' | 'secondary' | 'tertiary'
export type Size = 'small' | 'regular'
export type IconPosition = 'left' | 'right'

<button
  ref={ref}
  data-fs-button                          // Root component identifier
  data-fs-button-inverse={inverse}        // State attribute
  data-fs-button-size={size}              // Size variant
  data-fs-button-loading={loading}        // Loading state
  data-fs-button-variant={variant}        // Variant state
  disabled={disabled}
  data-testid={testId}
  {...otherProps}
>
  <div data-fs-button-wrapper>           // Internal structure
    {loading && (
      <p data-fs-button-loading-label>    // Internal structure
        {loadingLabel}
        <Loader variant={variant === 'primary' && !inverse ? 'light' : 'dark'} />
      </p>
    )}
    {!!icon && iconPosition === 'left' && (
      <span data-fs-button-icon>{icon}</span>  // Internal structure
    )}
    {children && <span>{children}</span>}
    {!!icon && iconPosition === 'right' && (
      <span data-fs-button-icon>{icon}</span>
    )}
  </div>
</button>
```

#### @faststore/ui (Styling Layer)

**Purpose**: Provides styling through two distinct layers.

**1. Structural Styles (Brandless)**:
- Minimum necessary styling for components to function
- Default baseline appearance
- Foundation for customization

**2. Themification**:
- Additional customizable styles
- Theme templates available (Soft Blue, Midnight, etc.)
- Project-specific customization

**Global Tokens**: FastStore uses global design tokens for consistency across:
- Colors
- Typography
- Spacing
- Borders
- Shadows

**Important**: Always use global tokens when creating new components to ensure compatibility with Themification and maintain design consistency.

### Data Attributes Naming Convention

Follow this strict pattern for data attributes:

| Context | Pattern | Example |
|---------|---------|---------|
| Root element | `data-fs-{component-name}` | `data-fs-badge` |
| Internal structure | `data-fs-{component-name}-{structure}` | `data-fs-badge-wrapper` |
| Component state | `data-fs-{component-name}-{state}={value}` | `data-fs-button-variant="primary"` |

### Implementing a New Component

#### Step 1: Categorize the Component

Determine the atomic level:
- **Atoms**: Basic elements that can't be broken down further (Button, Input, Icon)
- **Molecules**: Combinations of atoms serving a specific purpose (SearchInput, ProductCard)
- **Organisms**: Complex sections combining molecules/atoms (CartSidebar, ImageGallery)

> **Tip**: If unsure, consult with the FastStore team. Generally, if it uses other components, it's at least a molecule.

#### Step 2: Create Component Structure (@faststore/components)

**Location**: `packages/components/src/{category}/{ComponentName}/`

**Files to create**:
- `ComponentName.tsx` - Component implementation
- `index.ts` - Exports

**Example index.ts**:
```typescript
// packages/components/src/atoms/Badge/index.ts
export { default } from './Badge'
export type { BadgeProps } from './Badge'
```

**Implementation Guidelines**:

1. **Reuse Existing Components**: Leverage existing FastStore UI components whenever possible

2. **Use Semantic HTML**: Enhance accessibility and readability
   ```typescript
   // Good
   <button>Click me</button>
   <nav>...</nav>

   // Avoid
   <div onClick={...}>Click me</div>
   ```

3. **Accessibility First**:
   - Provide appropriate ARIA attributes
   - Ensure full keyboard navigation support
   - Maintain logical focus order
   - Test with screen readers
   - Ensure sufficient color contrast

4. **Define Props Interface**:
   ```typescript
   export interface BadgeProps {
     variant?: 'success' | 'warning' | 'danger'
     size?: 'small' | 'big'
     children: ReactNode
     className?: string
   }
   ```

5. **Follow Single Responsibility Principle**: Each component should have one clear purpose

6. **Ensure Composability**: Design components to work well together

7. **Composed Components Pattern**: For complex components, break into subcomponents:
   ```typescript
   // Example: Accordion
   <Accordion>
     <AccordionItem>
       <AccordionButton>Title</AccordionButton>
       <AccordionPanel>Content</AccordionPanel>
     </AccordionItem>
   </Accordion>
   ```

**Export the Component**:
```typescript
// packages/components/src/index.ts
export { Badge } from './atoms/Badge'
export type { BadgeProps } from './atoms/Badge'
```

**Build and Test**:
```bash
cd packages/components
yarn build
```

**Create Test Page** (temporary, for development):
```typescript
// packages/core/src/pages/component.tsx
import { NewComponent } from '@faststore/ui'

function Page() {
  return <NewComponent />
}

export default Page
```

```bash
cd packages/core
yarn dev
# Navigate to http://localhost:3000/component
```

> **Note**: Delete this test page before submitting PR.

#### Step 3: Add Styling (@faststore/ui)

**Location**: `packages/ui/src/components/{category}/{ComponentName}/styles.scss`

**Styling Structure**:

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
  border: var(--fs-badge-border-width) var(--fs-badge-border-style) var(--fs-badge-border-color);
  border-radius: var(--fs-badge-border-radius);

  [data-fs-badge-wrapper] {
    padding: var(--fs-badge-padding);
    overflow: hidden;  // No token needed for context-specific styles
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

**Styling Guidelines**:

1. **Always Start with Root Data Attribute**: `[data-fs-component-name]`

2. **Define Local Tokens First**: Map to global tokens for consistency
   ```scss
   --fs-badge-padding: var(--fs-spacing-2);  // Good
   padding: 8px;  // Avoid - not using tokens
   ```

3. **Not Every Property Needs a Token**: Context-specific styles don't require tokens
   ```scss
   overflow: hidden;  // OK without token
   display: flex;     // OK without token
   ```

4. **Mobile-First Approach**: Define mobile styles first, then add breakpoints
   ```scss
   [data-fs-banner-text-content] {
     padding: var(--fs-banner-text-padding-mobile);

     @include media(">=notebook") {
       padding: var(--fs-banner-text-padding-desktop);
     }
   }
   ```

5. **Use include-media for Breakpoints**:
   - Available breakpoints: `phone`, `phoneMedium`, `tablet`, `notebook`, `desktop`
   - See official docs for further reference: https://developers.vtex.com/docs/guides/faststore/styling-overview

**Register the Stylesheet**:
```scss
// packages/ui/src/styles/components.scss
@import "../components/atoms/Badge/styles";
```

**Test with Styles** (temporary):
```scss
// packages/core/src/styles/global/index.scss
@import '@faststore/ui/src/components/atoms/Badge/styles.scss';
```

> **Note**: Remove this import before submitting PR.

#### Step 4: Add Tests

**Location**: `packages/components/test/{category}/{ComponentName}/{ComponentName}.test.tsx`

**Test Requirements**:

```typescript
// packages/components/test/atoms/Button/Button.test.tsx
import { render, screen } from '@testing-library/react'
import { axe } from 'jest-axe'
import Button from '../../../src/atoms/Button'

describe('Button', () => {
  describe('Rendering', () => {
    it('renders with default props', () => {
      render(<Button>Click me</Button>)
      expect(screen.getByRole('button')).toBeInTheDocument()
    })

    it('renders with different variants', () => {
      const { rerender } = render(<Button variant="primary">Primary</Button>)
      expect(screen.getByRole('button')).toHaveAttribute('data-fs-button-variant', 'primary')

      rerender(<Button variant="secondary">Secondary</Button>)
      expect(screen.getByRole('button')).toHaveAttribute('data-fs-button-variant', 'secondary')
    })
  })

  describe('Prop Handling', () => {
    it('applies custom className', () => {
      render(<Button className="custom-class">Button</Button>)
      expect(screen.getByRole('button')).toHaveClass('custom-class')
    })

    it('handles disabled state', () => {
      render(<Button disabled>Disabled</Button>)
      expect(screen.getByRole('button')).toBeDisabled()
    })
  })

  describe('Accessibility', () => {
    it('should not have accessibility violations', async () => {
      const { container } = render(<Button>Accessible Button</Button>)
      const results = await axe(container)
      expect(results).toHaveNoViolations()
    })
  })
})
```

**Test Guidelines**:
- **Render Tests**: Verify component renders correctly with different props
- **Prop Handling**: Test component behavior based on props
- **Accessibility**: Include `jest-axe` tests for a11y compliance
- **Structure**: Use `describe` blocks for organization

**Run Tests**:
```bash
cd packages/components
yarn test
```

**Reference Examples**:
- `packages/components/test/atoms/Card/Card.test.tsx`
- `packages/components/test/molecules/CheckboxField/CheckboxField.test.tsx`

### Component Implementation Checklist

- [ ] Component categorized (atom/molecule/organism)
- [ ] Structure created in `@faststore/components`
- [ ] Uses semantic HTML tags
- [ ] Accessibility features implemented (ARIA, keyboard nav, focus order)
- [ ] Props interface defined as `{ComponentName}Props`
- [ ] Follows Single Responsibility Principle
- [ ] Data attributes follow naming convention
- [ ] Accepts `className` prop
- [ ] Exported from `packages/components/src/index.ts`
- [ ] Component built successfully
- [ ] Styles added to `@faststore/ui`
- [ ] Local tokens mapped to global tokens
- [ ] Mobile-first responsive styles
- [ ] Stylesheet registered in `components.scss`
- [ ] Tests created with render, prop, and accessibility checks
- [ ] All tests passing
- [ ] Temporary test files removed

## 📍 Important Files and Directories

### Configuration Files

| File | Purpose |
|------|---------|
| `biome.json` | Code linting and formatting config |
| `turbo.json` | Monorepo build orchestration |
| `lerna.json` | Package versioning and publishing |
| `pnpm-workspace.yaml` | Workspace package definitions |
| `tsconfig.json` | Root TypeScript configuration |
| `stylelint.config.js` | SCSS linting rules |

### Core Package Key Files

| File | Purpose |
|------|---------|
| `packages/core/next.config.js` | Next.js app configuration |
| `packages/core/discovery.config.default.js` | Discovery/routing config |
| `packages/core/cms/faststore/sections.json` | CMS sections definition (2719 lines) |
| `packages/core/src/Layout.tsx` | Main layout component |
| `packages/core/src/constants.ts` | App constants |

### Generated Files (DO NOT EDIT)

- `packages/core/@generated/` - GraphQL types
- `packages/api/src/__generated__/` - API schema
- `dist/` directories - Build outputs
- `node_modules/` - Dependencies

## 🛠️ Tech Stack

### Frontend
- **React 18.2.0**: UI library
- **Next.js 13.5.9**: Framework (SSR/SSG)
- **TypeScript 5.3.2**: Type safety
- **SCSS/Sass**: Styling
- **SWR 2.2.5**: Data fetching

### GraphQL
- **GraphQL 15.6.0**: Query language
- **GraphQL Codegen**: Type generation
- **Envelop**: GraphQL plugin system
- **GraphQL Tools**: Schema utilities

### Build Tools
- **Turbo**: Monorepo orchestration
- **pnpm**: Package management
- **Lerna**: Publishing
- **Biome**: Linting/formatting

### Testing
- **Jest**: Unit testing
- **Cypress**: E2E testing
- **Testing Library**: Component testing
- **Lighthouse**: Performance testing

### Other
- **Lexical**: Rich text editor
- **Partytown**: Third-party script optimization
- **Sharp**: Image optimization

## 🧪 Testing

### Unit Tests
```bash
# Run all unit tests
pnpm test

# Test specific package
pnpm turbo run test --filter=@faststore/sdk
```

### E2E Tests (Cypress)
```bash
# In packages/core
pnpm test:e2e
```

### Performance Tests (Lighthouse)
```bash
# In packages/core
pnpm lhci
```

### Test File Locations
- `test/` directories in each package
- `*.test.ts` or `*.test.tsx` alongside source files
- `cypress/` directory in core package

## 🗺️ Navigation Tips for AI Agents

### Finding Components

1. **Base UI components**: `packages/ui/src/components/`
2. **React components**: `packages/components/src/`
3. **Core sections**: `packages/core/src/components/sections/`
4. **Page components**: `packages/core/src/pages/`

### Finding Business Logic

1. **Hooks**: `packages/sdk/src/` (analytics, cart, search, session)
2. **Core SDK**: `packages/core/src/sdk/`
3. **Utilities**: `packages/core/src/utils/`

### Finding API/GraphQL

1. **Type definitions**: `packages/api/src/typeDefs/`
2. **Platform integration**: `packages/api/src/platforms/vtex/`
3. **Directives**: `packages/api/src/directives/`
4. **Generated types**: Look for `@generated/` or `__generated__/` directories

### Finding Styles

1. **UI styles**: `packages/ui/src/components/` (SCSS files alongside components)
2. **Global styles**: `packages/ui/src/styles/`
3. **Core styles**: `packages/core/src/styles/`
4. **Component styles**: Usually `ComponentName.scss` next to `ComponentName.tsx`

### Finding Configuration

1. **CMS config**: `packages/core/cms/faststore/sections.json`
2. **Next.js**: `packages/core/next.config.js`
3. **Discovery**: `packages/core/discovery.config.default.js`
4. **GraphQL codegen**: `packages/core/codegen.ts` or `packages/api/codegen.yml`

## 🔍 Common Tasks for AI Agents

### 1. Adding a New Library Component (@faststore/components)

> **⚠️ IMPORTANT**: This is for contributing to the FastStore library itself. For store-level components, see task #7 below.

Before implementing a component, review the comprehensive **[FastStore Components Implementation Guidelines](#-faststore-components-implementation-guidelines)** section above for detailed instructions.

**Quick Reference**:
- **Structure**: `packages/components/src/{category}/{ComponentName}/`
- **Styles**: `packages/ui/src/components/{category}/{ComponentName}/styles.scss`
- **Tests**: `packages/components/test/{category}/{ComponentName}/{ComponentName}.test.tsx`

**Abbreviated Steps**:
1. Categorize component (atom/molecule/organism)
2. Create structure in `@faststore/components` with data attributes
3. Add styles in `@faststore/ui` using global tokens
4. Write tests (render, props, accessibility)
5. Export from `index.ts` files
6. Build and verify

**See Full Guidelines**: Refer to the [Component Implementation Checklist](#component-implementation-checklist) for complete details.

### 2. Modifying GraphQL Schema

**Location**: `packages/api/src/typeDefs/`
**Files**: `.graphql` files

**Steps**:
1. Edit `.graphql` type definition
2. Run `pnpm generate:schema` (in api package)
3. Run `pnpm generate:codegen` (in core package)
4. Check `@generated/` for new types

### 3. Adding a Section (@faststore/core)

**Location**: `packages/core/src/components/sections/`
**Config**: `packages/core/cms/faststore/sections.json`

**Steps**:
1. Create section component (uses SCSS modules)
2. Compose with library components from `@faststore/ui`
3. Add section definition to `sections.json`
4. Define props and schema
5. Export from component index

### 4. Adding Analytics Event

**Location**: `packages/sdk/src/analytics/`

**Steps**:
1. Define event type in analytics module
2. Create event sender function
3. Dispatch event in appropriate component/hook

### 5. Updating Styles

**For library components** (`@faststore/ui`):
- Edit `.scss` file in `packages/ui/src/components/`
- Use global tokens
- Follow data attribute selectors

**For core/sections** (`@faststore/core`):
- Edit `.module.scss` file alongside component
- Import library styles as needed
- Use local CSS modules pattern

**For global styles**: Edit `packages/ui/src/styles/`

**Note**: Uses SCSS with `include-media` for responsive design

### 6. Adding a Page (@faststore/core)

**Location**: `packages/core/src/pages/`
**Framework**: Next.js file-based routing

**Steps**:
1. Create page file (e.g., `product/[slug].tsx`)
2. Use Next.js conventions (getStaticProps, etc.)
3. Compose with sections and components
4. Follow existing page patterns

### 7. Adding a Store-Specific Component (@faststore/core)

**Location**: `packages/core/src/components/ui/` or `/sections/`

**Steps**:
1. Create component file with `.module.scss` for styles
2. Import and compose library components from `@faststore/ui`
3. Use TypeScript for props
4. Follow core patterns (not library patterns)

## ⚠️ Important Considerations

### DO NOT Edit

- `@generated/` or `__generated__/` directories
- `dist/` directories
- Files with "auto-generated" comments
- `node_modules/`

### Always Check

- **Linting**: Run `pnpm lint` before committing
- **Type safety**: Ensure TypeScript compiles
- **Tests**: Run relevant tests
- **Build**: Verify builds succeed

### Performance Budgets

FastStore has strict performance budgets. Be mindful of:
- Bundle size when adding dependencies
- Image optimization requirements
- Code splitting strategies
- Lighthouse scores

### Platform Integration

- Most code is platform-agnostic
- Platform-specific code lives in `packages/api/src/platforms/`
- Currently focused on VTEX platform

## 📚 Additional Resources

- **Documentation**: https://developers.vtex.com/docs/guides/faststore/getting-started-overview
- **Starter Store**: https://github.com/vtex-sites/starter.store
- **Issues**: https://github.com/vtex/faststore/issues
- **Discussions**: https://github.com/vtex/faststore/discussions

## 🎯 Quick Reference

### Package Import Paths

```typescript
// Import from SDK
import { useCart } from '@faststore/sdk'

// Import from UI
import { Button } from '@faststore/ui'

// Import from API (in core)
import { API } from '@faststore/api'

// Import from core (in other packages)
import { Layout } from '@faststore/core'
```

### When to Use Which Package

| Task | Package | Pattern | Styling |
|------|---------|---------|---------|
| Creating reusable component for FastStore library | `@faststore/components` | Data attributes, no styles | Add to `@faststore/ui` |
| Building store section/page | `@faststore/core` | SCSS modules | `.module.scss` files |
| Creating store-specific UI component | `@faststore/core` | Compose library components | SCSS modules or library styles |
| Adding global styles/tokens | `@faststore/ui` | Global tokens | `src/styles/` |

### Environment Variables

Check these locations:
- `packages/core/vtex.env`
- `.env.local` (not in repo, user-created)
- `turbo.json` - globalEnv section

### Version Management

- All packages synchronized at same version
- Managed by Lerna
- Follows Conventional Commits for changelogs
- Semantic versioning

---

**Last Updated**: December 2025
**FastStore Version**: 3.95.0
**Maintained by**: FS Discovey Team

This guide is intended to help AI agents provide better assistance when working with the FastStore codebase.


