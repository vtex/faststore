'use client'

import { memo } from 'react'

import Section from '../../../../app/components/sections/Section'

import { getOverridableSection } from '../../../../app/sdk/overrides/getOverriddenSection'
import { useOverrideComponents } from '../../../../app/sdk/overrides/OverrideContext'
import {
  PDPContext,
  PLPContext,
  isPDP,
  isPLP,
  usePage,
} from '../../../../app/sdk/overrides/PageProvider'
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

const OverridableBreadcrumbSection = getOverridableSection<
  typeof BreadcrumbSection
>('Breadcrumb', BreadcrumbSection, BreadcrumbDefaultComponents)

export default memo(OverridableBreadcrumbSection)
