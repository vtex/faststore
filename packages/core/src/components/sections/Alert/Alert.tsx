import { Components, Props } from 'src/components/sections/Alert/Overrides'

const { Alert: AlertWrapper, Icon } = Components

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
function Alert({
  icon = Props['Icon'].name,
  content,
  link: {
    text = Props['Alert'].link?.text,
    to = Props['Alert'].link?.to,
  } = Props['Alert'].link,
  dismissible = Props['Alert'].dismissible,
}: AlertProps) {
  return (
    <AlertWrapper
      icon={<Icon {...Props['Icon']} name={icon} />}
      {...Props['Alert']}
      link={{
        children: text,
        href: to,
        target: Props['Alert'].link?.target ?? '_self',
      }}
      dismissible={dismissible}
    >
      {content}
    </AlertWrapper>
  )
}

export default Alert
