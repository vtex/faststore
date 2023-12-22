import { ReactNode } from 'react'
import type { PropsWithChildren } from 'react'

import { useOverrideComponents } from 'src/sdk/overrides/OverrideContext'

import Section from '../Section'
import styles from './section.module.scss'

export interface EmptyStateProps {
  title: string
  titleIcon?: ReactNode
}

function EmptyState({
  title,
  titleIcon,
  children,
}: PropsWithChildren<EmptyStateProps>) {
  const { EmptyState: EmptyStateWrapper } =
    useOverrideComponents<'EmptyState'>()
  return (
    <Section className={`${styles.section} section-empty-state`}>
      <EmptyStateWrapper.Component
        bkgColor="light"
        {...EmptyStateWrapper.props}
        title={title ?? EmptyStateWrapper.props.title}
        titleIcon={titleIcon ?? EmptyStateWrapper.props.titleIcon}
      >
        {children}
      </EmptyStateWrapper.Component>
    </Section>
  )
}

export default EmptyState
