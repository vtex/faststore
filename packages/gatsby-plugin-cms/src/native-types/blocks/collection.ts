import { Seo } from './seo'
import { Sort } from './sort'
import type { ISeo } from './seo'
import type { ISort } from './sort'
import type { Schema } from '../../index'

export interface ICategoryCollection {
  sort: keyof ISort
  categoryId: string
}

export interface IBrandCollection {
  sort: keyof ISort
  brandId: string
}

export interface IClusterCollection {
  seo: ISeo
  sort: keyof ISort
  clusterId: string
}

export const isCategoryCollection = (
  x: ICollection
): x is ICategoryCollection => typeof (x as any).categoryId === 'string'

export const isBrandCollection = (x: ICollection): x is IBrandCollection =>
  typeof (x as any).brandId === 'string'

export const isClusterCollection = (x: ICollection): x is IClusterCollection =>
  typeof (x as any).clusterId === 'string'

/**
 * Definition of a Collection in the CMS
 */
export type ICollection =
  | ICategoryCollection
  | IBrandCollection
  | IClusterCollection

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
        sort: Sort,
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
        sort: Sort,
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
        sort: Sort,
        seo: Seo,
      },
    },
  ],
} as Schema
