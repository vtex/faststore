import { IconButton as UIIconButton } from '@faststore/ui'
import type { IconButtonProps as UIIconButtonProps } from '@faststore/ui'

import styles from './button.module.scss'

type Props = UIIconButtonProps

function ButtonIcon({ icon, ...otherProps }: Props) {
  return (
    <UIIconButton
      className={styles.fsButton}
      data-fs-button="true"
      data-fs-button-icon="true"
      data-fs-button-variant="primary"
      data-fs-button-inverse="true"
      icon={icon}
      {...otherProps}
    />
  )
}

export default ButtonIcon
