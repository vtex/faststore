import type { Story, Meta } from '@storybook/react'
import React from 'react'

import BannerComponent from '../Banner'
import BannerImage from '../BannerImage'
import BannerContent from '../BannerContent'
import BannerTitle from '../BannerTitle'
import type { BannerProps } from '../Banner'
import mdx from './Banner.mdx'

const BannerTemplate: Story<BannerProps> = ({ testId }) => (
  <BannerComponent testId={testId}>
    <BannerImage
      alt=""
      width="100%"
      height={312}
      src="https://storecomponents.vtex.app/assets/fit-in/1280x613/center/middle/https%3A%2F%2Fstorecomponents.vtexassets.com%2Fassets%2Fvtex.file-manager-graphql%2Fimages%2F331632a0-fa52-4f08-8e45-df762d97a289___167e4c8385c3129b1a2ddab9156510ba.jpg"
    />
    <BannerContent>
      <BannerTitle>
        <p>Get yo know our next release</p>
      </BannerTitle>
      {/* <BannerDescription>
        Lorem ipsum dolor sit amet, consectetur adipiscing elit.{' '}
      </BannerDescription>
      <BannerCTAButton>
        <button>Shop now</button>
      </BannerCTAButton> */}
    </BannerContent>
  </BannerComponent>
)

export const Banner = BannerTemplate.bind({})
Banner.storyName = 'Banner'

export default {
  title: 'Molecules/Banner',
  parameters: {
    docs: {
      page: mdx,
    },
  },
} as Meta
