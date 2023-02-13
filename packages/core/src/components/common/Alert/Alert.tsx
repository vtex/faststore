import { useCallback, useState } from 'react'
import type { ReactNode, PropsWithChildren } from 'react'

import { Alert as UIAlert, AlertProps } from '@faststore/ui'
import { mark } from 'src/sdk/tests/mark'

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
    <UIAlert onClose={onAlertClose} {...otherProps}>
      {content ?? children}
    </UIAlert>
  )
}

Alert.displayName = 'Alert'

export default mark(Alert)
