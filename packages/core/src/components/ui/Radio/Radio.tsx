import { Radio as UIRadio, Label as UILabel } from '@faststore/ui'

import styles from './radio.module.scss'

export interface RadioProps {
  /**
   * ID to identify input and corresponding label.
   */
  id: string
  /**
   * The text displayed to identify the input.
   */
  label: string
  /**
   * The value to identify the input.
   */
  value?: string
  /**
   * Identify radio in the same group.
   */
  name?: string
}

function Radio({ id, label, value, name, ...otherProps }: RadioProps) {
  return (
    <div data-fs-radio className={styles.fsRadio}>
      <UIRadio id={id} value={value ?? label} name={name} {...otherProps} />
      <UILabel data-fs-label htmlFor={id}>
        {label}
      </UILabel>
    </div>
  )
}

export default Radio
