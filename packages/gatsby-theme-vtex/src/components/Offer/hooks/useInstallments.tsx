import { useMemo } from 'react'

import { SyncProductCommertialOffer, Installment } from '../../../types/product'
import { useNumberFormat } from '../../../providers/NumberFormat'

export const useInstallments = (offer?: SyncProductCommertialOffer) => {
  const numberFormat = useNumberFormat()

  const highestInstallment = useMemo(
    () =>
      offer?.Installments?.reduce(
        (previous: Installment, current: Installment) =>
          previous.NumberOfInstallments > current.NumberOfInstallments
            ? previous
            : current,
        {} as Installment
      ),
    [offer]
  )

  return {
    highestInstallment,
    formatPrice: numberFormat.format,
  }
}
