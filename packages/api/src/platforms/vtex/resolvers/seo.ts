import type { Resolver } from '..'

type Root = { title?: string; description?: string; canonical?: string }

export const StoreSeo: Record<string, Resolver<Root>> = {
  title: ({ title }) => title ?? '',
  description: ({ description }) => description ?? '',
  canonical: ({ canonical }) => canonical ?? '',
  titleTemplate: () => '',
}
