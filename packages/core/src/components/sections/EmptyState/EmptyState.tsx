import { ReactNode } from 'react'
import type { PropsWithChildren } from 'react'

import Section from '../Section'
import styles from './section.module.scss'

import { Components, Props } from 'src/components/sections/EmptyState/Overrides'

const { EmptyState: EmptyStateWrapper } = Components

export interface EmptyStateProps {
  title: string
  titleIcon?: ReactNode
}

function EmptyState({
  title = Props['EmptyState'].title,
  titleIcon = Props['EmptyState'].titleIcon,
  children,
}: PropsWithChildren<EmptyStateProps>) {
  return (
    <Section className={`${styles.section} section-empty-state`}>
      <EmptyStateWrapper
        bkgColor="light"
        {...Props['EmptyState']}
        title={title}
        titleIcon={titleIcon}
      >
        {children}
      </EmptyStateWrapper>
    </Section>
  )
}

export default EmptyState
