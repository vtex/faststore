import type { PropsWithChildren, ReactNode } from 'react'
import { useCallback, useState } from 'react'

import { AlertProps as UIAlertProps } from '@faststore/ui'
import Section from 'src/components/sections/Section/Section'
import styles from './section.module.scss'

import { useOverrideComponents } from 'src/sdk/overrides/OverrideContext'

export interface AlertProps extends Omit<UIAlertProps, 'content'> {
  /**
   * For CMS integration purposes, should be used to pass content through it
   * instead pass through children
   *
   * TODO: Remove it? It's not being used
   */
  content?: ReactNode
}

function Alert({
  content,
  children,
  ...otherProps
}: PropsWithChildren<AlertProps>) {
  const { Alert: AlertWrapper } = useOverrideComponents<'Alert'>()
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
        {...otherProps}
        // Dynamic props, shouldn't be overridable
        // This decision can be reviewed later if needed
        onClose={onAlertClose}
      >
        {content ?? children}
      </AlertWrapper.Component>
    </Section>
  )
}

export default Alert
