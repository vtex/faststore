import type { GraphqlResolver } from '..'
import {
  isBrand,
  isCategory,
  isCollection,
  type ByLinkIdBrandRoot,
  type ByLinkIdCategoryRoot,
  type ByLinkIdCollectionRoot,
} from '../loaders/collection'
import { slugify } from '../utils/slugify'

export type Root =
  | ByLinkIdCategoryRoot
  | ByLinkIdBrandRoot
  | ByLinkIdCollectionRoot

const slugifyRoot = (root: Root): string => {
  if (isCategory(root)) {
    // root.slug is the full accumulated input slug (e.g. "vestuario/camisetas"),
    // injected by the loader — no URL parsing needed.
    return root.slug
  }

  if (isBrand(root)) {
    return root.linkId
  }

  // collection — linkId may be null for clusters not yet registered in multilanguage
  return root.linkId ?? slugify(root.name)
}

export const StoreCollection: Record<string, GraphqlResolver<Root>> = {
  id: ({ id }) => id.toString(),
  slug: (root) => slugifyRoot(root),
  seo: (root) => ({
    title: root.title ?? root.name,
    description: root.metaTagDescription,
  }),
  type: (root) => {
    if (isBrand(root)) return 'Brand'
    if (isCollection(root)) return 'Collection'
    // Department = root category (no parent); Category = everything else.
    // SubCategory distinction (3rd level+) requires recursive parent lookup — deferred.
    return root.fatherCategoryId === null ? 'Department' : 'Category'
  },
  meta: (root) => {
    const slug = slugifyRoot(root)

    if (isBrand(root)) {
      return { selectedFacets: [{ key: 'brand', value: slug }] }
    }

    if (isCollection(root)) {
      return { selectedFacets: [{ key: 'productclusterids', value: root.id }] }
    }

    return {
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
     * Split slug into segments so each breadcrumb level gets its own
     * by-linkid result. For "vestuario/camisetas" this produces two loader
     * calls: one for "vestuario" and one for "vestuario/camisetas".
     */
    const segments = slug.split('/').filter(Boolean)
    const slugs = segments.map((_, index) =>
      segments.slice(0, index + 1).join('/')
    )

    const collections = await Promise.all(
      slugs.map((s) => collectionLoader.load(s))
    )

    return {
      itemListElement: collections.map((collection, index) => ({
        item: `/${slugifyRoot(collection)}`,
        name: collection.name,
        position: index + 1,
      })),
      numberOfItems: collections.length,
    }
  },
}
