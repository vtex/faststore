import React from 'react'
import Playground from '@site/src/components/PlaygroundShow'
import ReactLiveScope from '@site/src/theme/ReactLiveScope'

function PlaygroundPreview() {
  return (
    <Playground
      jsx
      scope={ReactLiveScope}
      live
    >
      {`<ProductCard>
  <ProductCardImage>
      <img alt="Basketball" src="https://vtexhelp.vtexassets.com/assets/docs/src/BasketBall___bda03bc66609682f02a8c322b423fd20.png"/>
  </ProductCardImage>
  <ProductCardContent>
      <h3>Authentic Outdoor Basketball</h3>
      <div>
          <Price
              value={89.9}
              variant="selling"
              style={{ textDecoration: 'line-through' }}
          />
          <Price value={68.9} variant="selling" />
      </div>
      <Badge>15% OFF</Badge>
  </ProductCardContent>
  <ProductCardActions>
      <Button onClick={() => null}>Add to Cart</Button>
  </ProductCardActions>
</ProductCard>`}
    </Playground>
  )
}

export default PlaygroundPreview