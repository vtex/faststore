/** @jsx jsx */
import { FC } from 'react'
import { jsx } from 'theme-ui'
import BitRichText from '@bit/vtex.poc.rich-text'

const Rich = BitRichText as any

interface Props {
  text: string
  variant?: string
}

const RichText: FC<Props> = ({ variant = 'default', text }) => (
  <div sx={{ variant: `rich-text.${variant}` }}>
    <Rich text={text} />
  </div>
)

export default RichText
