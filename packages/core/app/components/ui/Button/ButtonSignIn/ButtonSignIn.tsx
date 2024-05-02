import { Icon, LinkButton } from '@faststore/ui'

import { useSession } from 'app/sdk/session'

const ButtonSignIn = ({
  label,
  myAccountLabel,
  icon: { alt, icon },
}: {
  label: string
  myAccountLabel: string
  icon: { alt: string; icon: string }
}) => {
  const { person } = useSession()

  return (
    <LinkButton
      data-fs-button-signin-link
      href={person?.id ? `/account` : `/login`}
      className="text__title-mini"
      aria-label={alt}
      variant="tertiary"
      icon={<Icon name={icon} width={18} height={18} weight="bold" />}
      iconPosition="left"
    >
      {person?.id ? myAccountLabel : label}
    </LinkButton>
  )
}

export default ButtonSignIn
