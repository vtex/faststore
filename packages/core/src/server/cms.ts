import ClientCMS from '@vtex/client-cms'
import type { Locator } from '@vtex/client-cms'

import config from '../../store.config'

export const clientCMS = new ClientCMS({
  workspace: config.api.workspace,
  tenant: config.api.storeId,
})

type Options = Locator | string

export const getPageSections = async (options: Options) => {
  const page =
    typeof options !== 'string'
      ? await clientCMS.getCMSPage(options)
      : await clientCMS
          .getCMSPagesByContentType(options)
          .then((pages) => pages.data[0])

  return page.sections
}
