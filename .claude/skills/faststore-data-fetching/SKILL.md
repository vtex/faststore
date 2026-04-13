---
name: faststore-data-fetching
description: "Apply when deciding, designing, or implementing data fetching with FastStore GraphQL files in src/graphql/ or src/fragments/, or configuring faststore.config. Covers API extensions, GraphQL fragments, server-side and client-side data fetching, and custom resolver patterns. Use for integrating custom data sources or extending the FastStore GraphQL schema."
---

# FastStore Data Layer & API Integration

## When this skill applies

Use this skill when:
- You need to fetch product data, extend existing queries with additional fields, or integrate third-party APIs.
- You need data beyond what native FastStore components display by default.
- You are creating API extensions in `src/graphql/vtex/` or `src/graphql/thirdParty/`.
- You are adding GraphQL fragments in `src/fragments/` to include new fields in predefined queries.
- You are writing server-side resolvers that call VTEX REST APIs or external services.

Do not use this skill for:
- Client-side state management (cart, session, search) — use the `faststore-state-management` skill.
- Visual theming — use the `faststore-theming` skill.
- Component replacement or props overriding — use the `faststore-overrides` skill.

## Decision rules

- Use the FastStore GraphQL API for all catalog data (products, collections, search results, prices) — never make direct REST calls from client-side code.
- Use VTEX API extensions (`src/graphql/vtex/`) when accessing VTEX platform data not exposed by default (e.g., custom product fields, installment details).
- Use third-party API extensions (`src/graphql/thirdParty/`) when integrating external data sources (e.g., reviews, ratings, external inventory).
- Use server fragments (`src/fragments/ServerProduct.ts`) for data needed at page load (SSR).
- Use client fragments (`src/fragments/ClientProduct.ts`) for data that can load after initial render.
- Keep API keys and secrets in server-side resolvers only — never in client-side code or `NEXT_PUBLIC_` environment variables.
- Do not create custom Next.js API routes (`pages/api/`) — use the API extension system instead.

## Hard constraints

### Constraint: Use the GraphQL Layer for Catalog Data

MUST use the FastStore GraphQL API for fetching catalog data (products, collections, search results, prices). MUST NOT make direct REST calls to VTEX Catalog APIs (`/api/catalog/`, `/api/catalog_system/`) from client-side code.

**Why this matters**
The FastStore API handles authentication, caching, request batching, and data normalization. Direct REST calls bypass all of these optimizations and expose your VTEX domain structure to the browser. They also create CORS issues, duplicate data fetching logic, and miss the type safety that GraphQL provides. Server-side REST calls to VTEX APIs are acceptable in GraphQL resolvers — that's exactly what API extensions are for.

**Detection**
If you see `fetch('https://{account}.vtexcommercestable.com.br/api/catalog')` or `fetch('https://{account}.myvtex.com/api/catalog')` in client-side code (components, hooks, useEffect) → warn that this bypasses the GraphQL layer. If it's in a file under `src/graphql/` resolvers → this is acceptable (that's the API extension pattern). If you see `axios` or `fetch` with VTEX API paths in any file under `src/components/` or `src/pages/` → STOP and refactor to use the GraphQL API.

**Correct**
```typescript
// src/graphql/vtex/resolvers/product.ts
// Server-side resolver — REST calls to VTEX APIs are correct here
import type { Resolver } from '@faststore/api'

const productResolver: Record<string, Resolver> = {
  StoreProduct: {
    customAttribute: async (root, _args, context) => {
      // Server-side: safe to call VTEX REST APIs in resolvers
      const response = await context.clients.commerce.catalog.getProduct(
        root.productID
      )
      return response.customAttribute
    },
  },
}

export default productResolver
```

