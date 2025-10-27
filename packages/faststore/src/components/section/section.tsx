import type { ComponentProps } from 'react'
import { cx } from '../../utils'
import styles from './section.module.scss'

export function Section(props: SectionProps) {
  const { as: As = 'section', className = '', ref, ...otherProps } = props

  return (
    <As
      ref={ref}
      className={cx('section', styles.section, className)}
      {...otherProps}
    />
  )
}

interface SectionProps extends ComponentProps<'div'> {
  as?: 'section' | 'header' | 'footer' | 'aside'
  className?: string
  ref?: React.Ref<HTMLDivElement>
  children?: React.ReactNode
}
