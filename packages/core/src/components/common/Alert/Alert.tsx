import type { PropsWithChildren, ReactNode } from 'react'
import { useCallback, useState } from 'react'

import { AlertProps as UIAlertProps } from '@faststore/ui'

import Section from 'src/components/sections/Section/Section'
import styles from './section.module.scss'

import { Alert as AlertWrapper } from '@faststore/ui'

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
      <AlertWrapper
        {...otherProps}
        // Dynamic props, shouldn't be overridable
        // This decision can be reviewed later if needed
        onClose={onAlertClose}
      >
        {content ?? children}
      </AlertWrapper>
    </Section>
  )
}

export default Alert
