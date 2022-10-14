import Icon from 'src/components/ui/Icon'

import Button from '../../ui/Button'
import Section from '../Section'
import type { ButtonProps } from '../../ui/Button'
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
      <Button
        variant="secondary"
        icon={icon}
        iconPosition={iconPosition}
        onClick={() => window.scrollTo(0, 0)}
      >
        {text}
      </Button>
    </Section>
  )
}

export default ScrollToTopButton
