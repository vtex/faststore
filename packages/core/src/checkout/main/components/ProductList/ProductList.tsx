import { type ProductItem, LazyRender, Separator, Product } from '../../../ui'
import { ExtensionPoint } from '../../remote-render'

export type ProductListProps = {
  products: ProductItem[]
  onProductQuantityChange?: (options: {
    itemIndex: number
    quantity: number
  }) => void
}

const INITIAL_PLACEHOLDER_HEIGHT_PX = 100

export function ProductList({
  products,
  onProductQuantityChange,
}: ProductListProps) {
  return (
    <div>
      {products.map((product, index) => (
        <div
          key={product.id}
          className="bg-white will-change-[transform,opacity] relative"
        >
          <LazyRender
            initialPlaceholderHeight={INITIAL_PLACEHOLDER_HEIGHT_PX}
            shouldInitiallyRender={index <= 6}
          >
            <Product
              product={product}
              onQuantityChange={(quantity) =>
                onProductQuantityChange?.({ itemIndex: index, quantity })
              }
            />
            <div className="absolute top-[56px] left-[144px]">
              {/* <ExtensionPoint extension="AfterProductTitle" /> */}
            </div>
          </LazyRender>
          {index < products.length - 1 && <Separator />}
        </div>
      ))}
    </div>
  )
}
