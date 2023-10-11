import type { Resolver } from '..'
import type { StorePropertyValue as  StorePropertyValueType } from '../../../__generated__/schema'
import { getPropertyId } from '../utils/propertyValue'

export type Root = StorePropertyValueType

export const StorePropertyValue: Record<string, Resolver<Root>> = {
  propertyID: (root) => getPropertyId(root),
  name: ({ name }) => name,
  value: ({ value }) => value,
  valueReference: ({ valueReference }) => valueReference,
}
