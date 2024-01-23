import { useId } from 'react'

import { Price } from '../Price'
import { ProductImage } from '../ProductImage'
import { QuantitySelector } from '../QuantitySelector'

export type ProductItem = {
  productId: string
  id: string
  name: string
  skuName: string
  brandName?: string
  imageUrl: string
  price: number
  listPrice?: number
  quantity: number
}

export type ProductProps = {
  product: ProductItem
  onQuantityChange?: (quantity: number) => void
}

export function Product({ product, onQuantityChange }: ProductProps) {
  const id = useId()

  return (
    <article data-testid={`product-${product.id}`} className="flex bg-white">
      <div className="flex-shrink-0">
        <ProductImage src={product.imageUrl} alt={product.name} />
      </div>
      <div className="ml-4 flex w-full flex-col justify-between md:ml-6 md:flex-row">
        <div className="mb-4 flex flex-col md:mb-0">
          {product.brandName && (
            <p className="text-text-secondary mb-1 text-xs font-semibold leading-4 md:text-sm md:leading-5 md:tracking-tight">
              {product.brandName}
            </p>
          )}
          <h2
            id={`product-title-${id}`}
            className="text-text-primary md:tracking-tightest text-base font-semibold leading-5 tracking-tight md:text-lg md:leading-6"
          >
            {product.name}
          </h2>
          <h3 className="text-text-secondary md:tracking-tightest text-base leading-5 tracking-tight md:text-lg md:leading-6">
            {product.skuName}
          </h3>
        </div>

        <div className="items-last-baseline flex flex-wrap justify-between gap-3 md:flex-col md:items-end">
          <div className="flex flex-col items-start md:items-end">
            {product.listPrice !== undefined &&
              product.listPrice !== product.price && (
                <div className="text-text-secondary text-xs leading-3 line-through md:mb-0.5 md:text-sm md:leading-4">
                  <Price value={product.listPrice} />
                </div>
              )}

            <div className="text-text-primary md:tracking-tightest text-base leading-5 tracking-tight md:text-lg md:leading-6">
              <Price value={product.price} />
            </div>
          </div>
          <QuantitySelector
            quantity={product.quantity}
            min={0}
            max={60}
            label="Quantidade do produto"
            onChange={onQuantityChange}
          />
        </div>
      </div>
    </article>
  )
}
