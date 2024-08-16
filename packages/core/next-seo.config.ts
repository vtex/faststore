import { DefaultSeoProps } from 'next-seo'

const buildTime = new Date().toISOString()

const config: DefaultSeoProps = {
  additionalMetaTags: [
    {
      name: 'data-generated-at',
      content: buildTime,
    },
  ],
}

export default config
