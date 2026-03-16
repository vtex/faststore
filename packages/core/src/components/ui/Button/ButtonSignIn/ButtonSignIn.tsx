import { Icon } from '@faststore/ui'

import storeConfig from 'discovery.config'
import LinkButton from 'src/components/ui/LinkButton'
import { useSession } from 'src/sdk/session'
import { useLink } from 'src/sdk/ui/useLink'

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
  const { resolveLink } = useLink()

  const getAccountUrl = () => {
    if (!person?.id) return '/login'

    const enableFaststoreMyAccount =
      storeConfig.experimental?.enableFaststoreMyAccount
    if (enableFaststoreMyAccount) return '/pvt/account'
    return resolveLink(storeConfig.accountUrl) ?? storeConfig.accountUrl
  }

  return (
    <LinkButton
      data-fs-button-signin-link
      href={getAccountUrl()}
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
