import { gql } from '@generated'

import type {
  ClientProfileQueryQuery as Query,
  ClientProfileQueryQueryVariables as Variables,
} from '@generated/graphql'
import { request } from '../graphql/request'

export const query = gql(`
  query ClientProfileQuery($id: String!) {
    profile(id: $id) {
      addresses {
        country
        postalCode
        geoCoordinate
      }
    }
  }
`)

export const getAddresses = async (id: string) => {
  const data = await request<Query, Variables>(query, { id })
  return data.profile.addresses
}

export const getSavedAddress = async (id: string) => {
  const addresses = await getAddresses(id)
  // returning the first address of the list because there is no favorite address feature
  return addresses ? addresses[0] : null
}
