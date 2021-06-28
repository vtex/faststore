import { gql } from '@vtex/gatsby-plugin-graphql'

import { request } from '../../graphql/request'
import { GetOrderFormQuery } from './__generated__/GetOrderFormQuery.graphql'
import { clearOrderFormId, getOrderformId, setOrderFormId } from './orderForm'
import type {
  GetOrderFormQueryQuery,
  GetOrderFormQueryQueryVariables,
} from './__generated__/GetOrderFormQuery.graphql'

export const getOrderForm = async () => {
  try {
    const orderFormId = getOrderformId()
    const {
      vtex: { orderForm },
    } = await request<GetOrderFormQueryQuery, GetOrderFormQueryQueryVariables>({
      ...GetOrderFormQuery,
      variables: { orderFormId },
      fetchOptions: {
        method: 'POST', // Use POST to prevent caching
      },
    })

    setOrderFormId(orderForm.id)

    return orderForm
  } catch (err) {
    // Check if checkout return status code is related to request or server errors
    if (err.extensions?.exception?.status >= 400) {
      // If anything goes wrong on this step,
      // let's try to self heal by removing any cached orderForm
      clearOrderFormId()
    }

    throw err
  }
}

export const query = gql`
  query GetOrderFormQuery($orderFormId: ID) {
    vtex {
      orderForm(orderFormId: $orderFormId) {
        ...OrderFormFragment_orderForm
      }
    }
  }
`
