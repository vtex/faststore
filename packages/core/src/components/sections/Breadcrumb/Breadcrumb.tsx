import { memo } from 'react'

import type { BreadcrumbProps } from 'src/components/ui/Breadcrumb'
import UIBreadcrumb from 'src/components/ui/Breadcrumb'

import Section from '../Section'

import styles from './section.module.scss'

interface BreadcrumbWrapperProps
  extends Partial<Pick<BreadcrumbProps, 'breadcrumbList'>> {
  name: string
}

function Breadcrumb({ breadcrumbList, name }: BreadcrumbWrapperProps) {
  const fallback = [{ item: '/', name, position: 1 }]
  const list = breadcrumbList ?? fallback

  return (
    <Section className={`${styles.section} section-breadcrumb layout__content`}>
      <UIBreadcrumb breadcrumbList={list} />
    </Section>
  )
}

export default memo(Breadcrumb)
