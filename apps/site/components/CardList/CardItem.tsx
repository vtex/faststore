import { CSSProperties, PropsWithChildren, ReactNode } from 'react'

export type CardItemProps = {
  title: string
  actionPath: string
  description: string | ReactNode
  zoomOut?: boolean
  containerStyle?: CSSProperties
}

const CardItem = ({
  title,
  description,
  children,
  zoomOut,
  actionPath,
  containerStyle,
  ...otherProps
}: PropsWithChildren<CardItemProps>) => {
  return (
    <li data-doc-card-item {...otherProps}>
      <a data-doc-card-item-link href={actionPath}>
        <div
          data-doc-card-item-component
          data-doc-card-item-component-zoom={zoomOut}
          style={containerStyle}
        >
          {children}
        </div>
        <article data-doc-card-item-content>
          <h3 data-doc-card-item-title>{title}</h3>
          <p>{description}</p>
        </article>
      </a>
    </li>
  )
}

export default CardItem
