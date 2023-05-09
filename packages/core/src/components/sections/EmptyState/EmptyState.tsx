import { ReactNode } from 'react'
import type { PropsWithChildren } from 'react'

import Section from '../Section'
import styles from './section.module.scss'

import { EmptyState as UIEmptyState } from '@faststore/ui'

export interface EmptyStateProps {
  title: string
  titleIcon?: ReactNode
}

function EmptyState({
  title,
  titleIcon,
  children,
}: PropsWithChildren<EmptyStateProps>) {
  return (
    <Section className={`${styles.section} section-empty-state`}>
      <UIEmptyState title={title} titleIcon={titleIcon} bkgColor="light">
        {children}
      </UIEmptyState>
    </Section>
  )
}

export default EmptyState
