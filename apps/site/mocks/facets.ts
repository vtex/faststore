import { FilterFacet } from '../components/Filter/FilterUsage'

export const facetsMock = [
  {
    key: 'price',
    label: 'Price',
    min: {
      selected: 1.67,
      absolute: 1.67,
    },
    max: {
      selected: 889.53,
      absolute: 889.53,
    },
    __typename: 'StoreFacetRange',
  },
  {
    key: 'category-2',
    label: 'Category',
    values: [
      {
        label: 'Chairs',
        value: 'chairs',
        selected: true,
        quantity: 138,
      },
      {
        label: 'Desks',
        value: 'desks',
        selected: false,
        quantity: 125,
      },
    ],
    __typename: 'StoreFacetBoolean',
  },
  {
    key: 'brand',
    label: 'Brand',
    values: [
      {
        label: 'Acer',
        value: 'acer',
        selected: true,
        quantity: 138,
      },
      {
        label: 'Adidas',
        value: 'adidas',
        selected: false,
        quantity: 121,
      },
      {
        label: 'Nike',
        value: 'nike',
        selected: false,
        quantity: 150,
      },
    ],
    __typename: 'StoreFacetBoolean',
  },
] as FilterFacet[]
