import { HTMLAttributes } from 'react'

export type BoxProps = HTMLAttributes<{}> & {
  onClick?: () => void
  tag?: keyof JSX.IntrinsicElements
}

export function Box({
  children,
  onClick = () => {},
  tag: Tag = 'div',
  ...props
}: BoxProps) {
  return (
    <Tag {...props} onClick={() => onClick()}>
      {children}
    </Tag>
  )
}
