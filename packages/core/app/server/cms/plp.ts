import { ContentData, Locator } from '@vtex/client-cms'
import MissingContentError from 'src/sdk/error/MissingContentError'
import {
  Rewrite,
  RewritesConfig,
  findBestPLPTemplate,
} from 'src/utils/multipleTemplates'
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

export const getPLP = async (
  slug: string,
  previewData: Locator,
  rewrites: Rewrite[] | RewritesConfig
) => {
  if (config.cms.data) {
    const cmsData = JSON.parse(config.cms.data)
    const allPLPsFromCmsEnvData: PLPfromCmsEnvData[] = cmsData['plp']

    return await getPLPFromCmsEnvData(
      `/${slug}/`,
      allPLPsFromCmsEnvData,
      {
        ...(previewData?.contentType === 'plp' ? previewData : null),
        contentType: 'plp',
      },
      rewrites
    )
  }

  return (await getPLPFromCms(
    `/${slug}/`,
    {
      ...(previewData?.contentType === 'plp' ? previewData : null),
      contentType: 'plp',
    },
    rewrites
  )) as PLPContentType
}

const getPLPFromCmsEnvData = async (
  slug: string,
  allPLPsFromCMSData: PLPfromCmsEnvData[],
  options: Options,
  rewrites: Rewrite[] | RewritesConfig
): Promise<PLPContentType> => {
  const pages: PLPfromCmsEnvData[] = allPLPsFromCMSData ?? []

  if (!pages[0]) {
    throw new MissingContentError(options)
  }

  const template = findBestPLPTemplate(pages, slug, rewrites)

  return getPage<PLPContentType>({
    contentType: 'plp',
    documentId: template.documentId as string,
    versionId: template.versionId,
  })
}

export const getPLPFromCms = async (
  slug: string,
  options: Options,
  rewrites: Rewrite[] | RewritesConfig
): Promise<Partial<PLPContentType>> => {
  const pages = (await getCMSPage(options)).data

  if (!pages[0]) {
    throw new MissingContentError(options)
  }

  return findBestPLPTemplate(pages, slug, rewrites)
}
