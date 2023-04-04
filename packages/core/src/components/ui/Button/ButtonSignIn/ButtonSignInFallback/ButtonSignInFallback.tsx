import { Icon, LinkButton } from '@faststore/ui'

function ButtonSignInFallback() {
  return (
    <LinkButton
      data-fs-button-signin-link
      href="/login"
      className="text__title-mini"
      variant="tertiary"
      icon={<Icon name="User" width={18} height={18} weight="bold" />}
      iconPosition="left"
    >
      <span>{'Sign In'}</span>
    </LinkButton>
  )
}

export default ButtonSignInFallback
