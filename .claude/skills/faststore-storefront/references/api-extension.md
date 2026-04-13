---
name: faststore-api-extension
description: Step-by-step guide to extending the FastStore BFF GraphQL API with custom VTEX type fields or entirely new third-party queries and mutations, and how to consume them in React components. Use when adding new fields to StoreProduct or other built-in types, creating new queries to external APIs, adding form submission mutations, or using useQuery/useLazyQuery hooks to fetch custom data.
metadata:
  author: vtex
  version: "1.0"
---

# FastStore GraphQL API Extensions

FastStore exposes a GraphQL BFF layer that proxies between your storefront and the VTEX platform APIs. There are two extension mechanisms:

1. **VTEX extensions** (`src/graphql/vtex/`) — Extend existing FastStore API types (e.g., `StoreProduct`) with additional fields resolved from VTEX root data already available in the resolver context.
2. **Third-party extensions** (`src/graphql/thirdParty/`) — Define entirely new types, queries, and mutations that call external APIs.

## Directory Structure

```
src/graphql/
├── vtex/                        # Extensions to existing FastStore/VTEX types
│   ├── typeDefs/
│   │   └── product.graphql      # Schema extensions (extend type StoreProduct, etc.)
│   └── resolvers/
│       ├── product.ts           # Resolver for extended fields
│       └── index.ts             # Aggregates all VTEX resolvers
└── thirdParty/                  # New types, queries, and mutations from external APIs
    ├── typeDefs/
    │   ├── query.graphql
    │   └── contactForm.graphql
    └── resolvers/
        ├── queries.ts
        ├── contactForm.ts
        └── index.ts
```

---

## Extending Existing VTEX Types

Use when you need to add fields to types FastStore already provides (e.g., adding installment data to `StoreProduct`).

### Step 1 — Define the Schema Extension

```graphql
# src/graphql/vtex/typeDefs/product.graphql

type Installments {
  installmentPaymentSystemName: String!
  installmentValue: Float!
  installmentInterest: Float!
  installmentNumber: Float!
}

extend type StoreProduct {
  availableInstallments: [Installments!]!
}
```

Use `extend type <ExistingType>` to add fields to FastStore's built-in types.

### Step 2 — Create the Resolver

```typescript
// src/graphql/vtex/resolvers/product.ts
import type { StoreProductRoot } from "@faststore/core/api";

const productResolver = {
  StoreProduct: {
    availableInstallments: (root: StoreProductRoot) => {
      const installments = root.sellers?.[0]?.commertialOffer?.Installments;
      if (!installments?.length) return [];

      return installments.map((installment) => ({
        installmentPaymentSystemName: installment.PaymentSystemName,
        installmentValue: installment.Value,
        installmentInterest: installment.InterestRate,
        installmentNumber: installment.NumberOfInstallments,
      }));
    },
  },
};

export default productResolver;
```

Import root types from `@faststore/core/api` (e.g., `StoreProductRoot`, `StoreCollectionRoot`).

### Step 3 — Register the Resolver

```typescript
// src/graphql/vtex/resolvers/index.ts
import { default as StoreProductResolver } from "./product";

const resolvers = { ...StoreProductResolver };
export default resolvers;
```

### Step 4 — Add Fragments to Include New Fields in Page Queries

Fragment filenames must match the query they extend:

```typescript
// src/fragments/ServerProduct.ts
import { gql } from "@faststore/core/api";

export const fragment = gql(`
  fragment ServerProduct on Query {
    product(locator: $locator) {
      availableInstallments {
        installmentPaymentSystemName
        installmentValue
        installmentInterest
        installmentNumber
      }
    }
  }
`);
```

```typescript
// src/fragments/ClientProduct.ts — must mirror ServerProduct
import { gql } from "@faststore/core/api";

export const fragment = gql(`
  fragment ClientProduct on Query {
    product(locator: $locator) {
      availableInstallments {
        installmentPaymentSystemName
        installmentValue
        installmentInterest
        installmentNumber
      }
    }
  }
`);
```

#### Fragment Naming Convention

| Filename | Extends query for |
|----------|-------------------|
| `ServerProduct.ts` | Server-side PDP query |
| `ClientProduct.ts` | Client-side PDP query |
| `ClientProductGallery.ts` | Client-side PLP query |
| `ClientManyProducts.ts` | — |
| `ClientSearchSuggestions.ts` | Search autocomplete query |
| `ClientShippingSimulation.ts` | Shipping simulation query |
| `ClientTopSearchSuggestions.ts` | Top search query |
| `ClientCollectionPage.ts` | Client-side PLP/collection query |
| `ServerCollectionPage.ts` | Server-side PLP/collection query |

### Consuming VTEX Extensions in React

VTEX type extensions are automatically available through FastStore's built-in page hooks — no extra client-side query needed:

```tsx
import { usePDP } from "@faststore/core";

function ProductInstallments() {
  const context = usePDP();
  const installment = context?.data?.product?.availableInstallments[0];

  if (!installment || installment.installmentInterest !== 0) return null;

  return (
    <span>
      {installment.installmentNumber} interest-free installments
      of ${installment.installmentValue}
    </span>
  );
}
```

---

## Third-Party Extensions — New Queries

Use when you need to fetch data from external (non-VTEX) APIs.

### Step 1 — Define the Schema

