import type { Locator } from '@vtex/client-cms'
import type { GetStaticProps } from 'next'
import { NextSeo } from 'next-seo'
import type { ComponentType } from 'react'
import {
  type GlobalSectionsData,
  getGlobalSectionsData,
} from 'src/components/cms/GlobalSections'

import RenderSections from 'src/components/cms/RenderSections'

import { type PageContentType, getPage } from 'src/server/cms'
import { injectGlobalSections } from 'src/server/cms/global'
import { NotFoundComponents } from './not-found-client'

export default async function Page() {
  const {
    page: { sections },
    globalSections,
  } = await getLayout()

  return (
    <RenderSections
      sections={sections}
      globalSections={globalSections.sections}
      components={NotFoundComponents}
    />
  )
}

async function getLayout(previewData: any = undefined) {
  const [
    globalSectionsPromise,
    globalSectionsHeaderPromise,
    globalSectionsFooterPromise,
  ] = getGlobalSectionsData(previewData)

  const [page, globalSections, globalSectionsHeader, globalSectionsFooter] =
    await Promise.all([
      getPage<PageContentType>({
        ...(previewData?.contentType === '404' && previewData),
        contentType: '404',
      }),
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
    page,
    globalSections: globalSectionsResult,
  }
}
