import {
  Icon as UIIcon,
  List as UIList,
  Incentive as UIIncentive,
} from '@faststore/ui'

export type Incentive = {
  icon: string
  title: string
  firstLineText: string
  secondLineText?: string
  alt?: string
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
    >
      <UIList data-fs-content="incentives">
        {incentives.map((incentive, index) => (
          <li role="listitem" key={String(index)}>
            <UIIncentive tabIndex={0}>
              <UIIcon
                data-fs-incentive-icon
                aria-label={incentive.alt}
                name={incentive.icon}
                width={32}
                height={32}
              />
              <div data-fs-incentive-content>
                <p data-fs-incentive-title>{incentive.title}</p>
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
