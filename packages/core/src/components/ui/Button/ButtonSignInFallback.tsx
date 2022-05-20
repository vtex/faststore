import Icon from '../Icon'
import ButtonLink from './ButtonLink'

function ButtonSignInFallback() {
  return (
    <ButtonLink
      data-fs-button-signin-link
      href="/login"
      className="text__title-mini signin-link"
      variant="tertiary"
    >
      <Icon name="User" width={18} height={18} weight="bold" />
      <span>{'Sign In'}</span>
    </ButtonLink>
  )
}

export default ButtonSignInFallback
