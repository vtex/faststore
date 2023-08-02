// import { SectionOverride } from "@faststore/core/src/typings/overrides";

// const SECTION = "ProductDetails" as const;

// const override: SectionOverride = {
//   section: SECTION,
//   components: {
//     BuyButton: { props: { size: "small", iconPosition: "right" } },
//   },
// };

// export { override };
import { SectionOverride } from '@faststore/core/src/typings/overrides'
import { gql } from '@faststore/graphql-utils'
import { CustomBuyButton } from '../CustomBuyButton'

const SECTION = 'ProductDetails' as const

const override: SectionOverride = {
  section: SECTION,
  components: {
    BuyButton: { Component: CustomBuyButton },
  },
}

export { override }

export const fragment = gql`
  fragment CustomProductDetailsFragment_StoreProduct on StoreProduct {
    customData
  }
`
