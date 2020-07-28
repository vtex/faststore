import React, { FC } from 'react'
import { graphql, Link, useStaticQuery } from 'gatsby'

import Grid from './material-ui-components/Grid'

interface Item {
  name: string
  slug: string
}

const MenuLink: FC<Item> = ({ slug, name }) => (
  <Link to={`/${slug}`} activeClassName="active">
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

  return (
    <Grid component="nav" item>
      {allCategory.nodes.map((item: Item) => (
        <MenuLink {...item} key={item.slug} />
      ))}
      <MenuLink slug="about" name="About" />
    </Grid>
  )
}

export default Menu
