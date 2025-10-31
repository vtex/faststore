import { Icon as UIIcon, IconButton as UIIconButton } from '@faststore/ui'

import { useRTL } from 'src/hooks/useRTL'

import styles from './styles.module.scss'

function RTLToggle() {
  const { isRTL, toggleDirection } = useRTL()

  return (
    <UIIconButton
      data-fs-rtl-toggle
      className={styles.rtlToggle}
      aria-label={isRTL ? 'Switch to Left-to-Right' : 'Switch to Right-to-Left'}
      title={isRTL ? 'Switch to LTR' : 'Switch to RTL'}
      icon={
        <UIIcon
          name={isRTL ? 'ArrowLeft' : 'ArrowRight'}
          width={20}
          height={20}
          aria-hidden="true"
        />
      }
      onClick={toggleDirection}
    />
  )
}

export default RTLToggle
