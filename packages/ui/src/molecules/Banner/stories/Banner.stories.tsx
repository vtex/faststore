import type { Story, Meta } from '@storybook/react'
import React from 'react'

import BannerComponent from '../Banner'
import BannerImage from '../BannerImage'
import BannerContent from '../BannerContent'
import BannerTitle from '../BannerTitle'
import BannerDescription from '../BannerDescription'
import type { BannerProps } from '../Banner'
import mdx from './Banner.mdx'
import Button from '../../../atoms/Button'

const BannerTemplate: Story<BannerProps> = ({ testId, variant }) => (
  <BannerComponent testId={testId} variant={variant}>
    <BannerImage
      alt=""
      width="100%"
      height="100%"
      src="https://storecomponents.vtex.app/assets/fit-in/1280x613/center/middle/https%3A%2F%2Fstorecomponents.vtexassets.com%2Fassets%2Fvtex.file-manager-graphql%2Fimages%2F331632a0-fa52-4f08-8e45-df762d97a289___167e4c8385c3129b1a2ddab9156510ba.jpg"
    />
    <BannerContent>
      <BannerTitle>
        <h3>Get yo know our next release</h3>
      </BannerTitle>
      <BannerDescription>
        <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit.</p>
      </BannerDescription>
      {/* <BannerCTAButton>
        <button>Shop now</button>
      </BannerCTAButton> */}
      <div>
        <Button>Shop now</Button>
      </div>
    </BannerContent>
  </BannerComponent>
)

export const Banner = BannerTemplate.bind({})
Banner.storyName = 'Banner'

const argTypes = {
  variant: {
    options: ['vertical', 'horizontal'],
    control: { type: 'select' },
  },
}

export default {
  title: 'Molecules/Banner',
  argTypes,
  parameters: {
    docs: {
      page: mdx,
    },
  },
} as Meta
