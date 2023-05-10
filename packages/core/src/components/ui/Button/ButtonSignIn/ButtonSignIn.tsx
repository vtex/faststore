import { Icon, LinkButton } from '@faststore/ui'

import { useSession } from 'src/sdk/session'
import { useCart } from '../../../../sdk/cart/index'

const ButtonSignIn = ({ icon, label }: { icon: string; label: string }) => {
  const { id } = useCart()
  const { person } = useSession()

  return (
    <LinkButton
      data-fs-button-signin-link
      href={
        person?.id ? `/account?orderFormId=${id}` : `/login?orderFormId=${id}`
      }
      className="text__title-mini"
      variant="tertiary"
      icon={<Icon name={icon} width={18} height={18} weight="bold" />}
      iconPosition="left"
    >
      {person?.id ? 'My Account' : label}
    </LinkButton>
  )
}

export default ButtonSignIn
