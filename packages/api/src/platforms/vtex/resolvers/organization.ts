import type { Resolver } from '..'
import { IStoreOrganization } from '../../../__generated__/schema'

export type Root = IStoreOrganization

export const StoreOrganization: Record<string, Resolver> = {
  identifier: () => '',
}
