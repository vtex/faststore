/** @jsx jsx */
import { Category } from '@vtex/gatsby-source-vtex'
import { FC, lazy } from 'react'
import { Flex, Heading, jsx } from 'theme-ui'

import Container from '../Container'
import { SuspenseSSR } from '../SuspenseSSR'
import Page from './Page'

const ListControler = lazy(() => import('./List'))

interface Props {
  category: Category
}

const CategoryTemplate: FC<Props> = ({ category }) => {
  const { products } = category
  const StaticPage = products.length > 0 ? <Page products={products} /> : null

  return (
    <Container>
      <Flex sx={{ flexDirection: 'column' }} my={4}>
        <Heading as="h2">{category.name}</Heading>
        <div sx={{ my: 4 }}>
          {StaticPage}
          {/* <SuspenseSSR fallback={null}>
            <ListControler category={category} />
          </SuspenseSSR> */}
        </div>
      </Flex>
    </Container>
  )
}

export default CategoryTemplate
