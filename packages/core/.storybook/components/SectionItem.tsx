import React, { CSSProperties, PropsWithChildren, ReactNode } from 'react'

import { Icon, LinkButton } from '@faststore/ui'

type SectionItemProps = {
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
    <li className="sbdocs-li" {...otherProps}>
      <div className="sbdocs-div" style={containerStyle}>
        {children}
      </div>
      <article className="sbdocs-list-text">
        <h3 className="sbdocs sbdocs-h3">{title}</h3>
        <p className="sbdocs sbdocs-p">{description}</p>
        {actionPath && (
          <LinkButton
            size="small"
            variant="tertiary"
            href={actionPath}
            icon={
              <Icon name="ArrowRight" width="18" height="18" weight="bold" />
            }
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
