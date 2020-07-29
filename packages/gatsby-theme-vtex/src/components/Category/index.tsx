import React, { FC, Fragment } from 'react'
import Box from '@material-ui/core/Box'
import { Category } from '@vtex/gatsby-source-vtex'

import Container from '../Container'
import BrandSelector from './Facets/Brands'
import CategoryTreeSelector from './Facets/CategoryTree'
import PageList from './PageList'
import Typography from '../material-ui-components/Typography'
import Grid from '../material-ui-components/Grid'

interface Props {
  category: Category
}

// TODO: Style Typography, Grid
const CategoryTemplate: FC<Props> = ({ category }) => (
  <Container>
    <Grid direction="column" item>
      <Typography variant="h2" component="h2">
        {category.name}
      </Typography>
      <div
        style={{
          display: 'flex',
          flexWrap: 'wrap',
        }}
      >
        <Box
          component="aside"
          marginY={['0', '32px']}
          marginRight={['0', '0', '64px']}
          style={{
            display: 'flex',
            flexGrow: 1,
            flexDirection: 'column',
            flexBasis: 'sidebar',
            minWidth: 250,
          }}
        >
          <div style={{ fontSize: 20 }}>Filters</div>
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
        </Box>
        <div
          style={{
            flexGrow: 99999,
            flexBasis: 0,
            minWidth: 300,
          }}
        >
          <PageList category={category} />
        </div>
      </div>
    </Grid>
  </Container>
)

export default CategoryTemplate
