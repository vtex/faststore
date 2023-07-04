import { ReactNode } from 'react'

import CommonAlert from 'src/components/common/Alert'
import {
  Alert as AlertWrapper,
  Icon,
} from 'src/components/sections/Alert/Overrides'

export interface AlertProps {
  icon: string
  content: string
  link: {
    // It is only ReactNode when overridden as such
    text: string | ReactNode
    to: string
  }
  dismissible: boolean
}

// TODO: Change actionPath and actionLabel with Link
function Alert({
  icon = Icon.props.name,
  content,
  link: {
    text = AlertWrapper.props.link?.children,
    to = AlertWrapper.props.link?.href,
  },
  dismissible = AlertWrapper.props.dismissible,
}: AlertProps) {
  return (
    <CommonAlert
      icon={<Icon.Component {...Icon.props} name={icon} />}
      {...AlertWrapper.props}
      link={{
        ...(AlertWrapper.props.link ?? {}),
        children: text,
        href: to,
        target: AlertWrapper.props.link?.target ?? '_self',
      }}
      dismissible={dismissible}
    >
      {content}
    </CommonAlert>
  )
}

export default Alert
