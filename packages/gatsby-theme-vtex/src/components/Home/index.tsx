import { useIntl } from '@vtex/gatsby-plugin-i18n'
import React, { FC, Fragment } from 'react'

import { HomePageQueryQuery } from '../../__generated__/HomePageQuery.graphql'
import Carousel from '../Carousel'
import Container from '../Container'
import Shelf from '../Shelf'
import CAROUSEL_ITEMS from './carousel.json'

interface Props {
  data: HomePageQueryQuery
}

const HomeBlocks: FC<Props> = ({ data }) => {
  const { formatMessage } = useIntl()

  return (
    <Fragment>
      <Carousel allItems={CAROUSEL_ITEMS} autoplayTimeout={5e3} autoplay />
      <Container>
        <Shelf
          products={data.vtex.productSearch!.products!}
          title={formatMessage({ id: 'shelf.title.0' })}
          showArrows
          showDots
          autoplay={false}
          pageSizes={[1, 3, 5]}
        />
      </Container>
    </Fragment>
  )
}

export default HomeBlocks
