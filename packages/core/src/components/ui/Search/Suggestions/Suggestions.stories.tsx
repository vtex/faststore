import { SessionProvider } from '@faststore/sdk'

import Suggestions from '.'
import type { SuggestionsProps } from '.'

const product = ({ id = '1', name = 'Handmade Steel Towels Practical' }) => ({
  id,
  slug: 'handmade-steel-towels-practical-15503951',
  sku: '15503951',
  brand: { brandName: 'Brand', name: 'Brand' },
  name: 'red',
  gtin: '5595633577807',
  isVariantOf: {
    productGroupID: '130742',
    name,
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
})

const meta = {
  component: Suggestions,
  title: 'Organisms/Search/Suggestions',
}

const Template = (props: SuggestionsProps) => (
  <div
    style={{
      maxWidth: '600px',
      margin: '0 auto',
      padding: '0 16px',
      background: 'white',
    }}
  >
    <SessionProvider>
      <Suggestions {...props} />
    </SessionProvider>
  </div>
)

export const Default = Template.bind({})

Default.args = {
  term: 'Ste',
  terms: ['Steel', 'Stellar'],
  products: [
    product({ id: '1', name: 'Handmade Steel Towels Practical' }),
    product({ id: '2', name: 'Steel Towels' }),
    product({ id: '3', name: 'Steel Practical' }),
  ],
}

Default.parameters = {
  backgrounds: { default: 'dark' },
}

export default meta