**Wrong**
```typescript
// src/components/ProductCustomData.tsx
// WRONG: Direct REST call to VTEX Catalog API from a client component
import React, { useEffect, useState } from 'react'

interface ProductCustomDataProps {
  productId: string
}

export default function ProductCustomData({ productId }: ProductCustomDataProps) {
  const [data, setData] = useState(null)

  useEffect(() => {
    // WRONG: Direct REST call from the browser
    // This exposes the VTEX domain, bypasses caching, and creates CORS issues.
    fetch(`https://mystore.vtexcommercestable.com.br/api/catalog/pvt/product/${productId}`)
      .then((res) => res.json())
      .then(setData)
  }, [productId])

  return <div>{data?.Name}</div>
}
```

---

### Constraint: Never Expose API Keys in Client-Side Code

MUST NOT include VTEX API keys (`VTEX_APP_KEY`, `VTEX_APP_TOKEN`) or any secret credentials in client-side code, environment variables prefixed with `NEXT_PUBLIC_`, or any file that gets bundled into the browser.

**Why this matters**
API keys in client-side code are visible to anyone who inspects the page source or network requests. VTEX API keys provide access to catalog management, order processing, and account administration. Exposed keys can be used to modify products, access customer data, or disrupt store operations. This is a critical security vulnerability.

**Detection**
If you see `VTEX_APP_KEY`, `VTEX_APP_TOKEN`, `X-VTEX-API-AppKey`, or `X-VTEX-API-AppToken` in any file under `src/components/`, `src/pages/`, or any file that runs in the browser → STOP immediately. This is a critical security issue. If you see `NEXT_PUBLIC_VTEX_APP_KEY` or `NEXT_PUBLIC_VTEX_APP_TOKEN` in `.env` files → STOP immediately. The `NEXT_PUBLIC_` prefix makes these values available in the browser bundle.

**Correct**
```typescript
// src/graphql/vtex/resolvers/installments.ts
// API keys are used ONLY in server-side resolvers, accessed via context
import type { Resolver } from '@faststore/api'

const installmentResolver: Record<string, Resolver> = {
  StoreProduct: {
    availableInstallments: async (root, _args, context) => {
      // context.clients handles authentication automatically
      // No API keys are hardcoded or exposed
      const product = await context.clients.commerce.catalog.getProduct(
        root.productID
      )

      const installments = product.items?.[0]?.sellers?.[0]?.commertialOffer?.Installments || []

      return installments.map((inst: any) => ({
        count: inst.NumberOfInstallments,
        value: inst.Value,
        totalValue: inst.TotalValuePlusInterestRate,
        interestRate: inst.InterestRate,
      }))
    },
  },
}

export default installmentResolver
```

**Wrong**
```typescript
// src/components/ProductInstallments.tsx
// CRITICAL SECURITY ISSUE: API keys exposed in client-side code
import React, { useEffect, useState } from 'react'

export default function ProductInstallments({ productId }: { productId: string }) {
  const [installments, setInstallments] = useState([])

  useEffect(() => {
    fetch(`https://mystore.vtexcommercestable.com.br/api/catalog/pvt/product/${productId}`, {
      headers: {
        // CRITICAL: These keys are now visible to EVERY visitor of your site.
        // Anyone can extract them from the browser's network tab.
        'X-VTEX-API-AppKey': 'vtexappkey-mystore-ABCDEF',
        'X-VTEX-API-AppToken': 'very-secret-token-12345',
      },
    })
      .then((res) => res.json())
      .then((data) => setInstallments(data.Installments))
  }, [productId])

  return <div>{installments.length} installments available</div>
}
```

---

### Constraint: Follow the API Extension Directory Structure

MUST place API extension files in the correct directory structure: `src/graphql/vtex/` for VTEX API extensions and `src/graphql/thirdParty/` for third-party API extensions. Each must contain `typeDefs/` and `resolvers/` subdirectories.

**Why this matters**
FastStore's build system discovers and compiles API extensions from these specific directories. Files placed elsewhere will not be included in the GraphQL schema and resolvers will not execute. There will be no error at build time — the extended fields simply won't exist, causing runtime GraphQL errors when components try to query them.

**Detection**
If you see GraphQL type definitions (`.graphql` files) or resolver files outside of `src/graphql/vtex/` or `src/graphql/thirdParty/` → warn that they will not be discovered by the build system. If the `typeDefs/` or `resolvers/` subdirectory is missing → warn about incorrect structure.

**Correct**
```graphql
# src/graphql/vtex/typeDefs/product.graphql
type StoreProduct {
  availableInstallments: [Installment]
}

