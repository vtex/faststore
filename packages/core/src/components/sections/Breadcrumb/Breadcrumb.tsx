import { memo } from 'react'

import Breadcrumb from 'src/components/ui/Breadcrumb'

import Section from '../Section'

import {
  ServerCollectionPageQueryQuery,
  ServerProductPageQueryQuery,
} from '@generated/graphql'
import styles from './section.module.scss'

type BreadcrumbContext =
  | ServerProductPageQueryQuery['product']
  | ServerCollectionPageQueryQuery['collection']

interface BreadcrumbSectionProps {
  context?: BreadcrumbContext
  icon: string
  alt: string
}

const isProduct = (x: any): x is ServerProductPageQueryQuery['product'] =>
  x?.sku != undefined && x?.sku != null
const isCollection = (
  x: any
): x is ServerCollectionPageQueryQuery['collection'] =>
  x?.seo != undefined && x?.seo != null && x?.sku == undefined

function BreadcrumbSection({ context, ...otherProps }: BreadcrumbSectionProps) {
  const title = isCollection(context) ? context?.seo?.title : 'All Products'
  const fallback = [{ item: '/', name: title, position: 1 }]
  const breadcrumbList = isProduct(context)
    ? context?.breadcrumbList?.itemListElement
    : isCollection(context)
    ? context?.breadcrumbList?.itemListElement
    : fallback

  return (
    <Section className={`${styles.section} section-breadcrumb`}>
      <Breadcrumb breadcrumbList={breadcrumbList} {...otherProps} />
    </Section>
  )
}

export default memo(BreadcrumbSection)
