import React, { FC, Fragment } from 'react'

import Carousel from '../Carousel'
import Container from '../Container'
import Shelf from '../Shelf'
import { HomePageQueryQuery } from '../../__generated__/HomePageQuery.graphql'
import CAROUSEL_ITEMS from './carousel.json'

interface Props {
  data: HomePageQueryQuery
}

const HomeBlocks: FC<Props> = ({ data }) => (
  <Fragment>
    <Carousel allItems={CAROUSEL_ITEMS} autoplayTimeout={5e3} autoplay />
    <Container>
      <Shelf products={data.vtex.productSearch!.products!} />
    </Container>
  </Fragment>
)

export default HomeBlocks
