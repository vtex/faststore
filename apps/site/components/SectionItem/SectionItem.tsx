import { CSSProperties, PropsWithChildren, ReactNode } from 'react'
import styles from './section-item.module.css'

import { Icon, LinkButton } from '@faststore/ui'

export type SectionItemProps = {
  title: string
  description?: string | ReactNode
  actionPath?: string
  containerStyle?: CSSProperties
  zoomOut?: boolean
  fullWidth?: boolean
  smallHeight?: boolean
}

const SectionItem = ({
  title,
  description,
  children,
  actionPath,
  containerStyle,
  zoomOut,
  fullWidth,
  smallHeight,
  ...otherProps
}: PropsWithChildren<SectionItemProps>) => {
  return (
    <li
      className={styles.sectionItem}
      data-doc-section-item-zoom-out={zoomOut}
      data-doc-section-item-full-width={fullWidth}
      data-doc-section-item-small-height={smallHeight}
      {...otherProps}
    >
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
