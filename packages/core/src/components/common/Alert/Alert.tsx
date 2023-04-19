import type { PropsWithChildren, ReactNode } from 'react'
import { useCallback, useState } from 'react'

import { AlertProps, Alert as UIAlert } from '@faststore/ui'
import { mark } from 'src/sdk/tests/mark'

import Section from 'src/components/sections/Section/Section'
import styles from './section.module.scss'

interface Props extends AlertProps {
  /**
   * For CMS integration purposes, should be used to pass content through it
   * instead pass through children
   */
  content?: ReactNode
}
function Alert(args: PropsWithChildren<Props>) {
  const [displayAlert, setDisplayAlert] = useState(true)

  const onAlertClose = useCallback(
    () => setDisplayAlert(false),
    [setDisplayAlert]
  )

  if (displayAlert === false) {
    return null
  }

  const { content, children, ...otherProps } = args

  return (
    <Section className={`${styles.section} section-alert`}>
      <UIAlert onClose={onAlertClose} {...otherProps}>
        {content ?? children}
      </UIAlert>
    </Section>
  )
}

Alert.displayName = 'Alert'
export default mark(Alert)
