import {
  ShippingSimulation as UIShippingSimulation,
  ShippingSimulationProps,
} from '@faststore/ui'
import { getShippingSimulation } from 'src/sdk/shipping'
import { ShippingSimulationQueryQuery, ShippingSla } from '@generated/graphql'
import { useSession } from 'src/sdk/session'
import { IShippingItem } from '@faststore/api'

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
  ...shippingSimulationProps
}: Omit<ShippingSimulationProps, 'country' | 'fetchShippingSimulationFn'>) {
  const { country, postalCode } = useSession()

  return (
    <UIShippingSimulation
      country={country}
      sessionPostalCode={postalCode}
      fetchShippingSimulation={fetchShippingSimulation}
      {...shippingSimulationProps}
    />
  )
}
