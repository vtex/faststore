import type { Resolver } from '..'
import type { PromiseType } from '../../../typings'
import type { StoreOffer } from './offer'

export type Root = PromiseType<ReturnType<typeof StoreOffer.seller>>

export const StoreOrganization: Record<string, Resolver<Root>> = {
  identifier: () => '',
}
