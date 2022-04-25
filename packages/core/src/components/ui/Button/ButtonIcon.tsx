import { IconButton as UIIconButton } from '@faststore/ui'
import type { IconButtonProps as UIIconButtonProps } from '@faststore/ui'

type Props = UIIconButtonProps

function ButtonIcon({ icon, ...otherProps }: Props) {
  return (
    <UIIconButton
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
