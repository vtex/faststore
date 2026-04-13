---
name: faststore-graphql-bff
description: Complete FastStore GraphQL BFF API reference including all built-in root queries, root mutations, and type definitions. Use when querying product, collection, search, cart, session, shipping, or user order data, when extending existing types with new fields, or when looking up available fields on types like StoreProduct, StoreOffer, StoreSession, StoreCart, StoreFacet, and others.
metadata:
  author: vtex
  version: "1.0"
---

# FastStore GraphQL BFF — API Reference

FastStore exposes a GraphQL BFF (Back-For-Front) layer that proxies between your storefront and VTEX platform APIs.

The full type reference is in [references/REFERENCE.md](references/REFERENCE.md).

## Root Query Fields (Summary)

| Field | Return Type | Description |
|-------|------------|-------------|
| `product(locator)` | `StoreProduct!` | Product details by locator |
| `collection(slug)` | `StoreCollection!` | Collection details by slug |
| `search(first, after, sort, term, selectedFacets)` | `StoreSearchResult!` | Product/facet/suggestion search |
| `allProducts(first, after)` | `StoreProductConnection!` | All products |
| `products(productIds)` | `[StoreProduct!]!` | Products by IDs |
| `allCollections(first, after)` | `StoreCollectionConnection!` | All collections |
| `shipping(items, postalCode, country)` | `ShippingData` | Shipping simulation |
| `sellers(postalCode, country, ...)` | `SellersData` | Available sellers |
| `profile(id)` | `Profile` | Profile information |
| `userOrder(orderId)` | `UserOrderResult` | Order details (auth required) |
| `listUserOrders(...)` | `UserOrderListMinimalResult` | Order list (auth required) |
| `userDetails` | `StoreUserDetails!` | Current user details (auth required) |
| `pickupPoints(geoCoordinates)` | `PickupPoints` | Nearby pickup points |

## Root Mutation Fields (Summary)

| Field | Return Type | Description |
|-------|------------|-------------|
| `validateCart(cart, session)` | `StoreCart` | Validate/sync cart with platform |
| `validateSession(session, search)` | `StoreSession` | Update web session |
| `subscribeToNewsletter(data)` | `PersonNewsletter` | Newsletter subscription |
| `cancelOrder(data)` | `UserOrderCancel` | Cancel a user order |

## Key Types at a Glance

- **`StoreProduct`** — A VTEX SKU. Contains `name`, `sku`, `slug`, `brand`, `offers`, `image`, `description`, `seo`, `additionalProperty`, `isVariantOf`, and more.
- **`StoreOffer`** — Offer for a product from a seller. Contains `price`, `sellingPrice`, `listPrice`, `availability`, `seller`, `quantity`.
- **`StoreSearchResult`** — Search results with `products`, `facets`, `suggestions`, and `metadata`.
- **`StoreSession`** — Session state: `locale`, `currency`, `country`, `channel`, `person`, `postalCode`.
- **`StoreCart`** — Shopping cart: `order` (with `acceptedOffer` array) and `messages`.
- **`StoreFacetBoolean` / `StoreFacetRange`** — Search facets with keys, labels, and values.

## Extending Types

Use `extend type <TypeName>` in `src/graphql/vtex/typeDefs/*.graphql` to add fields to any built-in type:

```graphql
extend type StoreProduct {
  customField: String!
}
```

See [faststore-api-extension](../faststore-api-extension/SKILL.md) for the complete extension guide.

## Sort Options (`StoreSort` enum)

| Value | Description |
|-------|-------------|
| `price_desc` | Price: high to low |
| `price_asc` | Price: low to high |
| `orders_desc` | Most orders first |
| `name_desc` | Name: Z to A |
| `name_asc` | Name: A to Z |
| `release_desc` | Newest first |
| `discount_desc` | Biggest discount first |
| `score_desc` | Best score first |

## Full Type Reference

See [references/REFERENCE.md](references/REFERENCE.md) for the complete field-by-field reference for all types.
## API Extensions — GraphQL

