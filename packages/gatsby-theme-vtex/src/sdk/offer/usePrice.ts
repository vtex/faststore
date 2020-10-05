import { useNumberFormat } from '../localization/useNumberFormat'

interface Props {
  price: number
}

export const usePrice = ({ price }: Props) => {
  const { format } = useNumberFormat()

  return format(price)
}
