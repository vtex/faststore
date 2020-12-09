import { gql } from '@vtex/gatsby-plugin-graphql'

import { request } from '../../graphql/request'
import { GetOrderFormQuery } from './__generated__/GetOrderFormQuery.graphql'
import { startOrderForm } from './orderForm'
import type {
  GetOrderFormQueryQuery,
  GetOrderFormQueryQueryVariables,
} from './__generated__/GetOrderFormQuery.graphql'
import type { CB } from './orderForm'

export const getOrderForm = async (orderFormId: string | undefined, cb: CB) => {
  const {
    vtex: { orderForm },
  } = await request<GetOrderFormQueryQuery, GetOrderFormQueryQueryVariables>({
    ...GetOrderFormQuery,
    variables: { orderFormId },
  })

  startOrderForm(orderForm, cb)
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
