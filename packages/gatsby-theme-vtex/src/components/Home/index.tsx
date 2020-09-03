import React, { FC, Fragment } from 'react'

import Carousel from '../Carousel'
import Container from '../Container'
import Shelf from '../Shelf'
import { HomePageQueryQuery } from '../../__generated__/HomePageQuery.graphql'

interface Props {
  data: HomePageQueryQuery
}

const itemsCarousel = [
  {
    sources: [
      {
        srcSet:
          'https://storecomponents.vtexassets.com/assets/faststore/images/banner___febafa22a7ffc9a7f2fd049f416e7c7b.webp?aspect=true&height=450',
      },
      {
        srcSet:
          'https://storecomponents.vtexassets.com/assets/faststore/images/banner___febafa22a7ffc9a7f2fd049f416e7c7b.webp?aspect=true&height=450',
      },
    ],
    heights: ['238px', '307px'],
    alt: 'Slide 2',
  },
  {
    sources: [
      {
        srcSet:
          'https://storecomponents.vtexassets.com/assets/vtex.file-manager-graphql/images/main___59700c0e5c56dcd769179d434f514892.webp?aspect=true&height=450',
      },
      {
        srcSet:
          'https://storecomponents.vtexassets.com/assets/vtex.file-manager-graphql/images/main___59700c0e5c56dcd769179d434f514892.webp?aspect=true&height=450',
      },
    ],
    heights: ['238px', '307px'],
    alt: 'Slide 1',
  },
]

const HomeBlocks: FC<Props> = ({ data }) => {
  return (
    <Fragment>
      <Carousel items={itemsCarousel} />
      <Container>
        <Shelf products={data.vtex.productSearch!.products!} />
      </Container>
    </Fragment>
  )
}

export default HomeBlocks
