/** @jsx jsx */
import { FC, useMemo } from 'react'
import { jsx, Box } from 'theme-ui'

interface Props {
  totalPages: number
  selectedPage: number
  onSelect: (index: number) => void
  variant?: string
}

const SliderPaginationDots: FC<Props> = ({
  variant,
  onSelect,
  totalPages,
  selectedPage,
}) => {
  const indexes = useMemo(() => Array.from(Array(totalPages).keys()), [
    totalPages,
  ])

  return (
    <Box
      variant={`${variant}.paginationDots.container`}
      role="group"
      aria-label="Slider pagination dots"
    >
      {indexes.map((index) => {
        const isActive = index === selectedPage

        return (
          <Box
            variant={`${variant}.paginationDots.${
              isActive ? 'activeDot' : 'dot'
            }`}
            key={index}
            tabIndex={0}
            onKeyDown={() => onSelect(index)}
            onClick={() => onSelect(index)}
            role="button"
            aria-label={`Dot ${index + 1} of ${totalPages}`}
            data-testid="paginationDot"
          />
        )
      })}
    </Box>
  )
}

export default SliderPaginationDots
