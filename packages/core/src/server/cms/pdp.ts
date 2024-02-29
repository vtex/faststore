import { ServerProductQueryQuery } from '@generated/graphql'
import type { ContentData, Locator } from '@vtex/client-cms'
import MissingContentError from 'src/sdk/error/MissingContentError'
import { findBestPDPTemplate } from 'src/utils/utilities'
import { Options, getCMSPage, getPage } from '.'
import config from '../../../faststore.config'

type PDPSettings = {
  settings: {
    template?: {
      value?: string
    }
  }
}

type PDPfromCmsEnvData = {
  documentId: string
  versionId: string
} & PDPSettings

export type PDPContentType = ContentData & PDPSettings

export const getPDP = async (
  slug: string,
  product: ServerProductQueryQuery['product'],
  previewData: Locator
) => {
  console.log('🚀 ~ config.cms.data:', config.cms.data)
  if (config.cms.data) {
    const cmsData = JSON.parse(config.cms.data)
    const allPDPsFromCmsEnvData: PDPfromCmsEnvData[] = cmsData['pdp']
    console.log('🚀 ~ allPDPsFromCmsEnvData:', allPDPsFromCmsEnvData)

    return await getPDPFromCmsEnvData(
      `/${slug}/p`,
      product,
      allPDPsFromCmsEnvData,
      {
        ...(previewData?.contentType === 'pdp' ? previewData : null),
        contentType: 'pdp',
      }
    )
  }

  return (await getPDPFromCms(`/${slug}/p`, product, {
    ...(previewData?.contentType === 'pdp' ? previewData : null),
    contentType: 'pdp',
  })) as PDPContentType
}

const getPDPFromCmsEnvData = async (
  slug: string,
  product: ServerProductQueryQuery['product'],
  allPDPsFromCMSData: PDPfromCmsEnvData[],
  options: Options
): Promise<PDPContentType> => {
  const pages: PDPfromCmsEnvData[] = allPDPsFromCMSData ?? []

  if (!pages[0]) {
    throw new MissingContentError(options)
  }

  const template = findBestPDPTemplate(pages, slug, product)

  return getPage<PDPContentType>({
    contentType: 'pdp',
    documentId: template.documentId as string,
    versionId: template.versionId,
  })
}

const getPDPFromCms = async (
  slug: string,
  product: ServerProductQueryQuery['product'],
  options: Options
): Promise<Partial<PDPContentType>> => {
  const pages = (await getCMSPage(options)).data

  if (!pages[0]) {
    throw new MissingContentError(options)
  }

  return findBestPDPTemplate(pages, slug, product)
}