FastStore provides two extension mechanisms for GraphQL:

1. **VTEX extensions** (`src/graphql/vtex/`) — extend the existing FastStore API types with new fields. The resolvers have access to the VTEX platform data that comes from the root object.
2. **Third-party extensions** (`src/graphql/thirdParty/`) — define entirely new types, queries, and mutations that call external APIs.

###1 Extending the VTEX Schema (adding fields to existing types)

#### Step 1: Define the new type and extend the existing type

```graphql
# src/graphql/vtex/typeDefs/product.graphql
# Extends the native StoreProduct type with installment data.
# The "extend type" syntax adds fields to an existing FastStore API type.

type Installments {
  installmentPaymentSystemName: String!
  installmentValue: Float!
  installmentInterest: Float!
  installmentNumber: Float!
}

extend type StoreProduct {
  """
  Retrieve available installments data extending StoreProduct
  """
  availableInstallments: [Installments!]!
}
```

#### Step 2: Write the resolver

```ts
// src/graphql/vtex/resolvers/product.ts
// Resolves the "availableInstallments" field added to StoreProduct.
// The `root` parameter contains the raw VTEX catalog data for the product,
// which includes seller information, commercial offers, and installment plans.

import type { StoreProductRoot } from "@faststore/core/api";
// StoreProductRoot: TypeScript type representing the raw VTEX product data
// that FastStore passes to StoreProduct resolvers.

const productResolver = {
  StoreProduct: {
    availableInstallments: (root: StoreProductRoot) => {
      // Access installments from the first seller's commercial offer.
      // The VTEX API nests this data under sellers[].commertialOffer.Installments.
      // <!-- TODO: "commertialOffer" appears to be a known typo in the VTEX API
      //   (should be "commercialOffer"). Confirm this is intentional and not a bug. -->
      const installments = root.sellers?.[0]?.commertialOffer?.Installments;

      if (!installments.length) {
        return [];
      }

      // Map the raw VTEX installment shape to our GraphQL schema shape.
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

#### Step 3: Export from the resolver index

```ts
// src/graphql/vtex/resolvers/index.ts
// Aggregates all VTEX API extension resolvers into a single export.
// FastStore CLI reads this file to merge resolvers into the API.

import { default as StoreProductResolver } from "./product";

const resolvers = {
  ...StoreProductResolver,
};

export default resolvers;
```

#### Step 4: Add fragments to include the new fields in page queries

FastStore uses a fragment-based system to extend the data fetched on each page. Fragment filenames must match the query they extend.

```ts
// src/fragments/ServerProduct.ts
// Server-side fragment: included in the initial server-rendered HTML.
// The filename "ServerProduct" tells FastStore to merge this fragment
// into the server-side product query for the PDP.

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

// Docs: https://developers.vtex.com/docs/guides/faststore/api-extensions-extending-queries-using-fragments
```

```ts
// src/fragments/ClientProduct.ts
// Client-side fragment: used for client-side data fetching (e.g., SWR revalidation).
// Must include the same fields as the server fragment so client and server data match.

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

#### Fragment naming convention

| Filename | Extends query for |
|----------|-------------------|
| `ServerProduct.ts` | Server-side PDP query |
| `ClientProduct.ts` | Client-side PDP query |
| `ClientProductGallery.ts` | Client-side PLP query |
| `ClientManyProducts.ts` |  |
| `ClientSearchSuggestions.ts` | Search autocomplete query |
| `ClientShippingSimulation.ts` | Shipping simulation query |
| `ClientTopSearchSuggestions.ts` | Top search query |
| `ClientCollectionPage.ts` | Client-side PLP/collection query |
| `ClientTopSearchSuggestions.ts` | Top search suggestions query |
| `ServerCollectionPage.ts` | Server-side PLP/collection query |
| `ServerProduct.ts` | Server-side product query |

###2 Third-Party Extensions (new types and mutations)

#### Step 1: Define new GraphQL types

