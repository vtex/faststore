import {
  ShippingSimulation as UIShippingSimulation,
  ShippingSimulationProps as UIShippingSimulationProps,
} from '@faststore/ui'
import { getShippingSimulation } from 'src/sdk/shipping'
import { ShippingSla } from '@generated/graphql'
import { useSession } from 'src/sdk/session'
import { IShippingItem } from '@faststore/api'
import { useShippingSimulation } from './useShippingSimulation'

interface ShippingSimulationProps {
  productShippingInfo: {
    id: string
    quantity: number
    seller: string
  }
  formatter?: UIShippingSimulationProps['formatter']
}

const fetchShippingSimulation = async (
  shippingItem: IShippingItem,
  country: string,
  postalCode: string
): Promise<[string, ShippingSla[]]> => {
  const shipping = await getShippingSimulation({
    country,
    postalCode: postalCode,
    items: [shippingItem],
  })

  const location =
    [shipping?.address?.neighborhood, shipping?.address?.city]
      .filter(Boolean)
      .join(' / ') ?? ''

  const options = shipping?.logisticsInfo?.[0]?.slas ?? []

  return [location, options as ShippingSla[]]
}

export default function ShippingSimulation({
  productShippingInfo,
  formatter,
  ...otherProps
}: ShippingSimulationProps) {
  const { country, postalCode: sessionPostalCode } = useSession()

  const {
    input,
    shippingSimulation,
    handleSubmit,
    handleOnInput,
    handleOnClear,
  } = useShippingSimulation(
    productShippingInfo,
    fetchShippingSimulation,
    sessionPostalCode,
    country
  )

  const { postalCode, displayClearButton, errorMessage } = input

  const { location, options } = shippingSimulation

  return (
    <UIShippingSimulation
      formatter={formatter}
      onInput={handleOnInput}
      onSubmit={handleSubmit}
      onClear={handleOnClear}
      location={location}
      options={options}
      displayClearButton={displayClearButton}
      errorMessage={errorMessage}
      postalCode={postalCode}
      {...otherProps}
    />
  )
}
