import type { DefaultSeoProps } from 'next-seo'
import storeConfig from './discovery.config'

const buildTime = new Date().toISOString()
const buildTimeInMS = Date.now()

const config: DefaultSeoProps = {
  norobots: storeConfig.experimental.noRobots,
  dangerouslySetAllPagesToNoFollow: storeConfig.experimental.nofollow,
  dangerouslySetAllPagesToNoIndex: storeConfig.experimental.noindex,
  additionalMetaTags: [
    {
      name: 'generated-at',
      content: buildTime,
    },
  ],
}

export default config

export const generatedBuildTime = buildTimeInMS
