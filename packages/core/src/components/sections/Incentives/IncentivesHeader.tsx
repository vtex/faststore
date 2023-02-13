import Incentives from './Incentives'
import Section from '../Section'

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
    <Section>
      <Incentives incentives={incentives} colored />
    </Section>
  )
}

export default IncentivesHeader
