import React from 'react'
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
  icon: ComponentType
}

const Selector: FC<Props> = ({
  active = false,
  disabled = false,
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
    <div
      aria-valuenow={0}
      onMouseDown={() => onDragStart(position)}
      onTouchStart={() => onDragStart(position)}
      role="slider"
      tabIndex={0}
      style={{
        ...containerStyle,
        willChange: 'transform',
        top: 6.5,
      }}
    >
      {(active || displayPopup) && (
        <div style={{ left: '50%', bottom: '100%' }}>
          <div style={{ left: '-50%' }}>{formatValue(value)}</div>
        </div>
      )}
      <div
        style={{
          height: '0.75rem',
          width: '0.75rem',
          boxShadow: '-1px 1px 3px rgba(0, 0, 0, 0.15)',
        }}
      >
        {icon}
      </div>
    </div>
  )
}

export default Selector
