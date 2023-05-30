import { Icon as UIIcon } from '@faststore/ui'
import UIAlert from 'src/components/common/Alert'
import { mark } from 'src/sdk/tests/mark'

export interface AlertProps {
  icon: string
  content: string
  link: {
    text: string
    to: string
  }
  dismissible: boolean
}

// TODO: Change actionPath and actionLabel with Link
function Alert({ icon, content, link, dismissible }: AlertProps) {
  return (
    <UIAlert
      icon={<UIIcon name={icon} />}
      link={{ children: link?.text, href: link?.to, target: '_self' }}
      dismissible={dismissible}
    >
      {content}
    </UIAlert>
  )
}

Alert.displayName = 'Alert'
export default mark(Alert)
