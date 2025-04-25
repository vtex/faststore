import useScreenResize from 'src/sdk/ui/useScreenResize'
import { getOverridableSection } from '../../..//sdk/overrides/getOverriddenSection'
import RegionBar, {
  type RegionBarProps,
} from '../../region/RegionBar/RegionBar'
import Section from '../Section/Section'
import { RegionBarDefaultComponents } from './DefaultComponents'
import styles from './section.module.scss'

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

function RegionBarSection({ ...otherProps }: RegionBarSectionProps) {
  const { isDesktop } = useScreenResize()

  return (
    !isDesktop && (
      <Section className={`${styles.section} section-region-bar`}>
        <RegionBar {...otherProps} />
      </Section>
    )
  )
}

const OverridableRegionBar = getOverridableSection<typeof RegionBarSection>(
  'RegionBar',
  RegionBarSection,
  RegionBarDefaultComponents
)

export default OverridableRegionBar
