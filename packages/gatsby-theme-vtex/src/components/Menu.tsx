import React, { FC } from 'react'
import { graphql, Link, useStaticQuery } from 'gatsby'
import makeStyles from '@material-ui/styles/makeStyles'
import type { Theme } from '@material-ui/core'

import Grid from './material-ui-components/Grid'

interface Item {
  name: string
  slug: string
}

const useStyles = makeStyles((theme: Theme) => ({
  root: {
    marginLeft: theme.spacing(4),
  },
  item: {
    textDecoration: 'none',
    fontSize: theme.typography.body1.fontSize,
    '&:hover': {
      color: theme.palette.primary.main,
    },
    '&.active': {
      color: theme.palette.primary.main,
    },
  },
}))

const MenuLink: FC<Item & { className: string }> = ({
  slug,
  name,
  className,
}) => (
  <Link className={className} to={`/${slug}`} activeClassName="active">
    {name.split(' ')[0]}
  </Link>
)

// TODO: Style nav
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

  const classes = useStyles()

  return (
    <Grid component="nav" item container xs classes={classes} spacing={3}>
      {allCategory.nodes.map((item: Item) => (
        <Grid item key={item.slug}>
          <MenuLink className={classes.item} {...item} />
        </Grid>
      ))}
      <Grid item>
        <MenuLink className={classes.item} slug="about" name="About" />
      </Grid>
    </Grid>
  )
}

export default Menu
