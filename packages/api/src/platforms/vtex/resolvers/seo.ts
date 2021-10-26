import type { Resolver } from '..'

type Root = { title?: string; description?: string }

export const StoreSeo: Record<string, Resolver<Root>> = {
  title: ({ title }) => title ?? '',
  description: ({ description }) => description ?? '',
  titleTemplate: () => '',
  canonical: () => '',
}
