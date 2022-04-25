import { Card, CardContent, CardImage } from '@faststore/ui'

import { Image } from 'src/components/ui/Image'
import Price from 'src/components/ui/Price'
import { useFormattedPrice } from 'src/sdk/product/useFormattedPrice'

// TODO: Remove it when integration is complete
const PRODUCTS = [
  {
    price: 46.26,
    listPrice: 72.06,
    name: 'Ergonomic Wooden Bacon',
    image: [
      {
        alternateName: 'rerum',
        url: 'http://storeframework.vtexassets.com/arquivos/ids/167285/ut.jpg?v=637753017045600000',
      },
    ],
  },
]

function SuggestionProductCard({
  // TODO: Add Props interface and define `product` type
  product = PRODUCTS[0],
}) {
  const {
    name,
    listPrice,
    price,
    image: [img],
  } = product

  return (
    <Card
      className="suggestion-product-card"
      data-testid="suggestion-product-card"
    >
      <CardContent>
        <CardImage>
          <Image src={img.url} alt={img.alternateName} width={56} height={56} />
        </CardImage>
        <div data-suggestion-product-card-summary>
          <p className="text__title-mini" data-suggestion-product-card-title>
            {name}
          </p>
          <span data-suggestion-product-card-prices>
            <Price
              value={listPrice}
              formatter={useFormattedPrice}
              testId="list-price"
              data-value={listPrice}
              variant="listing"
              classes="text__legend"
              SRText="Original price:"
            />
            <Price
              value={price}
              formatter={useFormattedPrice}
              testId="price"
              data-value={price}
              variant="spot"
              classes="text__title-mini"
              SRText="Price:"
            />
          </span>
        </div>
      </CardContent>
    </Card>
  )
}

export default SuggestionProductCard
