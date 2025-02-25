import type { Resolver } from '..'
import type { PromiseType } from '../../../typings'
import type { StoreProduct } from './product'

export type Root = PromiseType<ReturnType<typeof StoreProduct.seo>> & {
  titleTemplate?: string
}

export const StoreSeo: Record<string, Resolver<Root>> = {
  title: ({ title }) => title ?? '',
  description: ({ description }) => description ?? '',
  metaTagDescription: ({ metaTagDescription }) => metaTagDescription ?? '',
  canonical: ({ canonical }) => canonical ?? '',
  titleTemplate: () => '',
}
