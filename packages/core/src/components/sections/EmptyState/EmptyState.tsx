import type { PropsWithChildren } from 'react'

import { Icon as UIIcon, Loader as UILoader } from '@faststore/ui'

import { useOverrideComponents } from '../../../sdk/overrides/OverrideContext'

import Section from '../Section'

import styles from './section.module.scss'

import { EmptyStateDefaultComponents } from './DefaultComponents'
import { getOverridableSection } from '../../../sdk/overrides/getOverriddenSection'
import { usePathname, useSearchParams } from 'next/navigation'

export interface EmptyStateProps {
  /**
   * Title for the `EmptyState` component.
   */
  title: string
  /**
   * A React component that will be rendered as an icon.
   */
  titleIcon?: {
    icon: string
    alt: string
  }
  /**
   * Subtitle for the `EmptyState` component.
   */
  subtitle?: string
  /**
   * Boolean that makes the loader be shown.
   */
  showLoader?: boolean
  /**
   * Object that manages the error state descriptions.
   */
  errorState?: {
    errorId?: {
      show?: boolean
      description?: string
    }
    fromUrl?: {
      show?: boolean
      description?: string
    }
  }
}

const useErrorState = () => {
  const searchParams = useSearchParams()
  const pathname = usePathname()

  const errorId = searchParams?.get('errorId') ?? ''
  const fromUrl = searchParams?.get('fromUrl') ?? ''
  const asPath = `${pathname}${searchParams ? `?${searchParams.toString()}` : ''}`

  return {
    errorId,
    fromUrl: fromUrl ?? asPath ?? pathname,
  }
}

function EmptyState({
  title,
  titleIcon,
  children,
  subtitle,
  errorState,
  showLoader = false,
}: PropsWithChildren<EmptyStateProps>) {
  const { EmptyState: EmptyStateWrapper } =
    useOverrideComponents<'EmptyState'>()
  const { errorId, fromUrl } = useErrorState()

  const icon = !!titleIcon?.icon ? (
    <UIIcon
      name={titleIcon?.icon}
      aria-label={titleIcon?.alt}
      width={56}
      height={56}
      weight="thin"
    />
  ) : (
    EmptyStateWrapper.props.titleIcon
  )

  return (
    <Section className={`${styles.section} section-empty-state`}>
      <EmptyStateWrapper.Component
        bkgColor="light"
        {...EmptyStateWrapper.props}
        title={title ?? EmptyStateWrapper.props.title}
        titleIcon={icon}
      >
        {!!subtitle && <h2>{subtitle}</h2>}
        {!!errorState?.errorId?.show && (
          <p>{`${errorState?.errorId?.description} ${errorId}`}</p>
        )}
        {!!errorState?.fromUrl?.show && (
          <p>{`${errorState?.fromUrl?.description} ${fromUrl}`}</p>
        )}
        {showLoader && <UILoader />}
        {children}
      </EmptyStateWrapper.Component>
    </Section>
  )
}

const OverridableEmptyState = getOverridableSection<typeof EmptyState>(
  'EmptyState',
  EmptyState,
  EmptyStateDefaultComponents
)

export default OverridableEmptyState
