import { useNumberFormat } from '../localization/useNumberFormat'

interface Props {
  price: number
  listPrice: number
}

export const useListPrice = ({ listPrice, price }: Props) => {
  const { format } = useNumberFormat()

  if (price === listPrice) {
    return null
  }

  return format(listPrice)
}
