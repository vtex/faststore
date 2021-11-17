import type { Resolver } from '..'
import type { Brand } from '../clients/commerce/types/Brand'
import type { CategoryTree } from '../clients/commerce/types/CategoryTree'
import type { PortalPagetype } from '../clients/commerce/types/Portal'
import { slugify } from '../utils/slugify'

type Root = Brand | (CategoryTree & { level: number }) | PortalPagetype

const isBrand = (x: any): x is Brand | PortalPagetype =>
  x.type === 'brand' || x.pageType === 'Brand'

export const StoreCollection: Record<string, Resolver<Root>> = {
  id: ({ id }) => id.toString(),
  slug: ({ name }) => slugify(name),
  seo: (root) =>
    isBrand(root)
      ? {
          title: root.title,
          description: root.metaTagDescription,
        }
      : {
          title: root.Title,
          description: root.MetaTagDescription,
        },
  type: (root) =>
    isBrand(root) ? 'Brand' : root.level === 0 ? 'Department' : 'Category',
  meta: (root) =>
    isBrand(root)
      ? {
          selectedFacets: [{ key: 'brand', value: slugify(root.name) }],
        }
      : {
          selectedFacets: new URL(root.url).pathname
            .slice(1)
            .split('/')
            .map((segment, index) => ({
              key: `category-${index + 1}`,
              value: slugify(segment),
            })),
        },
  breadcrumbList: () => ({
    itemListElement: [],
    numberOfItems: 0,
  }),
}
