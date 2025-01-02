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
  const { isOpen, setIsOpen, products, clearProducts } =
    useProductComparison()

  const selectedProductsDisplay = products.slice(0, 3)

  return (
    <>
      {products.length >= 1 && !isOpen ? (
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

            {products.length > 3 && (
              <div data-fs-product-comparison-toolbar-image-more>
                <p>{`+${products.length - 3}`}</p>
              </div>
            )}

            {products.length === 1 && (
              <div>
                <p>
                  {selectionWarningLabel} {products.length}
                </p>
              </div>
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
            {products.length > 1 ? `${compareButtonLabel} ${products.length}` : compareButtonLabel }
          </Button>
        </footer>
      ) : null}
    </>
  )
}

export default ProductComparisonToolbar
