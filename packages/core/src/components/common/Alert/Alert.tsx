import type { PropsWithChildren, ReactNode } from 'react'
import { useCallback, useState } from 'react'

import { Alert as UIAlert, AlertProps as UIAlertProps } from '@faststore/ui'

import Section from 'src/components/sections/Section/Section'
import styles from './section.module.scss'

export interface AlertProps extends UIAlertProps {
  /**
   * For CMS integration purposes, should be used to pass content through it
   * instead pass through children
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
      <UIAlert onClose={onAlertClose} {...otherProps}>
        {content ?? children}
      </UIAlert>
    </Section>
  )
}

export default Alert
