import React from 'react'
import Image from 'next/image'
import Button from '../../atoms/Button'
import { useProductComparison } from '../../hooks/useProductComparison'

export interface ProductComparisonToolbarProps {
  selectionWarningLabel?: string
  compareButtonLabel?: string
  clearSelectionButtonLabel?: string
}

function ProductComparisonToolbar({
  clearSelectionButtonLabel,
  compareButtonLabel,
  selectionWarningLabel
}: ProductComparisonToolbarProps) {
  const { isOpen, setIsOpen, selectedProducts, clearProducts } =
    useProductComparison()

  const selectedProductsDisplay = selectedProducts.slice(0, 3)

  return (
    <>
      {selectedProducts.length >= 1 && !isOpen ? (
        <footer data-fs-product-comparison-toolbar>
          <div data-fs-product-comparison-toolbar-image>
            {selectedProductsDisplay.map((product) => (
              <Image
                key={product.id}
                src={product.image[0].url}
                alt={product.name}
                width={60}
                height={60}
              />
            ))}

            {selectedProducts.length > 3 && (
              <div data-fs-product-comparison-toolbar-image-more>
                <p>{`+${selectedProducts.length - 3}`}</p>
              </div>
            )}

            {selectedProducts.length === 1 && (
              <div>
                <p>
                  {selectionWarningLabel} {selectedProducts.length}
                </p>
              </div>
            )}
          </div>

          <Button variant="tertiary" onClick={() => clearProducts()}>
            {clearSelectionButtonLabel}
          </Button>
          <Button
            variant="primary"
            disabled={selectedProducts.length < 2}
            onClick={() => setIsOpen(true)}
          >
            {selectedProducts.length > 1 ? `${compareButtonLabel} ${selectedProducts.length}` : compareButtonLabel }
          </Button>
        </footer>
      ) : null}
    </>
  )
}

export default ProductComparisonToolbar
