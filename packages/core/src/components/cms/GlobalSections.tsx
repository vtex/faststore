import type { PropsWithChildren } from 'react'

import { Locator, Section } from '@vtex/client-cms'
import { PageContentType, getPage } from 'src/server/cms'
import { GetStaticPropsContext } from 'next'
import Navbar from 'src/components/common/Navbar'
import Toast from 'src/components/common/Toast'

import Alert, { AlertProps } from 'src/components/sections/Alert/Alert'

type GetLayoutProps = {
  context: GetStaticPropsContext<Record<string, string>, Locator>
}

export type GlobalSectionsData = {
  alert: Section['data']
}

function GlobalSections({
  children,
  alert,
}: PropsWithChildren<GlobalSectionsData>) {
  return (
    <>
      <Alert {...(alert as AlertProps)} />

      <Navbar />

      <Toast />

      {children}
    </>
  )
}

export default GlobalSections

export const getGlobalSectionsData = async ({
  context,
}: GetLayoutProps): Promise<GlobalSectionsData> => {
  const {
    sections: [alert],
  } = await getPage<PageContentType>({
    ...(context.previewData?.contentType === 'globalAlert'
      ? context.previewData
      : { filters: { 'settings.seo.slug': '/' } }),
    contentType: 'globalAlert',
  })

  return {
    alert: alert.data,
  }
}
