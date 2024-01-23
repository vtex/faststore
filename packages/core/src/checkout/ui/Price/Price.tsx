import { useMemo } from 'react'

export type PriceProps = {
  value: number | null
}

const formatter = new Intl.NumberFormat('pt-BR', {
  style: 'currency',
  currency: 'BRL',
})

export const Price = ({ value }: PriceProps) => {
  const formattedPrice = useMemo(() => {
    if (value == null) {
      return 'A calcular'
    }

    if (value === 0) {
      return 'Grátis'
    }

    return `${formatter.format(Math.abs(value) / 100)}`
  }, [value])

  return (
    <span>
      {value != null && value < 0 ? '- ' : ''}
      {formattedPrice}
    </span>
  )
}