```graphql
# src/graphql/thirdParty/typeDefs/query.graphql

type CEP {
  cep: String!
  logradouro: String!
  bairro: String!
  localidade: String!
  uf: String!
  estado: String!
  regiao: String!
  ddd: String!
  complemento: String
  unidade: String
  ibge: String
  gia: String
  siafi: String
}

extend type Query {
  searchCEP(CEP: String!): CEP!
}
```

Use `extend type Query` to add new query fields.

### Step 2 — Create the Resolver

```typescript
// src/graphql/thirdParty/resolvers/queries.ts
import { Query } from "@faststore/core/api";

export default {
  Query: {
    searchCEP: async (_: unknown, { CEP }: { CEP: string }): Promise<Query["searchCEP"]> => {
      const resp = await fetch(`http://viacep.com.br/ws/${CEP}/json`);
      return resp.json();
    },
  },
};
```

### Step 3 — Register

```typescript
// src/graphql/thirdParty/resolvers/index.ts
import queriesResolver from "./queries";

const resolvers = { ...queriesResolver };
export default resolvers;
```

---

## Third-Party Extensions — New Mutations

Use when you need to send data to external services (form submissions, writes, etc.).

### Step 1 — Define the Schema

```graphql
# src/graphql/thirdParty/typeDefs/contactForm.graphql

type ContactFormResponse {
  message: String!
}

input ContactFormInput {
  name: String!
  email: String!
  subject: String!
  message: String!
}

# Use `type Mutation` for the first mutation definition,
# `extend type Mutation` if another file already defines it.
type Mutation {
  submitContactForm(input: ContactFormInput!): ContactFormResponse
}
```

### Step 2 — Create the Resolver

```typescript
// src/graphql/thirdParty/resolvers/contactForm.ts
type SubmitContactFormData = {
  input: { name: string; email: string; subject?: string; message: string };
};

const contactFormResolver = {
  Mutation: {
    submitContactForm: async (_: never, data: SubmitContactFormData) => {
      const { input } = data;
      try {
        const response = await fetch("https://your-api-endpoint.com/api/contact", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(input),
        });
        if (!response.ok) throw new Error("Error while sending the message");
        return { message: "Your message was sent successfully!" };
      } catch (error) {
        return { message: error };
      }
    },
  },
};

export default contactFormResolver;
```

---

## Consuming Custom Queries and Mutations in React

Third-party queries and mutations require explicit hooks from `@faststore/core/experimental`.

### Imports

```typescript
import { gql } from "@faststore/core/api";
import { useQuery_unstable as useQuery } from "@faststore/core/experimental";
import { useLazyQuery_unstable as useLazyQuery } from "@faststore/core/experimental";
```

### `useQuery` — Auto-Executing Queries

Fires on mount, re-executes when variables change. SWR-powered (caching, revalidation, deduplication).

```tsx
const SEARCH_CEP_QUERY = gql`
  query getCEPQuery($cep: String!) {
    searchCEP(CEP: $cep) {
      logradouro
      bairro
      localidade
      uf
    }
  }
`;

function AddressLookup({ cep }: { cep: string }) {
  const { data, error } = useQuery(SEARCH_CEP_QUERY, { cep });
  if (error) return <p>Failed to load.</p>;
  if (!data) return <p>Loading...</p>;
  return <address>{data.searchCEP.logradouro}, {data.searchCEP.localidade}</address>;
}
```

### `useLazyQuery` — Deferred / Imperative Execution

Returns `[execute, response]`. Use for mutations and user-triggered queries.

```tsx
const SUBMIT_CONTACT_FORM = gql`
  mutation SubmitContactForm($input: ContactFormInput!) {
    submitContactForm(input: $input) { message }
  }
`;

function ContactForm() {
  const [execute, { data, error }] = useLazyQuery(SUBMIT_CONTACT_FORM, {
    input: { name: "", email: "", subject: "", message: "" },
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await execute({ input: formData });
  };
  // ...
}
```

### `gql` Tag Rules

1. **Operation names matter** — queries must end with `Query` (e.g., `getCEPQuery`) for FastStore to use HTTP GET; mutations default to POST
2. **One operation per `gql` tag**
3. **`gql` calls must be at module scope** — not inside component bodies

---

## Quick Reference

| Goal | Schema location | Resolver location | Consumption |
|------|----------------|-------------------|-------------|
| Add fields to existing FastStore type | `src/graphql/vtex/typeDefs/*.graphql` | `src/graphql/vtex/resolvers/` | `usePDP()`, `usePLP()`, etc. |
| New query to external API | `src/graphql/thirdParty/typeDefs/*.graphql` | `src/graphql/thirdParty/resolvers/` | `useQuery` |
| New mutation to external API | `src/graphql/thirdParty/typeDefs/*.graphql` | `src/graphql/thirdParty/resolvers/` | `useLazyQuery` |

## Checklist

1. Create the `.graphql` schema file in the appropriate `typeDefs/` directory
2. Create the TypeScript resolver file in the matching `resolvers/` directory
3. Register the resolver by spreading it into the corresponding `resolvers/index.ts`
4. For third-party queries/mutations: define a `gql`-tagged operation at module scope in your component
5. Use `useQuery` (auto-execute) or `useLazyQuery` (execute on demand) to consume the data
6. Restart the dev server — schema changes require a rebuild to regenerate types
