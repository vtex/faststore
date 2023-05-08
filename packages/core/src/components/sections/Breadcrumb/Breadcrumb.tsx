import { memo } from 'react'

import Breadcrumb from 'src/components/ui/Breadcrumb'

import Section from '../Section'

import {
  ProductDetailsFragment_ProductFragment,
  ServerCollectionPageQueryQuery,
} from '@generated/graphql'
import styles from './section.module.scss'

type BreadcrumbContext =
  | ProductDetailsFragment_ProductFragment
  | ServerCollectionPageQueryQuery['collection']

interface BreadcrumbSectionProps {
  context?: BreadcrumbContext
  icon: string
  alt: string
}

const isProduct = (x: any): x is ProductDetailsFragment_ProductFragment =>
  !!x?.sku
const isCollection = (
  x: any
): x is ServerCollectionPageQueryQuery['collection'] => !!x?.seo

function BreadcrumbSection({ context, ...otherProps }: BreadcrumbSectionProps) {
  const title = isCollection(context) ? context?.seo?.title : 'All Products'
  const fallback = [{ item: '/', name: title, position: 1 }]
  const breadcrumbList = isProduct(context)
    ? context?.breadcrumbList?.itemListElement
    : isCollection(context)
    ? context?.breadcrumbList?.itemListElement
    : fallback

  return (
    <Section className={`${styles.section} section-breadcrumb layout__content`}>
      <Breadcrumb breadcrumbList={breadcrumbList} {...otherProps} />
    </Section>
  )
}

export default memo(BreadcrumbSection)
