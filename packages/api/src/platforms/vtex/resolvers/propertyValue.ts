import type { Resolver } from '..'
import type { IStorePropertyValue } from '../../../__generated__/schema'
import { getPropertyId } from '../utils/propertyValue'

type Root = IStorePropertyValue

export const StorePropertyValue: Record<string, Resolver<Root>> = {
  propertyID: (root) => getPropertyId(root),
  name: ({ name }) => name,
  value: ({ value }) => value,
  valueReference: ({ valueReference }) => valueReference,
}
