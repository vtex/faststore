import { gql } from '@generated'

export const fragment = gql(`
  fragment ServerCollectionPage on Query {
    collection(slug: $slug) {
      id
    }
  }
`)
