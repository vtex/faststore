import { ServerProductQueryQuery } from '@generated/graphql'
import type { ContentData, Locator } from '@vtex/client-cms'
import MissingContentError from 'src/sdk/error/MissingContentError'
import { findBestPDPTemplate } from 'src/utils/multipleTemplates'
import { Options, getCMSPage, getPage } from '.'
import config from '../../../discovery.config'

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
  product: ServerProductQueryQuery['product'],
  previewData: Locator
) => {
  if (config.cms.data) {
    const cmsData = JSON.parse(config.cms.data)
    const allPDPsFromCmsEnvData: PDPfromCmsEnvData[] = cmsData['pdp']

    return await getPDPFromCmsEnvData(product, allPDPsFromCmsEnvData, {
      ...(previewData?.contentType === 'pdp' ? previewData : null),
      contentType: 'pdp',
    })
  }

  return (await getPDPFromCms(product, {
    ...(previewData?.contentType === 'pdp' ? previewData : null),
    contentType: 'pdp',
  })) as PDPContentType
}

const getPDPFromCmsEnvData = async (
  product: ServerProductQueryQuery['product'],
  allPDPsFromCMSData: PDPfromCmsEnvData[],
  options: Options
): Promise<PDPContentType> => {
  const pages: PDPfromCmsEnvData[] = allPDPsFromCMSData ?? []

  if (!pages[0]) {
    throw new MissingContentError(options)
  }

  const template = findBestPDPTemplate(pages, product)

  return getPage<PDPContentType>({
    contentType: 'pdp',
    documentId: template.documentId as string,
    versionId: template.versionId,
  })
}

const getPDPFromCms = async (
  product: ServerProductQueryQuery['product'],
  options: Options
): Promise<Partial<PDPContentType>> => {
  const pages = (await getCMSPage(options)).data

  if (!pages[0]) {
    throw new MissingContentError(options)
  }

  return findBestPDPTemplate(pages, product)
}
