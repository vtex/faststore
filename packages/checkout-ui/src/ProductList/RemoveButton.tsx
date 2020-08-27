import React, { FC } from 'react'
import { Button, Box } from '@vtex/store-ui'

import { useItemContext } from './ItemContext'
import { opaque } from './utils/opaque'

type DisplayMode = 'icon-button' | 'text-button'
type Variation =
  | 'primary'
  | 'secondary'
  | 'tertiary'
  | 'inverted-tertiary'
  | 'danger'
  | 'danger-tertiary'

const IconDelete: FC<{ color?: string }> = ({ color = 'black' }) => {
  return (
    <svg viewBox="0 0 16 16" width={16} height={16}>
      <path d="M2 0H0V6H2V0Z" transform="translate(5 7)" fill={color} />
      <path d="M2 0H0V6H2V0Z" transform="translate(9 7)" fill={color} />
      <path
        d="M12 1C12 0.4 11.6 0 11 0H5C4.4 0 4 0.4 4 1V3H0V5H1V15C1 15.6 1.4 16 2 16H14C14.6 16 15 15.6 15 15V5H16V3H12V1ZM6 2H10V3H6V2ZM13 5V14H3V5H13Z"
        fill={color}
      />
    </svg>
  )
}

interface Props {
  displayMode?: DisplayMode
  variant?: Variation
}

export const RemoveButton: FC<Props> = (props) => {
  const { displayMode = 'icon-button', variant = 'danger' } = props
  const { item, loading, onRemove } = useItemContext()

  if (loading) {
    return <>loading...</>
  }

  if (displayMode === 'text-button') {
    return (
      <Button variant={variant} onClick={onRemove}>
        Remove Product
      </Button>
    )
  }

  return (
    <Box sx={opaque(item.availability)}>
      <Button
        id={`remove-button-${item.id}`}
        backgroundColor="transparent"
        sx={{ border: 'none', cursor: 'pointer', lineHeight: 1.15 }}
        padding={1}
        title="remove"
        onClick={onRemove}
      >
        <IconDelete color="#727273" />
      </Button>
    </Box>
  )
}
