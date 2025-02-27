import { gql } from '@generated'

import type {
  CreateProductReviewMutationVariables as Variables,
  CreateProductReviewMutation as Mutation,
} from '../../../@generated/graphql'
import { useLazyQuery } from '../graphql/useLazyQuery'

export const mutation = gql(`
  mutation CreateProductReview($data: ICreateProductReview!) {
    createProductReview(data: $data)
  }
`)

export const useAddReview = () => {
  const [createProductReview, { data, error, isValidating: loading }] =
    useLazyQuery<Mutation, Variables>(mutation, {
      data: { productId: '', rating: 0, title: '', text: '', reviewerName: '' },
    })

  return {
    createProductReview,
    data,
    error,
    loading,
  }
}
