import { memo } from 'react'

import Section from '../Section'

import { getOverridableSection } from '../../../sdk/overrides/getOverriddenSection'
import { useOverrideComponents } from '../../../sdk/overrides/OverrideContext'
import {
  type PDPContext,
  type PLPContext,
  isPDP,
  isPLP,
  usePage,
} from '../../../sdk/overrides/PageProvider'
import { BreadcrumbDefaultComponents } from './DefaultComponents'
import styles from './section.module.scss'

interface BreadcrumbSectionProps {
  icon: string
  alt: string
}

function BreadcrumbSection({ ...otherProps }: BreadcrumbSectionProps) {
  const { Breadcrumb } = useOverrideComponents<'Breadcrumb'>()

  const context = usePage<PDPContext | PLPContext>()
  const title = isPLP(context)
    ? context?.data?.collection?.seo?.title
    : 'All Products'
  const fallback = [{ item: '/', name: title, position: 1 }]

  const breadcrumbList = isPDP(context)
    ? context?.data?.product?.breadcrumbList?.itemListElement
    : isPLP(context)
      ? context?.data?.collection?.breadcrumbList?.itemListElement
      : fallback

  return (
    <Section className={`${styles.section} section-breadcrumb`}>
      <Breadcrumb.Component breadcrumbList={breadcrumbList} {...otherProps} />
    </Section>
  )
}

BreadcrumbSection.$componentKey = 'Breadcrumb'

const OverridableBreadcrumbSection = getOverridableSection<
  typeof BreadcrumbSection
>('Breadcrumb', BreadcrumbSection, BreadcrumbDefaultComponents)

export default memo(OverridableBreadcrumbSection)
