import Incentives from 'src/components/ui/Incentives/Incentives'
import Section from '../Section'
import styles from './section.module.scss'

interface Incentive {
  icon: string
  title?: string
  firstLineText: string
  secondLineText?: string
}

interface Props {
  incentives: Incentive[]
}

function IncentivesHeader({ incentives }: Props) {
  return (
    <Section className={`${styles.section} section-incentives-header`}>
      <Incentives incentives={incentives} colored />
    </Section>
  )
}

export default IncentivesHeader
