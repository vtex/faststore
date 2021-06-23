import type { MouseEvent } from 'react'
import React from 'react'

import Button from '../Button'

export interface BulletsProps {
  totalQuantity: number
  activeBullet: number
  onClick: (e: MouseEvent, bulletIdx: number) => void
  testId?: string
  listItemTestId?: string
}

function Bullets({
  totalQuantity,
  activeBullet,
  onClick,
  testId = 'store-bullets',
  listItemTestId = 'bullet-item',
}: BulletsProps) {
  const bulletIndexes = [...new Array(totalQuantity).keys()]

  return (
    <ol data-store-bullets data-testid={testId}>
      {bulletIndexes.map((idx) => {
        const isActive = activeBullet === idx

        return (
          <li
            key={idx}
            data-testid={listItemTestId}
            data-bullet-item
            data-active={isActive || undefined}
          >
            <Button
              aria-label={isActive ? 'Current page' : `Go to page ${idx + 1}`}
              onClick={(e) => onClick(e, idx)}
            />
          </li>
        )
      })}
    </ol>
  )
}

export default Bullets
