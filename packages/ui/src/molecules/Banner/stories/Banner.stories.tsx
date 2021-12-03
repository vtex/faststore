import type { Story, Meta } from '@storybook/react'
import React from 'react'

import BannerComponent from '../Banner'
import BannerImage from '../BannerImage'
import BannerContent from '../BannerContent'
import BannerLink from '../BannerLink'
import type { BannerProps } from '../Banner'
import { Icon } from '../../..'
import mdx from './Banner.mdx'

const RightArrow = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="18"
    height="18"
    viewBox="0 0 18 18"
  >
    <path
      d="M10.6553 3.40717C10.3624 3.11428 9.88756 3.11428 9.59467 3.40717C9.30178 3.70006 9.30178 4.17494 9.59467 4.46783L13.3768 8.25H2.8125C2.39829 8.25 2.0625 8.58579 2.0625 9C2.0625 9.41421 2.39829 9.75 2.8125 9.75H13.3768L9.59467 13.5322C9.30178 13.8251 9.30178 14.2999 9.59467 14.5928C9.88756 14.8857 10.3624 14.8857 10.6553 14.5928L15.7178 9.53033C15.8643 9.38388 15.9375 9.19194 15.9375 9C15.9375 8.89831 15.9173 8.80134 15.8806 8.71291C15.844 8.62445 15.7897 8.54158 15.7178 8.46967L10.6553 3.40717Z"
      fill="currentColor"
    />
  </svg>
)

const BannerTemplate: Story<BannerProps> = ({ testId, variant }) => (
  <BannerComponent testId={testId} variant={variant}>
    <BannerImage>
      <img
        alt="A person with hands on the pocket, carrying a round straw bag"
        src="https://storecomponents.vtex.app/assets/fit-in/1280x613/center/middle/https%3A%2F%2Fstorecomponents.vtexassets.com%2Fassets%2Fvtex.file-manager-graphql%2Fimages%2Fedce348c-068c-4fb9-91f2-7d235d596e0f___b2822f893b14f87337d08f07f0e520ab.jpg"
      />
    </BannerImage>
    <BannerContent>
      <div>
        <h3>Get to know our new release</h3>
        <p>Your one-stop shop for making this summer season the best of all.</p>
      </div>
      <BannerLink>
        <a href="/">
          Shop now <Icon component={<RightArrow />} />
        </a>
      </BannerLink>
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
