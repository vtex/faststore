import React, { FC, CSSProperties } from 'react'

interface Props {
  text: string
  variant?: string
}

const RichText: FC<Props> = ({ variant = 'default', text }) => {
  let style: CSSProperties = {}

  switch (variant) {
    case 'question':
      style = {
        color: 'textBold',
        fontSize: 32,
        fontWeight: 'bold',
        textAlign: 'center',
      }
      break

    case 'link':
      style = {
        color: 'textBold',
        fontSize: 24,
        textAlign: 'center',
        textTransform: 'uppercase',
        textDecoration: 'none',
      }
      break

    default:
      style = {
        color: 'textBold',
        fontSize: 16,
        fontWeight: 'bold',
        textAlign: 'center',
        textTransform: 'uppercase',
      }
  }

  return <div style={style}>{text}</div>
}

export default RichText
