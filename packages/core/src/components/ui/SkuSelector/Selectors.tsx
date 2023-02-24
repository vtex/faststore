import type { HTMLAttributes } from 'react'

import { Image } from '../Image'
import {
  SkuSelector as UISkuSelector,
  SkuSelectorProps,
  SkuOption,
} from '@faststore/ui'
import type { SkuVariantsByName } from './SkuSelectorsContext'
import { SkuSelectorsContext } from './SkuSelectorsContext'

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
  /**
   * Name of the property that's considered **dominant**. Which means that all
   * other varying properties will be filtered according to the current value
   * of this property.
   *
   * Ex: If `Red` is the current value for the 'Color' variation, we'll only
   * render possible values for 'Size' that are available in `Red`.
   */
  dominantVariation: string
  mountItemHref: (option: SkuOption) => string
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

const LinkComponent: SkuSelectorProps['LinkComponent'] = ({
  href,
  children,
  ...otherProps
}) => (
  <a href={href} {...otherProps}>
    {children}
  </a>
)

function Selectors({
  slugsMap,
  activeVariations,
  dominantVariation,
  availableVariations,
  mountItemHref,
  ...otherProps
}: Props) {
  // `dominantVariation` variants are singled-out here because they will always
  // be rendered as 'image' variants.
  const { [dominantVariation]: dominantOptions, ...otherSkuVariants } =
    availableVariations

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
        {dominantOptions && (
          <UISkuSelector
            skuPropertyName={dominantVariation}
            variant="image"
            options={dominantOptions}
            LinkComponent={LinkComponent}
            ImageComponent={ImageComponent}
            activeVariations={activeVariations}
            mountItemHref={mountItemHref}
          />
        )}
        {otherSkuVariants &&
          Object.keys(otherSkuVariants).map((skuVariant) => (
            <UISkuSelector
              variant="label"
              key={skuVariant}
              skuPropertyName={skuVariant}
              options={otherSkuVariants[skuVariant]}
              LinkComponent={LinkComponent}
              ImageComponent={ImageComponent}
              activeVariations={activeVariations}
              mountItemHref={mountItemHref}
            />
          ))}
      </SkuSelectorsContext.Provider>
    </section>
  )
}

export default Selectors
