import { Locator, Section } from '@vtex/client-cms'
import { PageContentType, getPage } from 'src/server/cms'
import { GetStaticPropsContext } from 'next'

type GetLayoutProps = {
  context: GetStaticPropsContext<Record<string, string>, Locator>
}

export type LayoutData = {
  alert: Section['data']
}

export const getLayout = async ({
  context,
}: GetLayoutProps): Promise<LayoutData> => {
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
