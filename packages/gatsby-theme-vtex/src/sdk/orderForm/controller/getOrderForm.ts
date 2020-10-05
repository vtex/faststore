import { gql } from '@vtex/gatsby-plugin-graphql'

import { request } from '../../graphql/request'
import {
  GetOrderFormQuery,
  GetOrderFormQueryQuery,
  GetOrderFormQueryQueryVariables,
} from './__generated__/GetOrderFormQuery.graphql'
import { CB, startOrderForm } from './orderForm'

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
