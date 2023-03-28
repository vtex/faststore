import { HTMLAttributes, useCallback, useMemo } from 'react'

import { Image } from '../Image'
import {
  SkuSelector as UISkuSelector,
  SkuSelectorProps,
  SkuOption,
} from '@faststore/ui'
import NextLink from 'next/link'

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
}) => (
  <Image
    src={src}
    alt={alt}
    width={20}
    height={20}
    loading="lazy"
    {...otherProps}
  />
)

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
          <UISkuSelector
            key={skuVariant}
            skuPropertyName={skuVariant}
            availableVariations={availableVariations}
            ImageComponent={ImageComponent}
            activeVariations={activeVariations}
            slugsMap={slugsMap}
            linkProps={{
              as: NextLink,
              legacyBehavior: false,
            }}
          />
        ))}
    </section>
  )
}

export default Selectors
