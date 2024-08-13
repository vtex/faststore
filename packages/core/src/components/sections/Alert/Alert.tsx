import type { ReactNode } from 'react'

import { Icon } from '@faststore/ui'
import CommonAlert, {
  type AlertProps as CommonAlertProps,
} from '../../../components/common/Alert'

export interface AlertProps extends Omit<CommonAlertProps, 'link' | 'icon'> {
  icon: string
  link: {
    // It is only ReactNode when overridden as such
    text: ReactNode
    to: string
  }
}

// TODO: Change actionPath and actionLabel with Link
function Alert({ icon, content, link: { text, to }, dismissible }: AlertProps) {
  return (
    <CommonAlert
      icon={<Icon name={icon} />}
      link={{
        children: text,
        href: to,
        target: '_self',
      }}
      dismissible={dismissible}
    >
      {content}
    </CommonAlert>
  )
}

export default Alert
