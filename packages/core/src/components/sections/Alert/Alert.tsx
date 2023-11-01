import { ReactNode } from 'react'

import CommonAlert from 'src/components/common/Alert'
import { useOverrideComponents } from 'src/sdk/overrides/OverrideContext'

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
