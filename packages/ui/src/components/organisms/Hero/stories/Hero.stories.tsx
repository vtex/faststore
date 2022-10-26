import type { Story, Meta } from '@storybook/react'
import React from 'react'

import HeroComponent from '../Hero'
import HeroImage from '../HeroImage'
import HeroHeading from '../HeroHeading'
import type { HeroProps } from '../Hero'
import { Icon } from '../../../../'
import mdx from './Hero.mdx'

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

const HeroTemplate: Story<HeroProps> = ({ testId }) => (
  <HeroComponent testId={testId}>
    <HeroImage>
      <img
        alt="Quest 2 Controller on a table"
        src="https://storeframework.vtexassets.com/arquivos/ids/190897/Photo.jpg"
      />
    </HeroImage>
    <HeroHeading>
      <h1>New Products Available</h1>
      <p>
        At BaseStore you can shop the best tech of 2022. Enjoy and get 10% off
        on your first purchase.
      </p>
      <a href="/">
        See all <Icon component={<RightArrow />} />
      </a>
    </HeroHeading>
  </HeroComponent>
)

export const Hero = HeroTemplate.bind({})
Hero.storyName = 'Hero'

export default {
  title: 'Organisms/Hero',
  parameters: {
    docs: {
      page: mdx,
    },
  },
} as Meta
