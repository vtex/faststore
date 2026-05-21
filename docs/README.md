# FastStore Component Documentation

Welcome to the FastStore component documentation. This documentation covers **~140 components** across two architectural layers.

## Documentation Structure

### 🧱 [Foundational Components](./components/README.md)

Presentational UI components from `@faststore/components` and `@faststore/ui` packages. These are framework-agnostic, reusable components organized by atomic design principles.

- **[Atoms](./components/atoms/)** - Basic building blocks (18 components)
- **[Molecules](./components/molecules/)** - Composed components (43 components)  
- **[Organisms](./components/organisms/)** - Feature-level components (20 components)

### ⚡ [Matter Components](./matter/README.md)

Integrated components from `@faststore/core` that combine foundational UI with business logic, data fetching, analytics, and CMS configuration.

- **[Cart](./matter/cart/)** - Shopping cart integration (5 components)
- **[Navigation](./matter/navigation/)** - Site navigation (3 components)
- **[Product](./matter/product/)** - Product display with data (4 components)
- **[Region](./matter/region/)** - Location/region selection (6 components)
- **[Search](./matter/search/)** - Search functionality (9 components)
- **[Sections](./matter/sections/)** - CMS-configurable page sections (18 components)
- **[Templates](./matter/templates/)** - Page templates (3 components)
- **[UI Wrappers](./matter/ui/)** - Next.js-integrated components (20 components)

## Architecture Overview

```
┌─────────────────────────────────────────────────────────────┐
│                      Matter Layer                           │
│  (packages/core/src/components)                             │
│                                                             │
│  ┌─────────┐ ┌─────────┐ ┌─────────┐ ┌─────────┐           │
│  │Sections │ │Templates│ │ Domain  │ │   UI    │           │
│  │(CMS)    │ │(Pages)  │ │(Cart,   │ │Wrappers │           │
│  │         │ │         │ │Product) │ │(Next.js)│           │
│  └────┬────┘ └────┬────┘ └────┬────┘ └────┬────┘           │
│       │           │           │           │                 │
│       └───────────┴─────┬─────┴───────────┘                 │
│                         │                                   │
│         ┌───────────────┼───────────────┐                   │
│         │               │               │                   │
│    ┌────▼────┐    ┌─────▼─────┐   ┌─────▼─────┐            │
│    │GraphQL  │    │  SDK      │   │ Analytics │            │
│    │Queries  │    │  Hooks    │   │  Events   │            │
│    └─────────┘    └───────────┘   └───────────┘            │
└─────────────────────────┬───────────────────────────────────┘
                          │
                          ▼
┌─────────────────────────────────────────────────────────────┐
│                  Foundational Layer                         │
│  (packages/components + packages/ui)                        │
│                                                             │
│  ┌─────────┐    ┌─────────────┐    ┌─────────────┐         │
│  │  Atoms  │───▶│  Molecules  │───▶│  Organisms  │         │
│  │(Button, │    │(ProductCard,│    │(Navbar,     │         │
│  │ Input)  │    │ Modal)      │    │ Hero)       │         │
│  └─────────┘    └─────────────┘    └─────────────┘         │
└─────────────────────────────────────────────────────────────┘
```

## Key Concepts

### Foundational Components
Pure presentational components that handle UI rendering and user interactions. They are:
- Framework-agnostic
- Style-able via CSS custom properties
- Accessible by default
- Testable via data attributes

### Matter Components
Integration layer components that extend foundational components with:
- **Data Fetching**: GraphQL queries and fragments
- **State Management**: SDK hooks for cart, session, analytics
- **Analytics**: Automatic event tracking
- **CMS Integration**: Configuration schemas for content management
- **Next.js Features**: Optimized images, routing, server-side rendering

## Usage Patterns

### When to use Foundational Components
- Building custom ecommerce experiences
- Need full control over styling
- Using with custom data sources
- Building design systems

### When to use Matter Components
- Building on top of FastStore architecture
- Need out-of-the-box analytics
- Using VTEX or similar platforms
- Want CMS-configurable sections

## Contributing

When documenting components, follow the specification templates:
- **Foundational**: Focus on props, variants, accessibility, and styling
- **Matter**: Include data integration, analytics events, and CMS configuration

## Links

- [FastStore Website](https://www.faststore.dev/)
- [GitHub Repository](https://github.com/vtex/faststore)
- [Storybook](https://faststore.dev/storybook/)
