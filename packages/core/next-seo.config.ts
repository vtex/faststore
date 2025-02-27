import type { DefaultSeoProps } from 'next-seo'
import storeConfig from './discovery.config'

const buildTime = new Date().toISOString()

const config: DefaultSeoProps = {
  norobots: storeConfig.experimental.noRobots,
  additionalMetaTags: [
    {
      name: 'generated-at',
      content: buildTime,
    },
  ],
}

export default config
