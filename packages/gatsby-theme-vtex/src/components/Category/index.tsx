import React, { FC, Fragment } from 'react'
import Box from '@material-ui/core/Box'
import { Category } from '@vtex/gatsby-source-vtex'
import { Divider } from '@material-ui/core'

import Container from '../Container'
import BrandSelector from './Facets/Brands'
import CategoryTreeSelector from './Facets/CategoryTree'
import PageList from './PageList'
import Typography from '../material-ui-components/Typography'

interface Props {
  category: Category
}

// TODO: Style Typography, Grid
const CategoryTemplate: FC<Props> = ({ category }) => (
  <Container>
    <Box pt={4}>
      <Typography variant="h3" component="h2">
        <Box fontWeight="fontWeightBold">{category.name}</Box>
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
          <Box py={1}>
            <Divider />
          </Box>
          {category.facets.CategoriesTrees?.[0] ? (
            <Fragment>
              <CategoryTreeSelector tree={category.facets.CategoriesTrees[0]} />
              <Box py={1}>
                <Divider />
              </Box>
            </Fragment>
          ) : null}
          {category.facets.brands ? (
            <Fragment>
              <BrandSelector brands={category.facets.brands} />
              <Box py={1}>
                <Divider />
              </Box>
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
    </Box>
  </Container>
)

export default CategoryTemplate
