/** @jsx jsx */
import { FC, useMemo } from 'react'
import { jsx, Box } from 'theme-ui'

const DOTS_DEFAULT_SIZE = 0.625

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
      sx={{
        position: 'absolute',
        justifyContent: 'center',
        display: 'flex',
        margin: 0,
        padding: 0,
      }}
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
            sx={{
              cursor: 'pointer',
              display: 'inline-block',
              borderRadius: '100%',
              margin: '0 0.25rem',
              padding: '0.25rem',
              borderWidth: 0,
              outline: '0',
              height: `${DOTS_DEFAULT_SIZE}rem`,
              width: `${DOTS_DEFAULT_SIZE}rem`,
            }}
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
