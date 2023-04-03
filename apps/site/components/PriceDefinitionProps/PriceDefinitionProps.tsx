export const propsPriceDefinition = [
  {
    name: 'value',
    type: 'number',
    description: 'The raw price value.',
  },
  {
    name: 'listPrice',
    type: 'number',
    description: "Product's list price",
  },
  {
    name: 'formatter',
    type: 'PriceFormatter',
    description: '(price: number, variant: PriceVariant) => ReactNode',
  },
]
