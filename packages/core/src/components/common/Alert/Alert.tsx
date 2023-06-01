import type { PropsWithChildren, ReactNode } from 'react'
import { useCallback, useState } from 'react'

import { Alert as UIAlert, AlertProps as UIAlertProps } from '@faststore/ui'
import { mark } from 'src/sdk/tests/mark'

import Section from 'src/components/sections/Section/Section'
import styles from './section.module.scss'

import { Components, Props } from 'src/components/sections/Alert/Overrides'

const { Alert: AlertWrapper } = Components

export interface AlertProps extends UIAlertProps {
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
        {...Props['Alert']}
        // Dynamic props, shouldn't be overridable
        // This decision can be reviewed later if needed
        onClose={onAlertClose}
        {...otherProps}
      >
        {content ?? children}
      </AlertWrapper>
    </Section>
  )
}

Alert.displayName = 'Alert'
export default mark(Alert)
