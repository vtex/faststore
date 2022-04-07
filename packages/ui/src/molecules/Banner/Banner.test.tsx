import { render } from '@testing-library/react'
import { axe } from 'jest-axe'
import React from 'react'

import Banner from './Banner'
import BannerImage from './BannerImage'
import BannerContent from './BannerContent'
import BannerLink from './BannerLink'

const BannerTest = () => {
  return (
    <Banner data-custom-attribute>
      <BannerImage>
        <img
          alt="A person with hands on the pocket, carrying a round straw bag"
          src="https://storecomponents.vtex.app/assets/fit-in/1280x613/center/middle/https%3A%2F%2Fstorecomponents.vtexassets.com%2Fassets%2Fvtex.file-manager-graphql%2Fimages%2Fedce348c-068c-4fb9-91f2-7d235d596e0f___b2822f893b14f87337d08f07f0e520ab.jpg"
        />
      </BannerImage>
      <BannerContent>
        <div>
          <h3>Get yo know our next release</h3>
          <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit.</p>
        </div>
        <BannerLink>Shop now</BannerLink>
      </BannerContent>
    </Banner>
  )
}

describe('Banner', () => {
  describe('Data attributes', () => {
    const { getByTestId } = render(<BannerTest />)

    const banner = getByTestId('store-banner')
    const bannerImage = getByTestId('store-banner-image')
    const bannerContent = getByTestId('store-banner-content')
    const bannerLink = getByTestId('store-banner-link')

    it('`Banner` component should have `data-store-banner` attribute', () => {
      expect(banner).toHaveAttribute('data-store-banner')
    })

    it('`Banner` component should have custom data attribute `data-custom-attribute`', () => {
      expect(banner).toHaveAttribute('data-custom-attribute')
    })

    it('`BannerImage` component should have `data-banner-image` attribute', () => {
      expect(bannerImage).toHaveAttribute('data-banner-image')
    })

    it('`BannerContent` component should have `data-banner-content` attribute', () => {
      expect(bannerContent).toHaveAttribute('data-banner-content')
    })

    it('`BannerLink` component should have `data-banner-link` attribute', () => {
      expect(bannerLink).toHaveAttribute('data-banner-link')
    })
  })

  describe('Accessibility', () => {
    it('should have no violations', async () => {
      const { getByTestId } = render(<BannerTest />)

      expect(await axe(getByTestId('store-banner'))).toHaveNoViolations()
    })
  })
})
