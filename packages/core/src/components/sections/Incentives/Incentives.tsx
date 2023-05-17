import UIIncentives from 'src/components/ui/Incentives/Incentives'
import type { Incentive } from 'src/components/ui/Incentives'

import Section from '../Section'
import styles from './section.module.scss'

interface Props {
  incentives: Incentive[]
}

function Incentives({ incentives }: Props) {
  return (
    <Section className={`${styles.section} section-incentives layout__section`}>
      <UIIncentives incentives={incentives} colored />
    </Section>
  )
}

export default Incentives
