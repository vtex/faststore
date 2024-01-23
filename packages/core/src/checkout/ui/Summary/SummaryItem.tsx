import classNames from 'classnames'
import { Price } from '../Price'

type LooseAutocomplete<T extends string> = T | Omit<string, T>

type Label = LooseAutocomplete<'Items' | 'Shipping' | 'Taxes'>

export type SummaryItemProps = {
  label: Label
  name?: string
  value: number | null
  loading?: boolean
}

const translateLabel = (label: Label) => {
  switch (label) {
    case 'Items':
      return 'Itens do carrinho'

    case 'Shipping':
      return 'Entrega'

    case 'Taxes':
      return 'Taxas'

    case 'Discounts':
      return 'Descontos'

    default:
      return label
  }
}

export const SummaryItem = ({
  label,
  value,
  loading = false,
}: SummaryItemProps) => {
  return (
    <div
      className={classNames(`flex justify-between`, {
        'font-semibold': label === 'Total',
      })}
      data-testid={`SummaryItem-${label}`}
    >
      <span>{translateLabel(label)}</span>{' '}
      <span
        className={classNames('transition-opacity duration-200', {
          'opacity-100': !loading,
          'opacity-50': loading,
        })}
      >
        <Price value={value} />
      </span>
    </div>
  )
}
