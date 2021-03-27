import { gql } from '@vtex/gatsby-plugin-graphql'

import { request } from '../graphql/request'
import { SetRegionMutation } from './__generated__/SetRegionMutation.graphql'

export const setRegion = async ({
  postalCode,
  orderFormId,
}: {
  postalCode: string
  orderFormId: string
}) => {
  const result = await request({
    ...SetRegionMutation,
    variables: {
      orderFormId,
      postalCode,
    },
  })

  return result
}

export const mutation = gql`
  mutation SetRegionMutation(
    $postalCode: String
    $country: String = "BRA"
    $addressType: VTEX_AddressType = residential
    $orderFormId: ID
  ) {
    updateSelectedAddress(
      input: {
        postalCode: $postalCode
        country: $country
        addressType: $addressType
      }
      orderFormId: $orderFormId
    ) {
      id
      shipping {
        availableAddresses {
          postalCode
          receiverName
          reference
          state
          street
          number
          neighborhood
          isDisposable
          geoCoordinates
          country
          complement
          city
          addressType
          addressId
        }
        selectedAddress {
          addressId
          addressType
          city
          complement
          country
          geoCoordinates
          isDisposable
          neighborhood
          postalCode
          number
          receiverName
          reference
          state
          street
        }
      }
    }
  }
`
