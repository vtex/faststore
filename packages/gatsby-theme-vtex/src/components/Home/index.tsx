import React, { FC, Fragment } from 'react'

import Carousel, { Item } from '../Carousel'
import Container from '../Container'
import Shelf from '../Shelf'
import { HomePageQueryQuery } from '../../__generated__/HomePageQuery.graphql'

interface Props {
  data: HomePageQueryQuery
}

const itemsCarousel: Item[] = [
  {
    sources: [
      {
        srcSet:
          'https://storecomponents.vtexassets.com/assets/vtex.file-manager-graphql/images/db64dc83-dd58-49ff-8093-b9bd710d4600___3be6fb3cbcef0db2be3ad13631f2f356.jpg?width=360&aspect=true 360w',
        sizes: '360px',
      },
      {
        srcSet:
          'https://storecomponents.vtexassets.com/assets/vtex.file-manager-graphql/images/bd025904-c013-472a-99fc-dc26ccc7238c___f9dfe8885768021f405cc624eb6c20cd.jpg?width=1680&aspect=true&quality=9 1680w',
        sizes: '1680px',
      },
    ],
    heights: ['540px', '806px'],
    alt: 'Slide 1',
    href: '/apparel---accessories',
  },
  {
    sources: [
      {
        srcSet:
          'https://storecomponents.vtexassets.com/assets/vtex.file-manager-graphql/images/main___59700c0e5c56dcd769179d434f514892.webp?aspect=true&height=450',
      },
      {
        srcSet:
          'https://storecomponents.vtexassets.com/assets/vtex.file-manager-graphql/images/banner___ce945adede22a8fb5751cea8f2918859.png?width=1680&quality=2',
      },
    ],
    heights: ['540px', '806px'],
    alt: 'Slide 2',
    href: '/',
  },
]

const HomeBlocks: FC<Props> = ({ data }) => (
  <Fragment>
    <Carousel allItems={itemsCarousel} autoplay autoplayTimeout={3e3} />
    <Container>
      <Shelf products={data.vtex.productSearch!.products!} />
    </Container>
  </Fragment>
)

export default HomeBlocks
