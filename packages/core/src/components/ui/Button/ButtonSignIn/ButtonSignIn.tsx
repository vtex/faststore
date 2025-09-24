import { Icon, LinkButton } from '@vtex/faststore-ui'

import storeConfig from '../../../../../discovery.config'
import { useSession } from '../../../../sdk/session'

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

  const getAccountUrl = () => {
    if (!person?.id) return '/login'

    const enableFaststoreMyAccount =
      storeConfig.experimental?.enableFaststoreMyAccount
    return enableFaststoreMyAccount ? '/pvt/account' : storeConfig.accountUrl
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
