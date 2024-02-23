import { ContentData, Locator } from '@vtex/client-cms'
import MissingContentError from 'src/sdk/error/MissingContentError'
import { findBestPLPTemplate } from 'src/utils/utilities'
import config from '../../../faststore.config'
import { Options, getCMSPage, getPage } from '../cms'

type PLPSettings = {
  settings: {
    template?: {
      value?: string
    }
    productGallery: {
      itemsPerPage: number
      sortBySelection: string
    }
  }
}

type PLPfromCmsEnvData = {
  documentId: string
  versionId: string
} & PLPSettings

export type PLPContentType = ContentData & PLPSettings

export const getPLP = async (slug: string, previewData: Locator) => {
  if (config.cms.data) {
    const cmsData = JSON.parse(config.cms.data)
    const allPLPsFromCmsEnvData: PLPfromCmsEnvData[] = cmsData['plp']

    return await getPLPFromCmsEnvData(`/${slug}/p`, allPLPsFromCmsEnvData, {
      ...(previewData?.contentType === 'plp' ? previewData : null),
      contentType: 'plp',
    })
  }

  return (await getPLPFromCms(`/${slug}/p`, {
    ...(previewData?.contentType === 'plp' ? previewData : null),
    contentType: 'plp',
  })) as PLPContentType
}

const getPLPFromCmsEnvData = async (
  slug: string,
  allPLPsFromCMSData: PLPfromCmsEnvData[],
  options: Options
): Promise<PLPContentType> => {
  const pages: PLPfromCmsEnvData[] = allPLPsFromCMSData ?? []

  if (!pages[0]) {
    throw new MissingContentError(options)
  }

  const template = findBestPLPTemplate(pages, slug)

  return getPage<PLPContentType>({
    contentType: 'plp',
    documentId: template.documentId as string,
    versionId: template.versionId,
  })
}

export const getPLPFromCms = async (
  slug: string,
  options: Options
): Promise<Partial<PLPContentType>> => {
  const pages = (await getCMSPage(options)).data

  if (!pages[0]) {
    throw new MissingContentError(options)
  }

  return findBestPLPTemplate(pages, slug)
}
