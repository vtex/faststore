import type { Incentive } from 'src/components/ui/Incentives'
import UIIncentives from 'src/components/ui/Incentives/Incentives'

import Section from '../Section'
import styles from './section.module.scss'

interface Props {
  incentives: Incentive[]
  label?: string
}

function Incentives({ incentives, label }: Props) {
  return (
    <Section className={`${styles.section} section-incentives layout__section`}>
      <UIIncentives incentives={incentives} colored label={label ?? ''} />
    </Section>
  )
}

export default Incentives
