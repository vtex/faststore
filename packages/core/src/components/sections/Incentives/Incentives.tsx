import type { Incentive } from 'src/components/ui/Incentives'
import UIIncentives from 'src/components/ui/Incentives/Incentives'

import Section from '../Section'

interface Props {
  incentives: Incentive[]
}

function Incentives({ incentives }: Props) {
  return (
    <Section className={`section-incentives layout__section`}>
      <UIIncentives incentives={incentives} colored />
    </Section>
  )
}

export default Incentives
