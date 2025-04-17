'use client'

import dynamic from 'next/dynamic'
import type { LandingPageProps } from 'src/components/templates/LandingPage'
import ProductListingPage, {
  type ProductListingPageProps,
} from 'src/components/templates/ProductListingPage'
import type { CatchAllProps } from './types'
import { Suspense } from 'react'

const LandingPage = dynamic(
  () => import('src/components/templates/LandingPage'),
  { ssr: false }
)

function Page({ globalSections, type, ...otherProps }: CatchAllProps) {
  return (
    <Suspense>
      {type === 'plp' && (
        <ProductListingPage
          globalSections={globalSections.sections}
          {...(otherProps as ProductListingPageProps)}
        />
      )}
      {type === 'page' && (
        <LandingPage
          globalSections={globalSections.sections}
          {...(otherProps as LandingPageProps)}
        />
      )}
    </Suspense>
  )
}

export default Page
