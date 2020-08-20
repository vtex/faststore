import React, { useMemo } from 'react'
import { Flex, Text } from 'theme-ui'
import unorm from 'unorm'
import Link from 'gatsby-link'

export interface NavigationItem {
  name: string
  href: string
}

export interface BreadcrumbProps {
  /** Shape [ '/Department' ,'/Department/Category'] */
  categories?: string[]
  categoryTree?: NavigationItem[]
  breadcrumb?: NavigationItem[]
  showOnMobile?: boolean
  homeIconSize?: number
  caretIconSize?: number
}

const makeLink = (str: string) =>
  unorm
    .nfd(str)
    .toLowerCase()
    .replace(/[\u0300-\u036f]/g, '')
    .trim()
    .replace(/[-\s]+/g, '-')

const getCategoriesList = (categories: string[]): NavigationItem[] => {
  const categoriesSorted = categories
    .slice()
    .sort((a, b) => a.length - b.length)

  return categoriesSorted.map((category) => {
    const categoryStripped = category.replace(/^\//, '').replace(/\/$/, '')
    const currentCategories = categoryStripped.split('/')
    const [categoryKey] = currentCategories.reverse()
    const linkCompletion = currentCategories.length === 1 ? '/d' : ''
    const href = `/${makeLink(categoryStripped)}${linkCompletion}`

    return {
      href,
      name: categoryKey,
    }
  })
}

const homeSvgProps = {
  width: '24',
  height: '24',
  viewBox: '0 0 24 24',
}

const caretSvgProps = {
  width: '24',
  height: '24',
  viewBox: '0 0 180 180',
}

export const Breadcrumb: React.FC<BreadcrumbProps> = ({
  categories,
  categoryTree,
  breadcrumb,
}) => {
  const navigationList = useMemo(
    () => breadcrumb ?? categoryTree ?? getCategoriesList(categories ?? []),
    [breadcrumb, categories, categoryTree]
  )

  return (
    <Flex data-testid="breadcrumb" variant="breadcrumb.container">
      <Link to="/">
        <Flex as="svg" variant="breadcrumb.homeIcon" {...homeSvgProps}>
          <path d="M21 13v10h-6v-6h-6v6h-6v-10h-3l12-12 12 12h-3zm-1-5.907v-5.093h-3v2.093l3 3z" />
        </Flex>
      </Link>
      {navigationList.map(({ name, href }, i) => (
        <Flex key={`navigation-item-${i}`} variant="breadcrumb.pair">
          <Flex as="svg" variant="breadcrumb.caretIcon" {...caretSvgProps}>
            <path
              d="M51.707,185.343c-2.741,0-5.493-1.044-7.593-3.149c-4.194-4.194-4.194-10.981,0-15.175
			l74.352-74.347L44.114,18.32c-4.194-4.194-4.194-10.987,0-15.175c4.194-4.194,10.987-4.194,15.18,0l81.934,81.934
			c4.194,4.194,4.194,10.987,0,15.175l-81.934,81.939C57.201,184.293,54.454,185.343,51.707,185.343z"
            />
          </Flex>
          <Link to={href} style={{ textDecoration: 'none ' }}>
            {/** We only what to apply a different style to the last item on Search pages */}
            <Text
              variant={`breadcrumb.${
                i === navigationList.length - 1 && breadcrumb
                  ? 'last'
                  : 'middle'
              }`}
            >
              {name}
            </Text>
          </Link>
        </Flex>
      ))}
    </Flex>
  )
}

Breadcrumb.defaultProps = {
  categories: [],
}
