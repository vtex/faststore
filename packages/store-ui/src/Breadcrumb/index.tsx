import React, { Fragment, useMemo } from 'react'
import unorm from 'unorm'
import { Flex } from '@vtex/store-ui'
import Link from 'gatsby-link'

export interface NavigationItem {
  name: string
  href: string
}

export interface Props {
  term?: string
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

const Breadcrumb: React.FC<Props> = ({
  term,
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
      <Link to="/" aria-label="Home">
        <Flex as="svg" variant="breadcrumb.homeIcon" {...homeSvgProps}>
          <path d="M21 13v10h-6v-6h-6v6h-6v-10h-3l12-12 12 12h-3zm-1-5.907v-5.093h-3v2.093l3 3z" />
        </Flex>
      </Link>
      {navigationList.map(({ name, href }, i) => (
        <span key={`navigation-item-${i}`} className={` ph2 c-muted-2`}>
          <span>Caret</span>
          <Link to={href}>{name}</Link>
        </span>
      ))}

      {term && (
        <Fragment>
          <span>Caret</span>
          <span>{term}</span>
        </Fragment>
      )}
    </Flex>
  )
}

Breadcrumb.defaultProps = {
  categories: [],
}

export default Breadcrumb
