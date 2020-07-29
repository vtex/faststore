import React, { FC } from 'react'
import { graphql, useStaticQuery } from 'gatsby'
import makeStyles from '@material-ui/styles/makeStyles'
import type { Theme } from '@material-ui/core'

import Grid from './material-ui-components/Grid'
import Link from './material-ui-components/Link'

interface Item {
  name: string
  slug: string
}

const useGridStyles = makeStyles((theme: Theme) => ({
  root: {
    marginLeft: theme.spacing(4),
    [theme.breakpoints.down('xs')]: {
      margin: 0,
      paddingTop: theme.spacing(2),
      paddingBottom: theme.spacing(2),
      justifyContent: 'center',
    },
  },
}))

const useLinkStyles = makeStyles((theme: Theme) => ({
  root: {
    textDecoration: 'none',
    fontSize: theme.typography.body1.fontSize,
    '&:hover': {
      color: theme.palette.primary.main,
      textDecoration: 'none',
    },
    '&.active': {
      color: theme.palette.primary.main,
    },
  },
}))

const MenuLink: FC<Item> = ({ slug, name }) => {
  const classes = useLinkStyles()

  return (
    <Link classes={classes} to={`/${slug}`} activeClassName="active">
      {name.split(' ')[0]}
    </Link>
  )
}

const Menu: FC = () => {
  const { allCategory } = useStaticQuery(graphql`
    {
      allCategory(sort: { order: ASC, fields: categoryId }, limit: 2) {
        nodes {
          name
          slug
        }
      }
    }
  `)

  const classes = useGridStyles()

  return (
    <Grid
      component="nav"
      item
      container
      xs={12}
      sm
      classes={classes}
      spacing={3}
    >
      {allCategory.nodes.map((item: Item) => (
        <Grid item key={item.slug}>
          <MenuLink {...item} />
        </Grid>
      ))}
      <Grid item>
        <MenuLink slug="about" name="About" />
      </Grid>
    </Grid>
  )
}

export default Menu
