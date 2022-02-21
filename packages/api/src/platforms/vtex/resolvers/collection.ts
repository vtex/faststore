import { isCollectionPageType } from '../loaders/collection'
import { slugify as baseSlugify } from '../utils/slugify'
import type { Resolver } from '..'
import type { Brand } from '../clients/commerce/types/Brand'
import type { CategoryTree } from '../clients/commerce/types/CategoryTree'
import type { CollectionPageType } from '../clients/commerce/types/Portal'

type Root = Brand | (CategoryTree & { level: number }) | CollectionPageType

const isBrand = (x: any): x is Brand => x.type === 'brand'

const slugify = (root: Root) => {
  if (isBrand(root)) {
    return baseSlugify(root.name.toLowerCase())
  }

  if (isCollectionPageType(root)) {
    return new URL(`https://${root.url}`).pathname.slice(1)
  }

  return new URL(root.url).pathname.slice(1)
}

export const StoreCollection: Record<string, Resolver<Root>> = {
  id: ({ id }) => id.toString(),
  slug: (root) => slugify(root),
  seo: (root) =>
    isBrand(root) || isCollectionPageType(root)
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
      : isCollectionPageType(root)
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
            isCollectionPageType(root) ? `https://${root.url}` : root.url
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
      loaders: { collectionLoader },
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

    const collections = await Promise.all(
      slugs.map((s) => collectionLoader.load(s))
    )

    return {
      itemListElement: collections.map((collection, index) => ({
        item: new URL(`https://${collection.url}`).pathname.toLowerCase(),
        name: collection.name,
        position: index + 1,
      })),
      numberOfItems: collections.length,
    }
  },
}
