import { SessionProvider } from '@faststore/sdk'

import storeConfig from 'store.config'

import type { ProductCardProps } from '.'
import ProductCard from '.'

const story = {
  component: ProductCard,
  title: 'Components/ProductCard',
}

const product = {
  id: '15503951',
  slug: 'handmade-steel-towels-practical-15503951',
  sku: '15503951',
  brand: { brandName: 'Brand', name: 'Brand' },
  name: 'red',
  gtin: '5595633577807',
  isVariantOf: {
    productGroupID: '130742',
    name: 'Handmade Steel Towels Practical',
  },
  image: [
    {
      url: 'http://storeframework.vtexassets.com/arquivos/ids/190191/numquam.jpg?v=637755599170100000',
      alternateName: 'est',
    },
  ],
  offers: {
    lowPrice: 181.71,
    offers: [
      {
        availability: 'https://schema.org/InStock',
        price: 181.71,
        listPrice: 208.72,
        quantity: 1,
        seller: { identifier: '1' },
      },
    ],
  },
}

const Template = (args: ProductCardProps) => (
  <SessionProvider initialState={{ channel: storeConfig.channel }}>
    <div style={{ width: 300 }}>
      <ProductCard {...args} />
    </div>
  </SessionProvider>
)

export const Default = Template.bind({})

Default.args = {
  product,
  index: 1,
}

export default story
