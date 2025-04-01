import { NextSeo } from 'next-seo'
import { useRouter } from 'next/router'
import type { ComponentType } from 'react'
import { MyAccountLayout } from 'src/components/account'
import MyAccountOrderDetails from 'src/components/account/orders/MyAccountOrderDetails'
import RenderSections from 'src/components/cms/RenderSections'
import { default as GLOBAL_COMPONENTS } from 'src/components/cms/global/Components'
import CUSTOM_COMPONENTS from 'src/customizations/src/components'
import {
  getServerSideProps,
  type MyAccountProps,
} from 'src/experimental/myAccountSeverSideProps'

const COMPONENTS: Record<string, ComponentType<any>> = {
  ...GLOBAL_COMPONENTS,
  ...CUSTOM_COMPONENTS,
}

export default function OrderDetailsPage({ globalSections }: MyAccountProps) {
  const router = useRouter()
  const id = Array.isArray(router.query.id)
    ? router.query.id[0]
    : router.query.id

  return (
    <RenderSections
      globalSections={globalSections.sections}
      components={COMPONENTS}
    >
      <NextSeo noindex nofollow />

      <MyAccountLayout>
        <MyAccountOrderDetails orderId={id} />
      </MyAccountLayout>
    </RenderSections>
  )
}

export { getServerSideProps }
