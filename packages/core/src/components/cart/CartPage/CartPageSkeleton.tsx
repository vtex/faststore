import { Skeleton } from '@faststore/ui'

import styles from './cart-page.module.scss'

function CartPageSkeleton() {
  return (
    <div className={styles.skeleton} data-fs-cart-page-skeleton>
      <div className={styles.skeletonContent}>
        <Skeleton
          size={{ width: '200px', height: '2rem' }}
          style={{ marginBottom: '1.5rem' }}
        />

        {[1, 2, 3].map((i) => (
          <div key={i} className={styles.skeletonItem}>
            <div style={{ display: 'flex', gap: '1rem' }}>
              <Skeleton size={{ width: '80px', height: '80px' }} />
              <div style={{ flex: 1 }}>
                <Skeleton
                  size={{ width: '60%', height: '1rem' }}
                  style={{ marginBottom: '0.5rem' }}
                />
                <Skeleton
                  size={{ width: '40%', height: '0.875rem' }}
                  style={{ marginBottom: '0.5rem' }}
                />
                <Skeleton size={{ width: '30%', height: '1rem' }} />
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className={styles.skeletonSidebar}>
        <Skeleton
          size={{ width: '100%', height: '120px' }}
          style={{ marginBottom: '1rem' }}
        />
        <Skeleton
          size={{ width: '100%', height: '80px' }}
          style={{ marginBottom: '1rem' }}
        />
        <Skeleton size={{ width: '100%', height: '180px' }} />
      </div>
    </div>
  )
}

export default CartPageSkeleton
