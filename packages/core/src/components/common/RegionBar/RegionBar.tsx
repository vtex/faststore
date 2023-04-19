import RegionBarComponent from 'src/components/region/RegionBar/RegionBar'
import Section from 'src/components/sections/Section/Section'
import styles from './section.module.scss'

type RegionBarProps = {
  className?: string
}

function RegionBar({ className = '' }: RegionBarProps) {
  return (
    <Section className={`${styles.section} section-region-bar`}>
      <RegionBarComponent className={className} />
    </Section>
  )
}

export default RegionBar
