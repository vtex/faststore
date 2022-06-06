import { useSession } from '@faststore/sdk'

import Icon from 'src/components/ui/Icon'
import { ButtonLink } from 'src/components/ui/Button'
import styles from 'src/components/ui/Button/button.module.scss'

const ButtonSignIn = () => {
  const { person } = useSession()

  return (
    <ButtonLink
      data-fs-button-signin-link
      href={person?.id ? '/account' : '/login'}
      className={`${styles.fsButton} text__title-mini signin-link`}
      variant="tertiary"
    >
      <Icon name="User" width={18} height={18} weight="bold" />
      <span>{person?.id ? 'My Account' : 'Sign In'}</span>
    </ButtonLink>
  )
}

export default ButtonSignIn
