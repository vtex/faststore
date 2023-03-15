import { HTMLAttributes, useCallback, useMemo } from 'react'

import { Image } from '../Image'
import {
  SkuSelector as UISkuSelector,
  SkuSelectorProps,
  SkuOption,
} from '@faststore/ui'
import type { SkuVariantsByName } from './SkuSelectorsContext'
import { SkuSelectorsContext } from './SkuSelectorsContext'

import NextLink from 'next/link'
import { getSkuSlug } from './skuVariants'

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
  // `dominantVariation` will be ever the first variant
  const [dominantVariation] = useMemo(() => {
    return Object.keys(activeVariations)
  }, [activeVariations])

  const getItemHref = useCallback(
    (option: SkuOption) => {
      const currentItemHref = `/${getSkuSlug(
        slugsMap,
        {
          ...activeVariations,
          [dominantVariation]: option.value,
        },
        dominantVariation
      )}/p`
      return currentItemHref
    },
    [activeVariations, dominantVariation, slugsMap]
  )

  return (
    <section {...otherProps}>
      <SkuSelectorsContext.Provider
        value={{
          slugsMap,
          availableVariations,
          activeVariations,
          dominantProperty: dominantVariation,
        }}
      >
        {availableVariations &&
          Object.keys(availableVariations).map((skuVariant) => (
            <UISkuSelector
              key={skuVariant}
              skuPropertyName={skuVariant}
              options={availableVariations[skuVariant]}
              ImageComponent={ImageComponent}
              activeVariations={activeVariations}
              linkProps={{
                as: NextLink,
                legacyBehavior: false,
              }}
              getItemHref={getItemHref}
            />
          ))}
      </SkuSelectorsContext.Provider>
    </section>
  )
}

export default Selectors
