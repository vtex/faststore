import { memo } from 'react'

import Section from '../Section'

import { getOverridableSection } from '../../../sdk/overrides/getOverriddenSection'
import { useOverrideComponents } from '../../../sdk/overrides/OverrideContext'
import {
  PDPContext,
  PLPContext,
  isPDP,
  isPLP,
  usePage,
} from '../../../sdk/overrides/PageProvider'
import { BreadcrumbDefaultComponents } from './DefaultComponents'

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
    <Section className={`section-breadcrumb`}>
      <Breadcrumb.Component breadcrumbList={breadcrumbList} {...otherProps} />
    </Section>
  )
}

const OverridableBreadcrumbSection = getOverridableSection<
  typeof BreadcrumbSection
>('Breadcrumb', BreadcrumbSection, BreadcrumbDefaultComponents)

export default memo(OverridableBreadcrumbSection)
