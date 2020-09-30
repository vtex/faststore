import { useNumberFormat } from '../localization/useNumberFormat'

interface Props {
  price: number
  listPrice: number
}

export const useListPrice = ({ listPrice, price }: Props) => {
  const { format } = useNumberFormat()

  if (price === listPrice) {
    return 0
  }

  return format(listPrice)
}
