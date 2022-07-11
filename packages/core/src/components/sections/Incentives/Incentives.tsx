import { Incentive as UIIncentive, List as UIList } from '@faststore/ui'

import Icon from 'src/components/ui/Icon'

import styles from './incentives.module.scss'

interface Incentive {
  icon: string
  title?: string
  firstLineText: string
  secondLineText?: string
}

export interface IncentivesProps {
  incentives: Incentive[]
  /**
   * Controls whether the component will be colored or not.
   */
  colored?: boolean
  /**
   * Controls the component's direction.
   */
  variant?: 'horizontal' | 'vertical'
}

function Incentives({
  incentives,
  variant = 'horizontal',
  colored = false,
}: IncentivesProps) {
  return (
    <div
      data-fs-incentives
      data-fs-incentives-colored={colored}
      data-fs-incentives-variant={variant}
      className={styles.fsIncentives}
    >
      <UIList variant="unordered" className="layout__content">
        {incentives.map((incentive, index) => (
          <li key={String(index)}>
            <UIIncentive>
              <Icon
                data-fs-incentive-icon
                name={incentive.icon}
                width={32}
                height={32}
              />
              <div data-fs-incentive-content>
                {incentive.title && (
                  <p data-fs-incentive-title>{incentive.title}</p>
                )}
                <span data-fs-incentive-description>
                  {incentive.firstLineText}
                </span>
                {incentive.secondLineText && (
                  <span data-fs-incentive-description>
                    {incentive.secondLineText}
                  </span>
                )}
              </div>
            </UIIncentive>
          </li>
        ))}
      </UIList>
    </div>
  )
}

export default Incentives
