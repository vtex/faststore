import type { DefaultSeoProps } from 'next-seo'
import storeConfig from './discovery.config'

const buildTime = new Date().toISOString()

const config: DefaultSeoProps = {
  noindex:
    storeConfig.experimental.noRobots || storeConfig.experimental.noindex,
  nofollow:
    storeConfig.experimental.noRobots || storeConfig.experimental.nofollow,
  additionalMetaTags: [
    {
      name: 'generated-at',
      content: buildTime,
    },
  ],
}

export default config
