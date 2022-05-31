import { Checkbox as UICheckbox } from '@faststore/ui'
import type { CheckboxProps as UICheckboxProps } from '@faststore/ui'

import styles from './checkbox.module.scss'

export type CheckboxProps = {
  partial?: boolean
} & UICheckboxProps

function Checkbox({ partial, ...otherProps }: CheckboxProps) {
  return (
    <UICheckbox
      className={styles.fsCheckbox}
      data-fs-checkbox-partial={partial}
      {...otherProps}
    />
  )
}

export default Checkbox
