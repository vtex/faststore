import { memo } from 'react'

import type { BreadcrumbProps } from 'src/components/ui/Breadcrumb'
import Breadcrumb from 'src/components/ui/Breadcrumb'

import Section from '../Section'

import styles from './section.module.scss'

interface BreadcrumbSectionProps
  extends Partial<Pick<BreadcrumbProps, 'breadcrumbList'>> {
  name: string
  icon: string
  alt: string
}

function BreadcrumbSection({
  breadcrumbList,
  name,
  ...otherProps
}: BreadcrumbSectionProps) {
  const fallback = [{ item: '/', name, position: 1 }]
  const list = breadcrumbList ?? fallback

  return (
    <Section className={`${styles.section} section-breadcrumb layout__content`}>
      <Breadcrumb breadcrumbList={list} {...otherProps} />
    </Section>
  )
}

export default memo(BreadcrumbSection)
