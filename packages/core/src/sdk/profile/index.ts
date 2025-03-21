import { gql } from '@generated'

import type {
  ClientProfileQueryQuery as Query,
  ClientProfileQueryQueryVariables as Variables,
} from '@generated/graphql'
import { request } from '../graphql/request'

export const query = gql(`
  query ClientProfileQuery($userId: String!) {
    profile(userId: $userId) {
      addresses {
        country
        postalCode
        geoCoordinate
      }
    }
  }
`)

export const getAddresses = async (userId: string) => {
  const data = await request<Query, Variables>(query, { userId })
  return data.profile.addresses
}

export const getSavedAddress = async (userId: string) => {
  const addresses = await getAddresses(userId)
  // returning the first address of the list because there is no favorite address feature
  return addresses ? addresses[0] : null
}
