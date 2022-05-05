import type { Resolver } from '..'
import type {
  OrderForm,
  OrderFormItem,
} from '../clients/commerce/types/OrderForm'

type Root = OrderForm

export const StoreOrder: Record<string, Resolver<Root>> = {
  orderNumber: (root) => root.orderFormId,
  acceptedOffer: (root, _, ctx) => {
    const {
      loaders: { skuLoader },
    } = ctx

    /**
     * Builds a map from parent items to their children for all tree levels
     */
    const itemsByParent = root.items.reduce((itemsByParentAcc, item, index) => {
      if (item.parentItemIndex !== null) {
        itemsByParentAcc.set(item.parentItemIndex, [
          ...(itemsByParentAcc.get(item.parentItemIndex) ?? []),
          index,
        ])
      }

      return itemsByParentAcc
    }, new Map<number, number[]>())

    /**
     * Enhanced items
     * This code counts on the fact that leaf nodes (offers with no addOns) are
     * sorted after their parents.

     * Steps:
     * 1. Creates new array with the orderForm items (required due to step 2)
     * 2. Reverses the array so that left nodes are enhanced first (.reverse() always mutates the array)
     * 3. Calculates original unreversed index (originalIndex)
     * 4. Loads sku data
     * 5. Gets addOns ids using originalIndex and maps them over to the already enhanced items
     * 6. Returns the enhancedItems array in original order (reverses the reverse)
     */
    const enhancedItems = [...root.items]
      .reverse()
      .reduce((acc, item, index) => {
        const originalIndex = root.items.length - 1 - index

        const enhancedItem = {
          ...item,
          product: skuLoader.load([{ key: 'id', value: item.id }]),
          addOn: itemsByParent
            .get(originalIndex)
            // Considers the last analyzed item is at 0 since the list is being reversed below
            ?.map((childIndex) => acc[childIndex - originalIndex - 1])
            // Filter possibly undefined values in case leaf nodes are not sorted as expected
            // TODO: throw warn in case that happens
            .filter(Boolean),
        }

        // Reverses back the array by inserting new items to the beginning
        acc.unshift(enhancedItem)

        return acc
      }, [] as OrderFormItem[])

    // Filter only root nodes
    return enhancedItems.filter((item) => item.parentItemIndex === null)
  },
}