type Installment {
  count: Int
  value: Float
  totalValue: Float
  interestRate: Float
}
```

```typescript
// src/graphql/vtex/resolvers/product.ts
import type { Resolver } from '@faststore/api'

const productResolver: Record<string, Resolver> = {
  StoreProduct: {
    availableInstallments: async (root, _args, context) => {
      const product = await context.clients.commerce.catalog.getProduct(
        root.productID
      )
      const installments =
        product.items?.[0]?.sellers?.[0]?.commertialOffer?.Installments || []

      return installments.map((inst: any) => ({
        count: inst.NumberOfInstallments,
        value: inst.Value,
        totalValue: inst.TotalValuePlusInterestRate,
        interestRate: inst.InterestRate,
      }))
    },
  },
}

export default productResolver
```

```typescript
// src/graphql/vtex/resolvers/index.ts
import { default as StoreProductResolver } from './product'

const resolvers = {
  ...StoreProductResolver,
}

export default resolvers
```

**Wrong**
```typescript
// WRONG: Resolver placed in src/api/ instead of src/graphql/vtex/resolvers/
// src/api/resolvers/product.ts
// This file will NOT be discovered by FastStore's build system.
// The GraphQL schema will NOT include the extended fields.
// Components querying these fields will get runtime errors.

const productResolver = {
  StoreProduct: {
    availableInstallments: async (root: any) => {
      return []
    },
  },
}

export default productResolver
```

## Preferred pattern

Recommended file layout for API extensions:

```text
src/
├── graphql/
│   ├── vtex/
│   │   ├── typeDefs/
│   │   │   └── product.graphql
│   │   └── resolvers/
│   │       ├── product.ts
│   │       └── index.ts
│   └── thirdParty/
│       ├── typeDefs/
│       │   └── extra.graphql
│       └── resolvers/
│           ├── reviews.ts
│           └── index.ts
└── fragments/
    ├── ServerProduct.ts    ← server-side fragment (SSR)
    └── ClientProduct.ts    ← client-side fragment (post-render)
```

Minimal API extension — add a field to `StoreProduct`:

```graphql
# src/graphql/vtex/typeDefs/product.graphql
type StoreProduct {
  availableInstallments: [Installment]
}

type Installment {
  count: Int!
  value: Float!
  totalValue: Float!
  interestRate: Float!
}
```

```typescript
// src/graphql/vtex/resolvers/product.ts
import type { Resolver } from '@faststore/api'

const productResolver: Record<string, Resolver> = {
  StoreProduct: {
    availableInstallments: async (root, _args, context) => {
      const product = await context.clients.commerce.catalog.getProduct(
        root.productID
      )
      const installments =
        product.items?.[0]?.sellers?.[0]?.commertialOffer?.Installments || []

      return installments.map((inst: any) => ({
        count: inst.NumberOfInstallments,
        value: inst.Value,
        totalValue: inst.TotalValuePlusInterestRate,
        interestRate: inst.InterestRate,
      }))
    },
  },
}

export default productResolver
```

Include the new field in queries via fragments:

```typescript
// src/fragments/ServerProduct.ts
import { gql } from '@faststore/core/api'

export const fragment = gql(`
  fragment ServerProduct on Query {
    product(locator: $locator) {
      availableInstallments {
        count
        value
        totalValue
        interestRate
      }
    }
  }
`)
```

Third-party API extension (e.g., product reviews):

```typescript
// src/graphql/thirdParty/resolvers/reviews.ts
import type { Resolver } from '@faststore/api'

