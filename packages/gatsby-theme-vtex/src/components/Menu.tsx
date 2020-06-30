/** @jsx jsx */
import { graphql, Link, useStaticQuery } from 'gatsby'
import { FC } from 'react'
import { Flex, jsx } from 'theme-ui'

interface Item {
  name: string
  slug: string
}

const MenuLink: FC<Item> = ({ slug, name }) => (
  <Link
    to={`/${slug}`}
    activeClassName="active"
    sx={{
      m: 2,
      p: 2,
      mx: [1, 1, 2],
      px: [3, 1, 2],
      color: 'inherit',
      '&.active': {
        color: 'primary',
      },
    }}
  >
    {name.split(' ')[0]}
  </Link>
)

const Menu: FC = () => {
  const { allCategory } = useStaticQuery(graphql`
    {
      allCategory(limit: 2, sort: { fields: [name], order: ASC }) {
        nodes {
          name
          slug
        }
      }
    }
  `)

  return (
    <Flex as="nav">
      {allCategory.nodes.map((item: Item) => (
        <MenuLink {...item} key={item.slug} />
      ))}
      <MenuLink slug="about" name="About" />
    </Flex>
  )
}

export default Menu
