import React, { Fragment, FC } from 'react'
import { useIntl, IntlShape } from '@vtex/gatsby-plugin-i18n'

interface DeliveryWindow {
  startDateUtc: string | null
  endDateUtc: string | null
}

interface Props {
  isPickup?: boolean
  lowerCase?: boolean
  shippingEstimate?: string
  scheduled?: DeliveryWindow
}

const getTranslateId = (shippingEstimate: string, isPickup?: boolean) => {
  const shippingEstimateString = shippingEstimate?.split(/[0-9]+/)[1]

  return (
    shippingEstimate &&
    shippingEstimateString &&
    `shippingEstimate${isPickup ? 'Pickup' : ''}-${
      shippingEstimate.split(/[0-9]+/)[1]
    }`
  )
}

const getTimeAmount = (shippingEstimate: string) => {
  return shippingEstimate?.split(/\D+/)[0]
}

const getScheduledWindow = (scheduled: DeliveryWindow, intl: IntlShape) => {
  return scheduled.startDateUtc && scheduled.endDateUtc
    ? {
        date: intl.formatDate(scheduled.startDateUtc, {
          year: 'numeric',
          month: 'numeric',
          day: 'numeric',
        }),
        startDate: intl.formatTime(scheduled.startDateUtc, { timeZone: 'UTC' }),
        endDate: intl.formatTime(scheduled.endDateUtc, { timeZone: 'UTC' }),
      }
    : {
        date: null,
        startDate: null,
        endDate: null,
      }
}

export const TranslateEstimate: FC<Props> = ({
  isPickup,
  lowerCase = false,
  shippingEstimate = '',
  scheduled,
}) => {
  const intl = useIntl()

  if (scheduled) {
    const { date, startDate, endDate } = getScheduledWindow(scheduled, intl)
    const hasDeliveryWindow = !!(startDate && endDate)
    const translatedEstimateDeliveryWindow = hasDeliveryWindow
      ? intl.formatMessage(
          {
            id: 'shippingEstimate-scheduled',
          },
          { date, startDate, endDate }
        )
      : intl.formatMessage({
          id: 'shippingEstimate-scheduled-no-dates',
        })

    return (
      <Fragment>
        {lowerCase
          ? translatedEstimateDeliveryWindow.toLowerCase()
          : translatedEstimateDeliveryWindow}
      </Fragment>
    )
  }

  const id = getTranslateId(shippingEstimate, isPickup)
  const timeAmount = getTimeAmount(shippingEstimate)

  let translatedEstimate = ''

  if (id && timeAmount && intl) {
    translatedEstimate = intl.formatMessage({ id }, { timeAmount })
  }

  if (lowerCase) {
    translatedEstimate = translatedEstimate.toLowerCase()
  }

  return <Fragment>{translatedEstimate}</Fragment>
}