const REVIEWS_API_KEY = process.env.REVIEWS_API_KEY // Server-only env var (no NEXT_PUBLIC_ prefix)

const reviewsResolver: Record<string, Resolver> = {
  StoreProduct: {
    reviews: async (root) => {
      const response = await fetch(
        `https://api.reviews-service.com/products/${root.productID}/reviews`,
        {
          headers: {
            Authorization: `Bearer ${REVIEWS_API_KEY}`,
          },
        }
      )
      const data = await response.json()
      return {
        averageRating: data.average_rating,
        totalReviews: data.total_count,
        reviews: data.reviews.slice(0, 5).map((r: any) => ({
          author: r.author_name,
          rating: r.rating,
          text: r.review_text,
          date: r.created_at,
        })),
      }
    },
  },
}

export default reviewsResolver
```

## Common failure modes

- Making direct REST calls to VTEX Catalog APIs from React components — creates CORS issues, bypasses caching, and exposes VTEX account structure to the browser.
- Exposing API keys (`VTEX_APP_KEY`, `VTEX_APP_TOKEN`) in client-side code or `NEXT_PUBLIC_` environment variables — critical security vulnerability.
- Placing resolvers or type definitions outside `src/graphql/vtex/` or `src/graphql/thirdParty/` — they will not be discovered by the build system.
- Creating custom Next.js API routes (`pages/api/`) instead of using the API extension system — bypasses caching, type safety, and request batching.
- Forgetting to create the resolver index file (`src/graphql/vtex/resolvers/index.ts`) that re-exports all resolvers.

## Review checklist

- [ ] Is all catalog data fetched via the FastStore GraphQL API (not direct REST calls from components)?
- [ ] Are API extension files in `src/graphql/vtex/` or `src/graphql/thirdParty/` with proper `typeDefs/` and `resolvers/` subdirectories?
- [ ] Does the resolver index file re-export all resolvers?
- [ ] Are API keys and secrets used only in server-side resolvers (no `NEXT_PUBLIC_` prefix)?
- [ ] Are fragments created in `src/fragments/` to include new fields in predefined queries?
- [ ] Are there no custom Next.js API routes that could be replaced with API extensions?

## Reference

- [FastStore API overview](https://developers.vtex.com/docs/guides/faststore/faststore-api-overview) — Introduction to the GraphQL API and its capabilities
- [API extensions overview](https://developers.vtex.com/docs/guides/faststore/api-extensions-overview) — Guide to extending the FastStore API with custom data
- [Extending VTEX API schemas](https://developers.vtex.com/docs/guides/faststore/api-extensions-extending-api-schema) — Step-by-step for adding VTEX platform data to the GraphQL schema
- [Extending third-party API schemas](https://developers.vtex.com/docs/guides/faststore/api-extensions-extending-api-schema#extending-faststore-api-with-third-party-api-schemas) — Integrating external data sources
- [Extending queries using fragments](https://developers.vtex.com/docs/guides/faststore/api-extensions-extending-queries-using-fragments) — How to add fields to predefined queries using fragments
- [Consuming API extensions with custom components](https://developers.vtex.com/docs/guides/faststore/api-extensions-consuming-api-extensions) — Using extended data in React components
- [GraphQL schema objects](https://developers.vtex.com/docs/guides/faststore/schema-objects) — Reference for all native GraphQL types (StoreProduct, StoreOffer, etc.)
- [GraphQL queries reference](https://developers.vtex.com/docs/guides/faststore/schema-queries) — All predefined queries available in the FastStore API
- [API extension troubleshooting](https://developers.vtex.com/docs/guides/faststore/api-extensions-troubleshooting) — Common issues with API extensions and their solutions
- [`faststore-state-management`](../faststore-state-management/SKILL.md) — Related skill for client-side state management with SDK hooks
