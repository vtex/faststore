import type { Schema } from '../../index'

export interface ISort {
  '""': 'Relevance'
  'discount:desc': 'Discount'
  'release:desc': 'Release date'
  'name:asc': 'Name, ascending'
  'name:desc': 'Name, descending'
  'orders:desc': 'Sales'
  'price:asc': 'Price: Low to High'
  'price:desc': 'Price: High to Low'
}

export const Sort = {
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