```graphql
# src/graphql/thirdParty/typeDefs/contactForm.graphql
# Defines a completely new mutation for submitting a contact form.
# This is NOT extending an existing type — it's a new root Mutation field.

type ContactFormResponse {
  message: String!
}

input ContactFormInput {
  name: String!
  email: String!
  subject: String!
  message: String!
}

type Mutation {
  submitContactForm(input: ContactFormInput!): ContactFormResponse
}
```

#### Step 2: Write the resolver

```ts
// src/graphql/thirdParty/resolvers/contactForm.ts
// Server-side resolver for the submitContactForm mutation.
// This runs on the Node.js server, so it can make authenticated API calls
// that shouldn't be exposed to the browser.

type SubmitContactFormData = {
  input: {
    name: string;
    email: string;
    subject?: string;
    message: string;
  };
};

const contactFormResolver = {
  Mutation: {
    submitContactForm: async (_: never, data: SubmitContactFormData) => {
      const { input } = data;

      try {
        // POST to the VTEX Master Data API (Data Entities).
        // This is a server-side call — the API key/credentials are managed
        // by the VTEX platform, not exposed to the client.
        // <!-- TODO: The URL is hardcoded to "playground.vtexcommercestable.com.br".
        //   In production, this should be dynamic based on discovery.config.js api settings.
        //   Confirm if there's a recommended way to access the store config from resolvers. -->
        const response = await fetch(
          "https://playground.vtexcommercestable.com.br/api/dataentities/ContactForm/documents?_schema=contactForm",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(input),
          }
        );

        if (!response.ok) {
          throw new Error("Error while sending the message");
        }

        return { message: "Your message was sent successfully!" };
      } catch (error) {
        return { message: error };
      }
    },
  },
};

export default contactFormResolver;
```

#### Step 3: Export from the resolver index

```ts
// src/graphql/thirdParty/resolvers/index.ts
// Aggregates all third-party resolvers.
// FastStore CLI reads this file to register them with the GraphQL server.

import contactFormResolver from "./contactForm";

const resolvers = {
  ...contactFormResolver,
};

export default resolvers;
```

###3 Consuming extended data in components

```tsx
// src/components/BuyButtonWithDetails/BuyButtonWithDetails.tsx
// Custom BuyButton that displays installment information fetched via API extensions.

import { usePDP } from "@faststore/core";
// usePDP: Hook that provides all PDP data, including extended fields from fragments.
// The data shape includes both native FastStore fields and your custom extensions.

import { Button as UIButton, ButtonProps } from "@faststore/ui";
import { priceFormatter } from "../../utils/priceFormatter";

import styles from "./buy-button-with-details.module.scss";

export function BuyButtonWithDetails(props: ButtonProps) {
  // usePDP() returns the full PDP context including data from ServerProduct/ClientProduct fragments.
  const context = usePDP();

  // Access the custom "availableInstallments" field we added via the VTEX API extension.
  const installment = context?.data?.product?.availableInstallments[0];
  const interestFree = installment.installmentInterest === 0 ?? false;

  return (
    <section className={styles.buyButtonWithDetails}>
      {interestFree && (
        <span>
          {`${installment.installmentNumber} interest-free installment(s)`}
          <br />
          {`of ${priceFormatter(installment.installmentValue)} with ${
            installment.installmentPaymentSystemName
          }`}
        </span>
      )}

      {/* Spread native ButtonProps so the component remains compatible
          with the slot it replaces in ProductDetailsSection. */}
      <UIButton {...props} variant="primary">
        Buy Button
      </UIButton>
    </section>
  );
}

export default BuyButtonWithDetails;
```

---

## Built-in VTEX Type Reference

These are the types already provided by the FastStore GraphQL API. Use `extend type <TypeName>` in your VTEX extension schemas to add fields to any of them.

### Root Query

The top-level `Query` type exposes these fields:

