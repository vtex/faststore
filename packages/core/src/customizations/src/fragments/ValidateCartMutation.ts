import { gql } from '@generated'

/**
 * Extension points for the native ValidateCartMutation.
 *
 * Store projects can extend StoreOffer and StoreCart in
 * `src/graphql/vtex/typeDefs` and add the corresponding fields to these
 * fragments. The native cart fields remain defined and selected by the core
 * mutation.
 */
export const fragment = gql(`
  fragment CartItemAdditional on StoreOffer {
    quantity
  }

  fragment StoreCartAdditional on StoreCart {
    order {
      orderNumber
    }
  }
`)
