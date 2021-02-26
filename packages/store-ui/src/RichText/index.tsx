/** @jsx jsx */
import type { FC } from 'react'
import { jsx } from 'theme-ui'

interface Props {
  text: string
  variant?: string
}

const RichText: FC<Props> = ({ variant = 'default', text }) => (
  <div sx={{ variant: `rich-text.${variant}` }}>{text}</div>
)

export default RichText
