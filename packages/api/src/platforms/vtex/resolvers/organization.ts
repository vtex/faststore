import type { Resolver } from '..'
import { PromiseType } from '../../../typings'
import { StoreOffer } from './offer'

export type Root = PromiseType<ReturnType<typeof StoreOffer.seller>>

export const StoreOrganization: Record<string,  Resolver<Root>> = {
  identifier: () => '',
}
