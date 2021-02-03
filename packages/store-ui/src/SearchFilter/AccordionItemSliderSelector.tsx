/** @jsx jsx */
import { Box, Flex, jsx } from 'theme-ui'
import type { ComponentType, FC } from 'react'

interface Props {
  position: 'left' | 'right'
  onDragStart: (position: string) => void
  active?: boolean
  disabled?: boolean
  value?: number
  displayPopup?: boolean
  formatValue: (value: number) => number
  offset: number
  icon: ComponentType | null
}

const Selector: FC<Props> = ({
  active = false,
  // disabled = false,
  value = 0,
  displayPopup = false,
  icon = null,
  formatValue,
  offset,
  onDragStart,
  position,
}) => {
  const containerStyle =
    position === 'left'
      ? { transform: `translateX(${offset}px) translateX(-50%)` }
      : { transform: `translateX(-${offset}px) translateX(50%)` }

  return (
    <Box
      aria-valuenow={0}
      onMouseDown={() => onDragStart(position)}
      onTouchStart={() => onDragStart(position)}
      role="slider"
      tabIndex={0}
      sx={{
        ...containerStyle,
        cursor: 'pointer',
        left: position === 'left' ? 0 : 'initial',
        position: 'absolute',
        right: position === 'right' ? 0 : 'initial',
        willChange: 'transform',
        top: 6.5,
        zIndex: active ? 2 : 1,
      }}
    >
      {(active || displayPopup) && (
        <Box
          sx={{
            paddingBottom: '.75rem',
            position: 'absolute',
            left: '50%',
            bottom: '100%',
          }}
        >
          <Box style={{ left: '-50%' }}>{formatValue(value)}</Box>
        </Box>
      )}
      <Flex
        sx={{
          alignItems: 'center',
          backgroundColor: '#134cd8',
          borderRadius: '100%',
          boxShadow: '-1px 1px 3px rgba(0, 0, 0, 0.15)',
          height: '0.75rem',
          width: '0.75rem',
          justifyContent: 'center',
        }}
      >
        {icon}
      </Flex>
    </Box>
  )
}

export default Selector
