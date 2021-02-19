/** @jsx jsx */
import { Box, Flex, jsx } from 'theme-ui'
import type { ComponentType, FC } from 'react'

interface Props {
  position: 'left' | 'right'
  onDragStart: (position: string) => void
  active?: boolean
  value?: number
  displayPopup?: boolean
  formatValue: (value: number) => number | string
  offset: number
  icon: ComponentType | null
}

const Selector: FC<Props> = ({
  active = false,
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
        position: 'absolute',
        cursor: 'pointer',
        willChange: 'transform',
        top: 6.5,
        left: position === 'left' ? 0 : 'initial',
        right: position === 'right' ? 0 : 'initial',
        zIndex: active ? 2 : 1,
        ':focus': {
          outline: 0,
        },
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
          <Flex
            sx={{
              alignItems: 'center',
              backgroundColor: '#134cd8',
              border: '1px solid #134cd8',
              borderRadius: '.25rem',
              color: '#FFF',
              padding: '.25rem .5rem',
              position: 'relative',
              justifyContent: 'center',
              left: '-50%',
              fontWeight: 'normal',
              fontSize: '.875rem',
              textTransform: 'initial',
              letterSpacing: 0,
            }}
          >
            {formatValue(value)}
          </Flex>
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
