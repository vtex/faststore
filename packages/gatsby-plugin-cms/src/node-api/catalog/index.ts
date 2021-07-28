import type { Schema } from '../../index'

type Sort =
  | '' // 'Relevance',
  | 'price:desc' // 'Price: High to Low',
  | 'price:asc' // 'Price: Low to High',
  | 'orders:desc' // 'Sales',
  | 'name:desc' // 'Name, descending',
  | 'name:asc' // 'Name, ascending',
  | 'release:desc' // 'Release date',
  | 'discount:desc' // 'Discount',

export interface ICategoryCollection {
  sort: Sort
  categoryId: string
}

export interface IBrandCollection {
  sort: Sort
  brandId: string
}

export interface IClusterCollection {
  seo: {
    slug: string
    title: string
    description: string
  }
  sort: Sort
  clusterId: string
}

/**
 * Definition of a Collection in the CMS
 */
export type ICollection =
  | ICategoryCollection
  | IBrandCollection
  | IClusterCollection

export const isCategoryCollection = (
  x: ICollection
): x is ICategoryCollection => typeof (x as any).categoryId === 'string'

export const isBrandCollection = (x: ICollection): x is IBrandCollection =>
  typeof (x as any).brandId === 'string'

export const isClusterCollection = (x: ICollection): x is IClusterCollection =>
  typeof (x as any).clusterId === 'string'

const SeoSchema = {
  type: 'object',
  title: 'Seo',
  widget: {
    'ui:ObjectFieldTemplate': 'GoogleSeoPreview',
  },
  required: ['title', 'description', 'slug'],
  properties: {
    title: {
      type: 'string',
      title: 'Title',
      description:
        'Appears in the browser tab and is suggested for search engines',
      default: 'Page title',
    },
    slug: {
      type: 'string',
      title: 'URL slug',
      description: "Final part of the page's address. No spaces allowed.",
      default: '/path/to/page',
      pattern: '^/([a-zA-Z0-9]|-|/|_)*',
    },
    description: {
      type: 'string',
      title: 'Description (Meta description)',
      description: 'Suggested for search engines',
      default: 'Page description',
    },
  },
} as Schema

const SortSchema = {
  title: 'Default ordering',
  type: 'string',
  default: '""',
  enum: [
    '""',
    'discount:desc',
    'release:desc',
    'name:asc',
    'name:desc',
    'orders:desc',
    'price:asc',
    'price:desc',
  ],
  enumNames: [
    'Relevance',
    'Discount',
    'Release date',
    'Name, ascending',
    'Name, descending',
    'Sales',
    'Price: Low to High',
    'Price: High to Low',
  ],
} as Schema

export const Collection = {
  title: 'Collection',
  description: 'Definition of a Collection for the CMS',
  oneOf: [
    {
      title: 'Category',
      description: 'Configure a Category',
      type: 'object',
      required: ['categoryId', 'sort'],
      properties: {
        categoryId: {
          title: 'Category ID',
          type: 'string',
        },
        sort: SortSchema,
      },
    },
    {
      title: 'Brand',
      description: 'Configure a Brand',
      type: 'object',
      required: ['brandId', 'sort'],
      properties: {
        brandId: {
          title: 'Brand ID',
          type: 'string',
        },
        sort: SortSchema,
      },
    },
    {
      title: 'Collection',
      description: 'Configure a Collection',
      type: 'object',
      required: ['clusterId', 'sort', 'seo'],
      properties: {
        clusterId: {
          title: 'Collection ID',
          type: 'string',
        },
        sort: SortSchema,
        seo: SeoSchema,
      },
    },
  ],
} as Schema
