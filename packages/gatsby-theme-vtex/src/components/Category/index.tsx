/** @jsx jsx */
import { Category } from '@vtex/gatsby-source-vtex'
import { FC, lazy } from 'react'
import { Flex, Heading, jsx, Grid } from 'theme-ui'

import Container from '../Container'
import { SuspenseSSR } from '../SuspenseSSR'
import { ProductList } from '../ProductList'

const AsyncProductList = lazy(() => import('./ProductList'))

interface Props {
  category: Category
}

const SyncCategoryTemplate: FC<Props> = ({ category }) => (
  <Container>
    <Flex sx={{ flexDirection: 'column' }} my={4}>
      <Heading as="h2">{category.name}</Heading>
      <SuspenseSSR
        fallback={
          <Grid my={4} gap={3} columns={[1, 2, 3, 4]}>
            <ProductList syncProducts={category.products} />
          </Grid>
        }
      >
        <AsyncProductList category={category} />
      </SuspenseSSR>
    </Flex>
  </Container>
)

export default SyncCategoryTemplate
