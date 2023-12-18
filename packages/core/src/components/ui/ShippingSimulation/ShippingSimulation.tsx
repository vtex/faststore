import { ShippingSimulationProps as UIShippingSimulationProps } from '@faststore/ui'

import { useShippingSimulation } from 'src/sdk/shipping/useShippingSimulation'

import { useOverrideComponents } from 'src/sdk/overrides/OverrideContext'

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
  const { ShippingSimulation: ShippingSimulationWrapper } =
    useOverrideComponents<'ProductDetails'>()

  const {
    input,
    shippingSimulation,
    handleSubmit,
    handleOnInput,
    handleOnClear,
  } = useShippingSimulation(productShippingInfo)

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
