import { Link, useStaticQuery, graphql } from 'gatsby'
import React, { FC } from 'react'

interface Menu {
  name: string
  slug: string
}

const Menu: FC = () => {
  const { allCategory } = useStaticQuery(graphql`
    {
      allCategory(limit: 3, sort: { fields: [name], order: DESC }) {
        nodes {
          name
          slug
        }
      }
    }
  `)

  return (
    <>
      {allCategory.nodes.map((menu: Menu) => (
        <Link to={`/${menu.slug}`} key={menu.slug}>
          {menu.name}
        </Link>
      ))}
      <Link to="/about">About</Link>
    </>
  )
}

export default Menu
