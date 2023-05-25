import type { PropsWithChildren } from 'react'
import { lazy, Suspense } from 'react'

import { useUI } from '@faststore/ui'

const RegionModal = lazy(() => import('src/components/region/RegionModal'))

function Layout({ children }: PropsWithChildren) {
  const { modal: displayModal } = useUI()

  return (
    <>
      {children}

      {displayModal && (
        <Suspense fallback={null}>
          <RegionModal />
        </Suspense>
      )}
    </>
  )
}

export default Layout