| Field | Arguments | Return Type | Description |
|---|---|---|---|
| `product` | `locator: [IStoreSelectedFacet!]!` | `StoreProduct!` | Returns the details of a product based on the specified locator. |
| `collection` | `slug: String!` | `StoreCollection!` | Returns the details of a collection based on the collection slug. |
| `search` | `first: Int!`, `after: String`, `sort: StoreSort`, `term: String`, `selectedFacets: [IStoreSelectedFacet!]`, `sponsoredCount: Int` | `StoreSearchResult!` | Returns the result of a product, facet, or suggestion search. |
| `allProducts` | `first: Int!`, `after: String` | `StoreProductConnection!` | Returns information about all products. |
| `products` | `productIds: [String!]!` | `[StoreProduct!]!` | Returns information about selected products. |
| `allCollections` | `first: Int!`, `after: String` | `StoreCollectionConnection!` | Returns information about all collections. |
| `shipping` | `items: [IShippingItem!]!`, `postalCode: String!`, `country: String!` | `ShippingData` | Returns information about shipping simulation. |
| `redirect` | `term: String`, `selectedFacets: [IStoreSelectedFacet!]` | `StoreRedirect` | Returns if there's a redirect for a search. |
| `sellers` | `postalCode: String`, `geoCoordinates: IGeoCoordinates`, `country: String!`, `salesChannel: String` | `SellersData` | Returns a list of sellers available for a specific localization. |
| `profile` | `id: String!` | `Profile` | Returns information about the profile. |
| `productCount` | `term: String` | `ProductCountResult` | Returns the total product count based on location. |
| `userOrder` | `orderId: String!` | `UserOrderResult` | Returns the details of a user order. Requires auth. |
| `listUserOrders` | `page: Int`, `perPage: Int`, `status: [String]`, `dateInitial: String`, `dateFinal: String`, `text: String`, `clientEmail: String`, `pendingMyApproval: Boolean` | `UserOrderListMinimalResult` | Returns the list of orders the user can view. Requires auth. |
| `userDetails` | — | `StoreUserDetails!` | Returns the current user details. Requires auth. |
| `accountProfile` | — | `StoreAccountProfile!` | Returns the account profile for the authenticated user. Requires auth. |
| `validateUser` | — | `ValidateUserData` | Returns information about user validation. Requires auth. |
| `pickupPoints` | `geoCoordinates: IStoreGeoCoordinates` | `PickupPoints` | Returns a list of pickup points near the given coordinates. |

### Root Mutation

| Field | Arguments | Return Type | Description |
|---|---|---|---|
| `validateCart` | `cart: IStoreCart!`, `session: IStoreSession` | `StoreCart` | Checks for changes between the UI cart and the platform cart. |
| `validateSession` | `session: IStoreSession!`, `search: String!` | `StoreSession` | Updates a web session with the specified values. |
| `subscribeToNewsletter` | `data: IPersonNewsletter!` | `PersonNewsletter` | Subscribes a new person to the newsletter list. |
| `cancelOrder` | `data: IUserOrderCancel!` | `UserOrderCancel` | Cancels a user order. |
| `processOrderAuthorization` | `data: IProcessOrderAuthorization!` | `ProcessOrderAuthorizationResponse` | Process order authorization (approve/reject). |

---

### StoreProduct

The main product type. Equivalent to a VTEX SKU.

