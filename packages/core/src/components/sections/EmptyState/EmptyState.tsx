import { ReactNode } from 'react'
import type { PropsWithChildren } from 'react'

import Section from '../Section'
import styles from './section.module.scss'

import { EmptyState as EmptyStateWrapper } from 'src/components/sections/EmptyState/Overrides'

export interface EmptyStateProps {
  title: string
  titleIcon?: ReactNode
}

function EmptyState({
  title = EmptyStateWrapper.props.title,
  titleIcon = EmptyStateWrapper.props.titleIcon,
  children,
}: PropsWithChildren<EmptyStateProps>) {
  return (
    <Section className={`${styles.section} section-empty-state`}>
      <EmptyStateWrapper.Component
        bkgColor="light"
        {...EmptyStateWrapper.props}
        title={title}
        titleIcon={titleIcon}
      >
        {children}
      </EmptyStateWrapper.Component>
    </Section>
  )
}

export default EmptyState
