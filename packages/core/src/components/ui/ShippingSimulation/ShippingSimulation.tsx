import { ShippingSimulationProps as UIShippingSimulationProps } from '@faststore/ui'

import { getShippingSimulation } from 'src/sdk/shipping'
import { ShippingSla } from '@generated/graphql'
import { useSession } from 'src/sdk/session'
import { IShippingItem } from '@faststore/api'
import { useShippingSimulation } from './useShippingSimulation'

import { ShippingSimulation as ShippingSimulationWrapper } from 'src/components/sections/ProductDetails/Overrides'

type ShippingSimulationOptionalProps =
  | 'title'
  | 'formatter'
  | 'inputLabel'
  | 'optionsLabel'
  | 'idkPostalCodeLinkProps'

interface ShippingSimulationProps
  extends Partial<
    Pick<UIShippingSimulationProps, ShippingSimulationOptionalProps>
  > {
  productShippingInfo: {
    id: string
    quantity: number
    seller: string
  }
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
  inputLabel,
  title,
  idkPostalCodeLinkProps,
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
    <ShippingSimulationWrapper.Component
      formatter={formatter}
      onInput={handleOnInput}
      onSubmit={handleSubmit}
      onClear={handleOnClear}
      location={location}
      options={options}
      displayClearButton={displayClearButton}
      errorMessage={errorMessage}
      postalCode={postalCode}
      inputLabel={inputLabel}
      title={title}
      idkPostalCodeLinkProps={idkPostalCodeLinkProps}
      {...otherProps}
    />
  )
}
