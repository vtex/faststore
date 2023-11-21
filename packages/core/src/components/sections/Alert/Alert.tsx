import type { ReactNode } from 'react'

import CommonAlert, {
  type AlertProps as CommonAlertProps,
} from 'src/components/common/Alert'
import { useOverrideComponents } from 'src/sdk/overrides/OverrideContext'

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
  const { Alert: AlertWrapper, Icon } = useOverrideComponents<'Alert'>()

  return (
    <CommonAlert
      icon={<Icon.Component {...Icon.props} name={icon ?? Icon.props.name} />}
      {...AlertWrapper.props}
      link={{
        ...(AlertWrapper.props.link ?? {}),
        children: text ?? AlertWrapper.props.link?.children,
        href: to ?? AlertWrapper.props.link?.href,
        target: AlertWrapper.props.link?.target ?? '_self',
      }}
      dismissible={dismissible ?? AlertWrapper.props.dismissible}
    >
      {content}
    </CommonAlert>
  )
}

export default Alert
