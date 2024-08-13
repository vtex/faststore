import { getOverridableSection } from '../../..//sdk/overrides/getOverriddenSection'
import RegionBar, { RegionBarProps } from '../../region/RegionBar/RegionBar'
import Section from '../Section/Section'
import { RegionBarDefaultComponents } from './DefaultComponents'

type RegionBarSectionProps = {
  /**
   * className forwarded to the section.
   */
  className?: string
  /**
   * A React component that will be rendered as an icon.
   */
  icon: RegionBarProps['icon']
  /**
   * Specifies a label for the location text.
   */
  label: RegionBarProps['label']
  /**
   * Specifies a label for the edit text.
   */
  editLabel?: RegionBarProps['editLabel']
  /**
   * A React component that will be rendered as an icon.
   */
  buttonIcon?: RegionBarProps['buttonIcon']
}

function RegionBarSection({
  className = 'display-mobile',
  ...otherProps
}: RegionBarSectionProps) {
  return (
    <Section className={`section-region-bar ${className}`}>
      <RegionBar {...otherProps} />
    </Section>
  )
}

const OverridableRegionBar = getOverridableSection<typeof RegionBarSection>(
  'RegionBar',
  RegionBarSection,
  RegionBarDefaultComponents
)

export default OverridableRegionBar