| Field | Type | Description |
|---|---|---|
| `seo` | `StoreSeo!` | Meta tag data. |
| `breadcrumbList` | `StoreBreadcrumbList!` | Chain of linked web pages ending with the current page. |
| `slug` | `String!` | Corresponding collection URL slug. |
| `name` | `String!` | Product name. |
| `productID` | `String!` | Product ID (e.g., ISBN or similar global IDs). |
| `brand` | `StoreBrand!` | Product brand. |
| `description` | `String!` | Product description. |
| `image` | `[StoreImage!]!` | Array of images. Accepts `context: String` and `limit: Int` arguments. |
| `offers` | `StoreAggregateOffer!` | Aggregate offer information. |
| `sku` | `String!` | Stock Keeping Unit (merchant-specific ID). |
| `gtin` | `String!` | Global Trade Item Number. |
| `review` | `[StoreReview!]!` | Array with review information. |
| `aggregateRating` | `StoreAggregateRating!` | Aggregate ratings data. |
| `isVariantOf` | `StoreProductGroup!` | Indicates the product group related to this product. |
| `additionalProperty` | `[StorePropertyValue!]!` | Array of additional properties. |
| `releaseDate` | `String!` | The product's release date (ISO 8601). |
| `unitMultiplier` | `Float` | SKU unit multiplier. |
| `advertisement` | `Advertisement` | Advertisement information about the product. |
| `hasSpecifications` | `Boolean` | Indicates whether the product has specifications. |
| `skuSpecifications` | `[SkuSpecification!]!` | The specifications of a product. |
| `specificationGroups` | `[SpecificationGroup!]!` | The specifications of a group of SKUs. |
| `deliveryPromiseBadges` | `[DeliveryPromiseBadge]` | Delivery promise product badges. |

### StoreProductGroup

Product groups are catalog entities that may contain variants. Equivalent to VTEX Products.

| Field | Type | Description |
|---|---|---|
| `hasVariant` | `[StoreProduct!]!` | Array of variants related to the product group. |
| `productGroupID` | `String!` | Product group ID. |
| `name` | `String!` | Product group name. |
| `additionalProperty` | `[StorePropertyValue!]!` | Array of additional properties. |
| `skuVariants` | `SkuVariants` | Data structures for handling different SKU variant properties. |

### StoreOffer

Offer information for a product.

| Field | Type | Description |
|---|---|---|
| `listPrice` | `Float!` | Displayed as the "from" price in promotions. |
| `listPriceWithTaxes` | `Float!` | List price with current taxes. |
| `sellingPrice` | `Float!` | Computed price before applying coupons, taxes, or benefits. |
| `priceCurrency` | `String!` | ISO code of the currency used for the offer prices. |
| `price` | `Float!` | Also known as spot price. |
| `priceWithTaxes` | `Float!` | Spot price with taxes. |
| `priceValidUntil` | `String!` | Next date when price is scheduled to change. |
| `itemCondition` | `String!` | Offer item condition. |
| `availability` | `String!` | Offer item availability. |
| `seller` | `StoreOrganization!` | Seller responsible for the offer. |
| `itemOffered` | `StoreProduct!` | Information on the item being offered. |
| `quantity` | `Int!` | Number of items offered. |

### StoreAggregateOffer

Aggregate offer information for a given SKU across multiple sellers.

| Field | Type | Description |
|---|---|---|
| `highPrice` | `Float!` | Highest price among all sellers. |
| `lowPrice` | `Float!` | Lowest price among all sellers. |
| `lowPriceWithTaxes` | `Float!` | Lowest price among all sellers with current taxes. |
| `offerCount` | `Int!` | Number of sellers selling this SKU. |
| `priceCurrency` | `String!` | ISO code of the currency used for the offer prices. |
| `offers` | `[StoreOffer!]!` | Array with information on each available offer. |

### StoreCollection

Product collection information.

| Field | Type | Description |
|---|---|---|
| `seo` | `StoreSeo!` | Meta tag data. |
| `breadcrumbList` | `StoreBreadcrumbList!` | Breadcrumb list for navigation. |
| `meta` | `StoreCollectionMeta!` | Collection meta information (selected facets). |
| `id` | `ID!` | Collection ID. |
| `slug` | `String!` | Collection URL slug. |
| `type` | `StoreCollectionType!` | Collection type (`Department`, `Category`, `SubCategory`, `Brand`, `Cluster`, `Collection`). |

### StoreSearchResult

Search result data.

| Field | Type | Description |
|---|---|---|
| `products` | `StoreProductConnection!` | Search result products (with pagination). |
| `facets` | `[StoreFacet!]!` | Array of search result facets. |
| `suggestions` | `StoreSuggestions!` | Search result suggestions. |
| `metadata` | `SearchMetadata` | Search result metadata (misspelling, fuzzy, logical operator). |

### StoreSeo

