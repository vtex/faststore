import { gql, request } from '@vtex/gatsby-plugin-graphql'

export const mutation = gql`
  mutation UpdateSelectedAddressMutation(
    $postalCode: String
    $orderFormId: String
  ) {
    updateSelectedAddress(
      input: {
        postalCode: $postalCode
        addressType: "residential"
        country: "brazil"
      }
      orderFormId: "ecce086d3d92425fb7727ccc37bf61e7"
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
      }
    }
  }
`
