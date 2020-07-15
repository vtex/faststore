/** @jsx jsx */
import { Category } from '@vtex/gatsby-source-vtex'
import { FC, Fragment } from 'react'
import { Flex, Heading, jsx } from 'theme-ui'

import Container from '../Container'
import BrandSelector from './Facets/Brands'
import CategoryTreeSelector from './Facets/CategoryTree'
import PageList from './PageList'

interface Props {
  category: Category
}

const CategoryTemplate: FC<Props> = ({ category }) => (
  <Container>
    <Flex sx={{ flexDirection: 'column' }} my={4}>
      <Heading sx={{ fontSize: 6 }} as="h2">
        {category.name}
      </Heading>
      <div
        sx={{
          display: 'flex',
          flexWrap: 'wrap',
        }}
      >
        <aside
          sx={{
            my: [0, 4],
            flexGrow: 1,
            flexBasis: 'sidebar',
            minWidth: 250,
            mr: [0, 0, 5],
          }}
        >
          <div sx={{ fontSize: 3 }}>Filters</div>
          <hr />
          {category.facets.CategoriesTrees?.[0] ? (
            <Fragment>
              <CategoryTreeSelector tree={category.facets.CategoriesTrees[0]} />
              <hr />
            </Fragment>
          ) : null}
          {category.facets.Brands ? (
            <Fragment>
              <BrandSelector
                brands={category.facets.Brands}
                name={category.name}
              />
              <hr />
            </Fragment>
          ) : null}
        </aside>
        <div
          sx={{
            flexGrow: 99999,
            flexBasis: 0,
            minWidth: 300,
          }}
        >
          <PageList category={category} />
        </div>
      </div>
    </Flex>
  </Container>
)

export default CategoryTemplate
