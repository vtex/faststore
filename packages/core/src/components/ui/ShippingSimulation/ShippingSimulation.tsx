import { ShippingSimulationProps as UIShippingSimulationProps } from '@faststore/ui'

import { useSession } from 'src/sdk/session'
import { useShippingSimulation } from 'src/sdk/shipping/useShippingSimulation'

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
  } = useShippingSimulation(productShippingInfo, sessionPostalCode, country)

  const { postalCode, displayClearButton, errorMessage } = input

  const location =
    [
      shippingSimulation?.address?.neighborhood,
      shippingSimulation?.address?.city,
    ]
      .filter(Boolean)
      .join(' / ') ?? ''

  const options = shippingSimulation?.logisticsInfo?.[0]?.slas ?? []

  return (
    <ShippingSimulationWrapper.Component
      formatter={formatter}
      onInput={handleOnInput}
      onSubmit={handleSubmit}
      onClear={handleOnClear}
      location={location}
      options={options}
      address={shippingSimulation?.address}
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
