import { useCallback, useState } from 'react'
import type { PropsWithChildren } from 'react'

import UIAlert from 'src/components/ui/Alert'
import { mark } from 'src/sdk/tests/mark'
import Icon from 'src/components/ui/Icon'

function Alert({ children }: PropsWithChildren<unknown>) {
  const [displayAlert, setDisplayAlert] = useState(true)

  const onAlertClose = useCallback(
    () => setDisplayAlert(false),
    [setDisplayAlert]
  )

  if (displayAlert === false) {
    return null
  }

  return (
    <UIAlert
      icon={<Icon name="BellRinging" width={24} height={24} />}
      dismissible
      onClose={onAlertClose}
    >
      {children}
    </UIAlert>
  )
}

Alert.displayName = 'Alert'

export default mark(Alert)