Search Engine Optimization tags data.

| Field | Type | Description |
|---|---|---|
| `title` | `String!` | Title tag. |
| `titleTemplate` | `String!` | Title template tag. |
| `description` | `String!` | Description tag. |
| `canonical` | `String!` | Canonical tag. |

### StoreBreadcrumbList

Breadcrumb navigation list.

| Field | Type | Description |
|---|---|---|
| `itemListElement` | `[StoreListItem!]!` | Array with breadcrumb elements. |
| `numberOfItems` | `Int!` | Number of breadcrumbs in the list. |

### StoreListItem

Single breadcrumb item.

| Field | Type | Description |
|---|---|---|
| `item` | `String!` | List item value. |
| `name` | `String!` | Name of the list item. |
| `position` | `Int!` | Position of the item in the list. |

### StoreBrand

| Field | Type | Description |
|---|---|---|
| `name` | `String!` | Brand name. |

### StoreImage

| Field | Type | Description |
|---|---|---|
| `url` | `String!` | Image URL. |
| `alternateName` | `String!` | Alias for the image. |

### StorePropertyValue

Properties associated with products and product groups.

| Field | Type | Description |
|---|---|---|
| `propertyID` | `String!` | Property ID. |
| `value` | `ObjectOrString!` | Property value (may be a string or stringified object). |
| `name` | `String!` | Property name. |
| `valueReference` | `ObjectOrString!` | Specifies the nature of the value. |

### StoreReview

| Field | Type | Description |
|---|---|---|
| `reviewRating` | `StoreReviewRating!` | Review rating information. |
| `author` | `StoreAuthor!` | Review author. |

### StoreReviewRating

| Field | Type | Description |
|---|---|---|
| `ratingValue` | `Float!` | Rating value. |
| `bestRating` | `Float!` | Best rating value. |

### StoreAggregateRating

| Field | Type | Description |
|---|---|---|
| `ratingValue` | `Float!` | Value of the aggregate rating. |
| `reviewCount` | `Int!` | Total number of ratings. |

### StoreOrganization (Seller)

| Field | Type | Description |
|---|---|---|
| `identifier` | `String!` | Organization / Seller ID. |

### StoreSession

Session information.

| Field | Type | Description |
|---|---|---|
| `locale` | `String!` | Session locale. |
| `currency` | `StoreCurrency!` | Session currency. |
| `country` | `String!` | Session country. |
| `channel` | `String` | Session channel. |
| `deliveryMode` | `StoreDeliveryMode` | Session delivery mode. |
| `addressType` | `String` | Session address type. |
| `city` | `String` | Session city. |
| `postalCode` | `String` | Session postal code. |
| `geoCoordinates` | `StoreGeoCoordinates` | Session geo coordinates. |
| `person` | `StorePerson` | Session person. |
| `b2b` | `StoreB2B` | B2B information. |
| `marketingData` | `StoreMarketingData` | Marketing information. |
| `refreshAfter` | `String` | Refresh token expiry. |

### StorePerson

Client profile data.

| Field | Type | Description |
|---|---|---|
| `id` | `String!` | Client ID. |
| `email` | `String!` | Client email. |
| `givenName` | `String!` | Client first name. |
| `familyName` | `String!` | Client last name. |

### StoreCurrency

| Field | Type | Description |
|---|---|---|
| `code` | `String!` | Currency code (e.g., `USD`). |
| `symbol` | `String!` | Currency symbol (e.g., `$`). |

### StoreCart

Shopping cart information.

| Field | Type | Description |
|---|---|---|
| `order` | `StoreOrder!` | Order information. |
| `messages` | `[StoreCartMessage!]!` | List of shopping cart messages. |

### StoreOrder

| Field | Type | Description |
|---|---|---|
| `orderNumber` | `String!` | ID of the order in VTEX Order Management. |
| `acceptedOffer` | `[StoreOffer!]!` | Array with information on each accepted offer. |
| `shouldSplitItem` | `Boolean` | Indicates whether items with attachments should be split. |

### StorePageInfo

