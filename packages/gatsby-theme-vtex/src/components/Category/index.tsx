import React, { FC, Fragment } from 'react'
import { makeStyles, Divider } from '@material-ui/core'
import type { Theme } from '@material-ui/core'
import { Category } from '@vtex/gatsby-source-vtex'

import Container from '../Container'
import BrandSelector from './Facets/Brands'
import CategoryTreeSelector from './Facets/CategoryTree'
import PageList from './PageList'
import Typography from '../material-ui-components/Typography'

interface Props {
  category: Category
}

const useStyles = makeStyles((theme: Theme) => ({
  aside: {
    display: 'flex',
    flexGrow: 1,
    flexDirection: 'column',
    flexBasis: 'sidebar',
    minWidth: 250,
    [theme.breakpoints.up('md')]: {
      marginRight: '64px',
    },
    [theme.breakpoints.down('md')]: {
      marginRight: '0',
    },
    [theme.breakpoints.down('sm')]: {
      margin: '0',
    },
    [theme.breakpoints.up('sm')]: {
      margin: '32px',
    },
  },
  dividerContainer: {
    padding: `${theme.spacing(1)}px 0`,
  },
  categoryName: {
    fontWeight: theme.typography.fontWeightBold,
  },
}))

const CategoryTemplate: FC<Props> = ({ category }) => {
  const classes = useStyles()

  return (
    <Container>
      <div>
        <Typography className={classes.categoryName} variant="h3" component="h2">
          {category.name}
        </Typography>
        <div
          style={{
            display: 'flex',
            flexWrap: 'wrap',
          }}
        >
          <aside className={classes.aside}>
            <div style={{ fontSize: 20 }}>Filters</div>
            <div className={classes.dividerContainer}>
              <Divider />
            </div>
            {category.facets.CategoriesTrees?.[0] ? (
              <Fragment>
                <CategoryTreeSelector
                  tree={category.facets.CategoriesTrees[0]}
                />
                <div className={classes.dividerContainer}>
                  <Divider />
                </div>
              </Fragment>
            ) : null}
            {category.facets.brands ? (
              <Fragment>
                <BrandSelector brands={category.facets.brands} />
                <div className={classes.dividerContainer}>
                  <Divider />
                </div>
              </Fragment>
            ) : null}
          </aside>
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
      </div>
    </Container>
  )
}

export default CategoryTemplate
