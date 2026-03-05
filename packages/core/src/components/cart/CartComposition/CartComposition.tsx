import { Icon as UIIcon } from '@faststore/ui'

import { useFormattedPrice } from 'src/sdk/product/useFormattedPrice'
import type { CompositionDisplayData } from 'src/sdk/fastcheckout/types'

import styles from './CartComposition.module.scss'

interface CartCompositionProps {
  compositions: CompositionDisplayData[]
}

function CompositionPrice({ value }: { value: number }) {
  const formatted = useFormattedPrice(value)

  return <>{formatted}</>
}

function CartComposition({ compositions }: CartCompositionProps) {
  if (compositions.length === 0) return null

  return (
    <div className={styles.cartComposition}>
      {compositions.map((group) => (
        <div key={group.groupName} className={styles.cartComposition__group}>
          <h4 className={styles.cartComposition__groupHeader}>
            {group.groupName}
          </h4>
          <table className={styles.cartComposition__table}>
            <tbody>
              {group.items.map((item) => (
                <tr
                  key={item.name}
                  className={`${styles.cartComposition__row} ${
                    !item.isAvailable
                      ? styles['cartComposition__row--unavailable']
                      : ''
                  }`}
                >
                  <td className={styles.cartComposition__cell}>
                    <span className={styles.cartComposition__cellName}>
                      {!item.isAvailable && (
                        <span className={styles.cartComposition__warningIcon}>
                          <UIIcon
                            name="Warning"
                            width={14}
                            height={14}
                          />
                        </span>
                      )}
                      {item.name}
                    </span>
                  </td>
                  <td
                    className={`${styles.cartComposition__cell} ${styles.cartComposition__cellQty}`}
                  >
                    x{item.quantity}
                  </td>
                  <td
                    className={`${styles.cartComposition__cell} ${styles.cartComposition__cellPrice}`}
                  >
                    <CompositionPrice value={item.price} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ))}
    </div>
  )
}

export default CartComposition
