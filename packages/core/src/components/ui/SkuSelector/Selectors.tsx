import { HTMLAttributes } from 'react'

import { SkuSelectorProps } from '@faststore/ui'
import NextLink from 'next/link'
import { Image } from '../Image'

import { SkuSelector } from 'src/components/sections/ProductDetails/Overrides'

export type SkuVariantsByName = Record<
  string,
  Array<{ alt: string; label: string; value: string; src?: string }>
>

interface Props extends HTMLAttributes<HTMLDivElement> {
  /**
   * Maps property value combinations to their respective SKU's slug
   */
  slugsMap: Record<string, string>
  /**
   * Available options for each varying SKU property, taking into account the `dominantVariantName` property.
   */
  availableVariations: SkuVariantsByName
  /**
   * SKU property values for the current SKU.
   */
  activeVariations: Record<string, string>
}

const ImageComponent: SkuSelectorProps['ImageComponent'] = ({
  src,
  alt,
  ...otherProps
}) => <Image src={src} alt={alt} width={34} height={34} {...otherProps} />

function Selectors({
  slugsMap,
  activeVariations,
  availableVariations,
  ...otherProps
}: Props) {
  return (
    <section {...otherProps}>
      {availableVariations &&
        Object.keys(availableVariations).map((skuVariant) => (
          <SkuSelector.Component
            ImageComponent={ImageComponent}
            {...SkuSelector.props}
            key={skuVariant}
            skuPropertyName={skuVariant}
            availableVariations={availableVariations}
            activeVariations={activeVariations}
            slugsMap={slugsMap}
            linkProps={{
              ...(SkuSelector.props.linkProps ?? {}),
              as: SkuSelector.props.linkProps?.as ?? NextLink,
              legacyBehavior:
                SkuSelector.props.linkProps?.legacyBehavior ?? false,
            }}
          />
        ))}
    </section>
  )
}

export default Selectors
