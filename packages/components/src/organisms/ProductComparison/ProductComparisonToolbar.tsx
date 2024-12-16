import React from 'react'
import Image from 'next/image'
import Button from '../../atoms/Button'
import { useProductComparison } from '../../hooks/useProductComparison'
import Skeleton from '../../atoms/Skeleton'

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
                width={80}
                height={80}
              />
            ))}

            {selectedProducts.length > 3 && (
              <Skeleton size={{ width: '80px', height: '80px' }}>
                <p>{`+${selectedProducts.length - 3}`}</p>
              </Skeleton>
            )}
            <div>
              <p>
                {selectedLabel} {selectedProducts.length}
              </p>
            </div>
          </div>

            <Button variant="tertiary" onClick={() => clearProducts()}>
              {clearSelectionLabel}
            </Button>
            <Button
              variant="primary"
              disabled={selectedProducts.length < 2}
              onClick={() => setIsOpen(true)}
            >
              {compareLabel}
            </Button>
        </footer>
      ) : null}
    </>
  )
}

export default ProductComparisonToolbar
