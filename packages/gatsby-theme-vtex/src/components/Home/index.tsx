import React, { FC, Fragment } from 'react'

import Carousel from '../Carousel'
import Container from '../Container'
import Shelf from '../Shelf'
import { HomePageQueryQuery } from '../../__generated__/HomePageQuery.graphql'

type Props = { pageData: HomePageQueryQuery }

const itemsCarousel = [
  {
    src:
      'https://storecomponents.vtexassets.com/assets/faststore/images/banner___febafa22a7ffc9a7f2fd049f416e7c7b.webp?aspect=true&height=450',
    mobileSrc:
      'https://storecomponents.vtexassets.com/assets/faststore/images/banner___febafa22a7ffc9a7f2fd049f416e7c7b.webp?aspect=true&height=450',
    altText: 'Slide 2',
    width: 1024,
    height: 400,
  },
  {
    src:
      'https://storecomponents.vtexassets.com/assets/vtex.file-manager-graphql/images/main___59700c0e5c56dcd769179d434f514892.webp?aspect=true&height=450',
    mobileSrc:
      'https://storecomponents.vtexassets.com/assets/vtex.file-manager-graphql/images/main___59700c0e5c56dcd769179d434f514892.webp?aspect=true&height=450',
    altText: 'Slide 1',
    width: 1024,
    height: 400,
  },
]

const HomeBlocks: FC<Props> = ({ pageData }) => {
  return (
    <Fragment>
      <Carousel items={itemsCarousel} />
      <Container>
        <Shelf products={pageData.vtex.productSearch!.products!} />
      </Container>
    </Fragment>
  )
}

export default HomeBlocks
