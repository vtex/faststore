import React from 'react'
import Image from 'next/image'
import Button from '../../atoms/Button'
import { useProductComparison } from '../../hooks/useProductComparison'

export interface ProductComparisonToolbarProps {
  selectedLabel?: string
  compareLabel?: string
  clearSelectionLabel?: string
}

function ProductComparisonToolbar({
  selectedLabel = 'Select at least',
  compareLabel = 'Compare',
  clearSelectionLabel = 'Clear selection',
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
                  {selectedLabel} {selectedProducts.length}
                </p>
              </div>
            )}
          </div>

          <Button variant="tertiary" onClick={() => clearProducts()}>
            {clearSelectionLabel}
          </Button>
          <Button
            variant="primary"
            disabled={selectedProducts.length < 2}
            onClick={() => setIsOpen(true)}
          >
            {selectedProducts.length > 1 ? `${compareLabel} ${selectedProducts.length}` : compareLabel }
          </Button>
        </footer>
      ) : null}
    </>
  )
}

export default ProductComparisonToolbar
