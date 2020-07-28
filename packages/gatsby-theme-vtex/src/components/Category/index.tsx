/** @jsx jsx */
import { Category } from '@vtex/gatsby-source-vtex'
import { FC, Fragment } from 'react'
import { Flex, jsx } from 'theme-ui'

import Container from '../Container'
import BrandSelector from './Facets/Brands'
import CategoryTreeSelector from './Facets/CategoryTree'
import PageList from './PageList'
import Typography from '../material-ui-components/Typography'

interface Props {
  category: Category
}

// TODO: Style Typography
const CategoryTemplate: FC<Props> = ({ category }) => (
  <Container>
    <Flex sx={{ flexDirection: 'column' }} my={4}>
      <Typography component="h2">{category.name}</Typography>
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
          {category.facets.brands ? (
            <Fragment>
              <BrandSelector brands={category.facets.brands} />
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
