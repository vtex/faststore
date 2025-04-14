import type { Locator } from '@vtex/client-cms'
import type { GetServerSideProps } from 'next'
import { NextSeo } from 'next-seo'
import type { ComponentType } from 'react'
import { MyAccountLayout } from 'src/components/account'
import MyAccountOrderDetails from 'src/components/account/orders/MyAccountOrderDetails'
import RenderSections from 'src/components/cms/RenderSections'
import { default as GLOBAL_COMPONENTS } from 'src/components/cms/global/Components'
import CUSTOM_COMPONENTS from 'src/customizations/src/components'
import type { MyAccountProps } from 'src/experimental/myAccountSeverSideProps'

import { getGlobalSectionsData } from 'src/components/cms/GlobalSections'
import { injectGlobalSections } from 'src/server/cms/global'

const COMPONENTS: Record<string, ComponentType<any>> = {
  ...GLOBAL_COMPONENTS,
  ...CUSTOM_COMPONENTS,
}

type OrderDetailsPageProps = {
  orderId: string
} & MyAccountProps

export default function OrderDetailsPage({
  globalSections,
  orderId,
}: OrderDetailsPageProps) {
  return (
    <RenderSections
      globalSections={globalSections.sections}
      components={COMPONENTS}
    >
      <NextSeo noindex nofollow />

      <MyAccountLayout>
        <MyAccountOrderDetails orderId={orderId} />
      </MyAccountLayout>
    </RenderSections>
  )
}

export const getServerSideProps: GetServerSideProps<
  OrderDetailsPageProps,
  Record<string, string>,
  Locator
> = async (context) => {
  const {
    previewData,
    params: { orderId },
  } = context
  const [
    globalSectionsPromise,
    globalSectionsHeaderPromise,
    globalSectionsFooterPromise,
  ] = getGlobalSectionsData(previewData)

  const [globalSections, globalSectionsHeader, globalSectionsFooter] =
    await Promise.all([
      globalSectionsPromise,
      globalSectionsHeaderPromise,
      globalSectionsFooterPromise,
    ])

  const globalSectionsResult = injectGlobalSections({
    globalSections,
    globalSectionsHeader,
    globalSectionsFooter,
  })

  return {
    props: { globalSections: globalSectionsResult, orderId },
  }
}
