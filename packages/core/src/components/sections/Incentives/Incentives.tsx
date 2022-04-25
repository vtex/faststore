import { Incentive as UIIncentive, List as UIList } from '@faststore/ui'

import Icon from 'src/components/ui/Icon'

interface Incentive {
  icon: string
  title?: string
  firstLineText: string
  secondLineText?: string
}

interface Props {
  incentives: Incentive[]
  classes?: string
}

function Incentives({ incentives, classes = '' }: Props) {
  return (
    <div className={`incentives ${classes} layout__content-full`}>
      <UIList variant="unordered" className="layout__content">
        {incentives.map((incentive, index) => (
          <li key={String(index)}>
            <UIIncentive>
              <Icon name={incentive.icon} width={32} height={32} />
              <div data-incentive-content>
                {incentive.title && <p>{incentive.title}</p>}
                <span>{incentive.firstLineText}</span>
                {incentive.secondLineText && (
                  <span>{incentive.secondLineText}</span>
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
