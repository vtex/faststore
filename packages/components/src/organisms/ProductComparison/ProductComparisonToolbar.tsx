import React, { type FunctionComponent } from 'react'
import Button from '../../atoms/Button'
import { useProductComparison } from '../../hooks/useProductComparison'
import SelectField from '../../molecules/SelectField'

type ImageComponentType = FunctionComponent<{
  src: string
  alt: string
  width?: number
  height?: number
}>
export interface ProductComparisonToolbarProps {
  /*
   * Set the label for the warning message when products are selected.
   */
  selectionWarningLabel?: string
  /*
   * Set the label for the compare button
   */
  compareButtonLabel?: string
  /*
   * Set the label for the clear selection button
   */
  clearSelectionButtonLabel?: string
}

const ImageComponent: ImageComponentType = ({ src, alt, ...otherProps }) => (
  <img src={src} alt={alt} {...otherProps} />
)

function ProductComparisonToolbar({
  clearSelectionButtonLabel,
  compareButtonLabel,
  selectionWarningLabel,
}: ProductComparisonToolbarProps) {
  const { isOpen, setIsOpen, products, clearProducts } = useProductComparison()

  const selectedProductsDisplay = products.slice(0, 3)

  if (!products.length && isOpen) return null

  return (
    <footer data-fs-product-comparison-toolbar>
      <div data-fs-product-comparison-toolbar-image>
        {selectedProductsDisplay.map((product) => (
          <ImageComponent
            key={product.id}
            src={product.image[0].url}
            alt={product.name}
            width={60}
            height={60}
          />
        ))}

        {products.length > 3 && (
          <div data-fs-product-comparison-toolbar-image-more>
            <p>{`+${products.length - 3}`}</p>
          </div>
        )}

        {products.length === 1 && (
          <SelectField
            disabled
            label={selectionWarningLabel as string}
            value={''}
            id={''}
            options={{}}
          />
        )}
      </div>

      <Button variant="tertiary" onClick={() => clearProducts()}>
        {clearSelectionButtonLabel}
      </Button>
      <Button
        variant="primary"
        disabled={products.length < 2}
        onClick={() => setIsOpen(true)}
      >
        {products.length > 1
          ? `${compareButtonLabel} ${products.length}`
          : compareButtonLabel}
      </Button>
    </footer>
  )
}

export default ProductComparisonToolbar
