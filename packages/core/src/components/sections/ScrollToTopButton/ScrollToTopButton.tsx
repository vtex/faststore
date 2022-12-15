import { Button as UIButton } from '@faststore/ui'
import type { ButtonProps } from '@faststore/ui'

import Icon from 'src/components/ui/Icon'

import Section from '../Section'
import styles from './scroll-to-top-button.module.scss'

interface ScrollToTopButtonProps {
  /**
   * Button copy.
   * @default 'Scroll to top'
   */
  text?: string
  /**
   * Button's icon.
   * @default <Icon name="CaretUp" width={16} height={16} weight="bold" />
   */
  icon?: ButtonProps['icon']
  /**
   * Button icon's position.
   * @default 'left'
   */
  iconPosition?: ButtonProps['iconPosition']
}

function ScrollToTopButton({
  text = 'Scroll to top',
  icon = <Icon name="CaretUp" width={16} height={16} weight="bold" />,
  iconPosition = 'left',
}: ScrollToTopButtonProps) {
  return (
    <Section className={styles.fsScrollToTopButton}>
      <UIButton
        variant="secondary"
        icon={icon}
        iconPosition={iconPosition}
        onClick={() => window.scrollTo(0, 0)}
      >
        {text}
      </UIButton>
    </Section>
  )
}

export default ScrollToTopButton
