import type { GraphqlResolver } from '..'
import type { StoreOffer } from './offer'

export type Root = PromiseType<ReturnType<typeof StoreOffer.seller>>

export const StoreOrganization: Record<string, GraphqlResolver<Root>> = {
  identifier: () => '',
}
