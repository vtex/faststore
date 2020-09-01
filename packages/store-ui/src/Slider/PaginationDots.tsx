/** @jsx jsx */
import { FC, useMemo } from 'react'
import { jsx, Box } from 'theme-ui'

interface Props {
  totalItems: number
  selectedIndex: number
  onSelect: (index: number) => void
  variant?: string
}

export const PaginationDots: FC<Props> = ({
  variant,
  selectedIndex,
  totalItems,
  onSelect,
}) => {
  const indexes = useMemo(() => Array.from(Array(totalItems).keys()), [
    totalItems,
  ])

  return (
    <Box
      variant={`${variant}.paginationDots.container`}
      role="group"
      aria-label="Slider pagination dots"
    >
      {indexes.map((index) => {
        const isActive = index === selectedIndex

        return (
          <Box
            variant={`${variant}.paginationDots.${
              isActive ? 'activeDot' : 'dot'
            }`}
            key={index}
            tabIndex={index}
            onKeyDown={() => onSelect(index)}
            onClick={() => onSelect(index)}
            role="button"
            aria-label={`Dot ${index + 1} of ${totalItems}`}
            data-testid="paginationDot"
          />
        )
      })}
    </Box>
  )
}