Pagination information returned in connection queries.

| Field | Type | Description |
|---|---|---|
| `hasNextPage` | `Boolean!` | Whether there is at least one more page after the current. |
| `hasPreviousPage` | `Boolean!` | Whether there is at least one more page before the current. |
| `startCursor` | `String!` | Cursor corresponding to the first possible item. |
| `endCursor` | `String!` | Cursor corresponding to the last possible item. |
| `totalCount` | `Int!` | Total number of items (not pages). |

### SkuVariants

Variant handling data structures.

| Field | Type | Description |
|---|---|---|
| `activeVariations` | `ActiveVariations` | SKU property values for the current SKU. |
| `allVariantsByName` | `VariantsByName` | All available options for each SKU variant property, indexed by name. |
| `slugsMap` | `SlugsMap` | Maps property value combinations to their respective SKU slug. Accepts `dominantVariantName: String`. |
| `availableVariations` | `FormattedVariants` | Available options for each varying SKU property. Accepts `dominantVariantName: String`. |
| `allVariantProducts` | `[StoreProduct!]` | All available variant products. |

### SkuSpecification

| Field | Type | Description |
|---|---|---|
| `field` | `SKUSpecificationField!` | Specification field metadata. |
| `values` | `[SKUSpecificationValue!]!` | Specification values. |

### SpecificationGroup

| Field | Type | Description |
|---|---|---|
| `name` | `String!` | Group name. |
| `originalName` | `String!` | Original group name. |
| `specifications` | `[Specification!]!` | Specifications in this group. |

### ShippingData

Shipping simulation information.

| Field | Type | Description |
|---|---|---|
| `items` | `[LogisticsItem]` | List of logistics items. |
| `logisticsInfo` | `[LogisticsInfo]` | List of logistics info. |
| `messages` | `[MessageInfo]` | List of messages. |
| `address` | `Address` | Address information. |

### StoreFacetBoolean

Search facet with boolean values.

| Field | Type | Description |
|---|---|---|
| `key` | `String!` | Facet key. |
| `label` | `String!` | Facet label. |
| `values` | `[StoreFacetValueBoolean!]!` | Array with information on each facet value. |

### StoreFacetRange

Search facet with range values.

| Field | Type | Description |
|---|---|---|
| `key` | `String!` | Facet key. |
| `label` | `String!` | Facet label. |
| `min` | `StoreFacetValueRange!` | Minimum facet range value. |
| `max` | `StoreFacetValueRange!` | Maximum facet range value. |

### StoreMarketingData

| Field | Type | Description |
|---|---|---|
| `utmCampaign` | `String` | UTM campaign parameter. |
| `utmMedium` | `String` | UTM medium parameter. |
| `utmSource` | `String` | UTM source parameter. |
| `utmiCampaign` | `String` | Internal UTM campaign. |
| `utmiPart` | `String` | Internal UTM part. |
| `utmiPage` | `String` | Internal UTM page. |

### Enums

#### StoreSort

Product search results sorting options.

| Value | Description |
|---|---|
| `price_desc` | Sort by price, highest to lowest. |
| `price_asc` | Sort by price, lowest to highest. |
| `orders_desc` | Sort by orders, highest to lowest. |
| `name_desc` | Sort by name, reverse alphabetical. |
| `name_asc` | Sort by name, alphabetical. |
| `release_desc` | Sort by release date, newest first. |
| `discount_desc` | Sort by discount value, highest to lowest. |
| `score_desc` | Sort by product score, highest to lowest. |

#### StoreCollectionType

| Value | Description |
|---|---|
| `Department` | First level of product categorization. |
| `Category` | Second level of product categorization. |
| `SubCategory` | Third level of product categorization. |
| `Brand` | Product brand. |
| `Cluster` | Product cluster. |
| `Collection` | Product collection. |

#### StoreStatus

Shopping cart message status.

| Value | Description |
|---|---|
| `INFO` | Informational message. |
| `WARNING` | Warning message. |
| `ERROR` | Error message. |
