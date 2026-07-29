import type { Locator } from '@vtex/client-cms'
import type { PageContentType } from 'src/server/cms'
import { contentService } from 'src/server/content/service'
import {
  type MyAccountContentType,
  withDefaultMyAccountSections,
} from './myAccountDefaultSections'

type FetchMyAccountPageContentContext = {
  previewData?: Locator
  locale?: string
}

export async function fetchMyAccountPageContent(
  contentType: MyAccountContentType,
  context: FetchMyAccountPageContentContext,
  pagePath: string
) {
  const pageContent = await contentService
    .getSingleContent<PageContentType>({
      contentType,
      previewData: context.previewData,
      locale: context.locale,
    })
    .catch((err) => {
      console.warn('[MyAccount CMS fallback]', {
        contentType,
        locale: context.locale,
        fallbackReason: err instanceof Error ? err.message : String(err),
        page: pagePath,
      })

      return { sections: [], settings: {} } as PageContentType
    })
    // getSingleContent resolves to `undefined` (rather than rejecting) when
    // no CMS entry exists yet for this contentType — e.g. a newly introduced
    // My Account page before any content has been authored for it. Fall back
    // the same way the `.catch()` above does, instead of letting `undefined`
    // reach `pageContent.sections` below.
    .then(
      (content) =>
        content ?? ({ sections: [], settings: {} } as PageContentType)
    )

  const sections = withDefaultMyAccountSections(
    contentType,
    pageContent.sections
  )

  return {
    ...pageContent,
    sections,
  }
}
