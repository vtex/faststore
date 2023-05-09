import { Icon, LinkButton } from '@faststore/ui'

import { useSession } from 'src/sdk/session'
import { useCart } from '../../../../sdk/cart/index'

const ButtonSignIn = () => {
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
      icon={<Icon name="User" width={18} height={18} weight="bold" />}
      iconPosition="left"
    >
      {person?.id ? 'My Account' : 'Sign In'}
    </LinkButton>
  )
}

export default ButtonSignIn
