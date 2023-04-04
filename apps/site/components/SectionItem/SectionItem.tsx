import { CSSProperties, PropsWithChildren, ReactNode } from 'react'
import styles from './section-item.module.css'

import { Icon, LinkButton } from '@faststore/ui'

export type SectionItemProps = {
  title: string
  description: string | ReactNode
  actionPath?: string
  containerStyle?: CSSProperties
}

const SectionItem = ({
  title,
  description,
  children,
  actionPath,
  containerStyle,
  ...otherProps
}: PropsWithChildren<SectionItemProps>) => {
  return (
    <li className={styles.sectionItem} {...otherProps}>
      <div style={containerStyle}>{children}</div>
      <article>
        <h3 className="nx-font-semibold nx-tracking-tight nx-mt-8 nx-text-2xl">
          {title}
        </h3>
        <p>{description}</p>
        {actionPath && (
          <LinkButton
            size="small"
            variant="tertiary"
            href={actionPath}
            icon={<Icon name="ArrowRight" />}
            iconPosition="right"
          >
            See more
          </LinkButton>
        )}
      </article>
    </li>
  )
}

export default SectionItem
