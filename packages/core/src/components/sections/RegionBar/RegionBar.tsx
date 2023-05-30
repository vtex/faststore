import RegionBar, {
  RegionBarProps,
} from 'src/components/region/RegionBar/RegionBar'
import Section from 'src/components/sections/Section/Section'
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

function RegionBarSection({
  className = 'display-mobile',
  ...otherProps
}: RegionBarSectionProps) {
  return (
    <Section className={`${styles.section} section-region-bar ${className}`}>
      <RegionBar {...otherProps} />
    </Section>
  )
}

export default RegionBarSection
