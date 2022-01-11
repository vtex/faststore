import { slugify as baseSlugify } from '../utils/slugify'
import type { Resolver } from '..'
import type { Brand } from '../clients/commerce/types/Brand'
import type { CategoryTree } from '../clients/commerce/types/CategoryTree'
import type { PortalPagetype } from '../clients/commerce/types/Portal'

type Root = Brand | (CategoryTree & { level: number }) | PortalPagetype

const isBrand = (x: any): x is Brand => x.type === 'brand'

const isPortalPageType = (x: any): x is PortalPagetype =>
  typeof x.pageType === 'string'

const isCategoryTree = (x: any): x is CategoryTree =>
  typeof x.level === 'number'

const slugify = (root: Root) => {
  if (isBrand(root)) {
    return baseSlugify(root.name)
  }

  if (isPortalPageType(root)) {
    return new URL(`https://${root.url}`).pathname.slice(1)
  }

  return new URL(root.url).pathname.slice(1)
}

export const StoreCollection: Record<string, Resolver<Root>> = {
  id: ({ id }) => id.toString(),
  slug: (root) => slugify(root),
  seo: (root) =>
    isBrand(root) || isPortalPageType(root)
      ? {
          title: root.title,
          description: root.metaTagDescription,
        }
      : {
          title: root.Title,
          description: root.MetaTagDescription,
        },
  type: (root) =>
    isBrand(root)
      ? 'Brand'
      : isPortalPageType(root)
      ? root.pageType
      : root.level === 0
      ? 'Department'
      : 'Category',
  meta: (root) =>
    isBrand(root)
      ? {
          selectedFacets: [{ key: 'brand', value: baseSlugify(root.name) }],
        }
      : {
          selectedFacets: new URL(
            isPortalPageType(root) ? `https://${root.url}` : root.url
          ).pathname
            .slice(1)
            .split('/')
            .map((segment, index) => ({
              key: `category-${index + 1}`,
              value: baseSlugify(segment),
            })),
        },
  breadcrumbList: async (root, _, ctx) => {
    const {
      clients: { commerce },
    } = ctx

    const slug = slugify(root)

    /**
     * Split slug into segments so we fetch all data for
     * the breadcrumb. For instance, if we get `/foo/bar`
     * we need all metadata for both `/foo` and `/bar` and
     * thus we need to fetch pageType for `/foo` and `/bar`
     */
    const segments = slug.split('/').filter((segment) => Boolean(segment))
    const slugs = segments.map((__, index) =>
      segments.slice(0, index + 1).join('/')
    )

    const pageTypes = await Promise.all(
      slugs.map((s) => commerce.catalog.portal.pagetype(s))
    )

    return {
      itemListElement: pageTypes.map((pageType, index) => ({
        item: new URL(`https://${pageType.url}`).pathname,
        name: pageType.name,
        position: index + 1,
      })),
      numberOfItems: pageTypes.length,
    }
  },
}
