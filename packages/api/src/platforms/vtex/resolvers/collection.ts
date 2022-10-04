import { isCollectionPageType } from '../loaders/collection'
import { slugify } from '../utils/slugify'
import type { Resolver } from '..'
import type { Brand } from '../clients/commerce/types/Brand'
import type { CategoryTree } from '../clients/commerce/types/CategoryTree'
import type { CollectionPageType } from '../clients/commerce/types/Portal'

type Root = Brand | (CategoryTree & { level: number }) | CollectionPageType

const isBrand = (x: any): x is Brand | CollectionPageType =>
  x.type === 'brand' ||
  (isCollectionPageType(x) && x.pageType.toLowerCase() === 'brand')

const isCollection = (x: Root): x is CollectionPageType =>
  isCollectionPageType(x) && x.pageType.toLowerCase() === 'collection'

const slugifyRoot = (root: Root) => {
  if (isBrand(root) || isCollection(root)) {
    return slugify(root.name)
  }

  if (isCollectionPageType(root)) {
    return new URL(`https://${root.url}`).pathname.slice(1).toLowerCase()
  }

  return new URL(root.url).pathname.slice(1).toLowerCase()
}

export const StoreCollection: Record<string, Resolver<Root>> = {
  id: ({ id }) => id.toString(),
  slug: (root) => slugifyRoot(root),
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
  meta: (root) => {
    const slug = slugifyRoot(root)

    return isBrand(root)
      ? {
          selectedFacets: [{ key: 'brand', value: slug }],
        }
      : isCollection(root)
      ? {
          selectedFacets: [{ key: 'productclusterids', value: root.id }],
        }
      : {
          selectedFacets: slug.split('/').map((segment, index) => ({
            key: `category-${index + 1}`,
            value: segment,
          })),
        }
  },
  breadcrumbList: async (root, _, ctx) => {
    const {
      loaders: { collectionLoader },
    } = ctx

    const slug = slugifyRoot(root)

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

    const collections: (CollectionPageType & {
      slug: string
    })[] = await Promise.all(
      slugs.map(async (s) => {
        const collection = await collectionLoader.load(s)
        return { slug: s, ...collection }
      })
    )

    return {
      itemListElement: collections.map((collection, index) => ({
        item: isCollection(collection)
          ? `/${collection.slug}`
          : new URL(
              `https://${(collection as CollectionPageType).url}`
            ).pathname.toLowerCase(),
        name: collection.name,
        position: index + 1,
      })),
      numberOfItems: collections.length,
    }
  },
}
