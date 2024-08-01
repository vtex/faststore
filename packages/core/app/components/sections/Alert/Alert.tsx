'use client'

import { AlertProps as UIAlertProps } from '@faststore/ui'
import type { ReactNode } from 'react'

import { useCallback, useState } from 'react'
import { useOverrideComponents } from '../../../sdk/overrides/OverrideContext'
import { getOverridableSection } from '../../../sdk/overrides/getOverriddenSection'
import { AlertDefaultComponents } from './DefaultComponents'

import Section from 'app/components/sections/Section/Section'
import styles from './section.module.scss'

export interface AlertProps extends Omit<UIAlertProps, 'link' | 'icon'> {
  icon: string
  link: {
    // It is only ReactNode when overridden as such
    text: ReactNode
    to: string
  }
}

// TODO: Change actionPath and actionLabel with Link
function Alert({ icon, content, link: { text, to }, dismissible }: AlertProps) {
  console.log('🚀 ~ Alert section:')
  const { Alert: AlertWrapper, Icon } = useOverrideComponents<'Alert'>()

  const [displayAlert, setDisplayAlert] = useState(true)

  const onAlertClose = useCallback(
    () => setDisplayAlert(false),
    [setDisplayAlert]
  )

  if (displayAlert === false) {
    return null
  }

  return (
    <Section className={`${styles.section} section-alert`}>
      <AlertWrapper.Component
        icon={<Icon.Component {...Icon.props} name={icon ?? Icon.props.name} />}
        {...AlertWrapper.props}
        link={{
          ...(AlertWrapper.props.link ?? {}),
          children: text ?? AlertWrapper.props.link?.children,
          href: to ?? AlertWrapper.props.link?.href,
          target: AlertWrapper.props.link?.target ?? '_self',
        }}
        dismissible={dismissible ?? AlertWrapper.props.dismissible}
        // Dynamic props, shouldn't be overridable
        // This decision can be reviewed later if needed
        onClose={onAlertClose}
      >
        {content}
      </AlertWrapper.Component>
    </Section>
  )
}

const OverridableAlert = getOverridableSection<typeof Alert>(
  'Alert',
  Alert,
  AlertDefaultComponents
)

export default OverridableAlert
