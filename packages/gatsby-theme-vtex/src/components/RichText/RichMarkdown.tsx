import React from 'react'
import { Box } from 'theme-ui'

interface Props {
  text: string
  variant?: string
}

const RichMarkdown: React.FC<Props> = ({ text, variant = 'default' }) => {
  return (
    <Box variant={`rich-text.${variant}`} dangerouslySetInnerHTML={{ __html: text }} />
  )
}

export default RichMarkdown
