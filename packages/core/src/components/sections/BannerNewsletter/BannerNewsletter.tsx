'use client'

import { OverriddenDefaultBannerText as BannerText } from 'src/components/sections/BannerText/OverriddenDefaultBannerText'
import type { BannerTextProps } from 'src/components/sections/BannerText'

import { OverriddenDefaultNewsletter as Newsletter } from 'src/components/sections/Newsletter/OverriddenDefaultNewsletter'
import type { NewsletterProps } from 'src/components/sections/Newsletter'

import Section from '../Section'
import styles from './section.module.scss'

function BannerNewsletter({
  banner,
  newsletter,
}: {
  banner: BannerTextProps
  newsletter: Omit<NewsletterProps, 'card'>
}) {
  return (
    <Section className={`${styles.section} section-banner-newsletter`}>
      <div data-fs-banner-text-newsletter data-fs-content="banner-newsletter">
        <BannerText
          title={banner.title}
          caption={banner.caption}
          link={banner?.link}
          variant={banner.variant}
          colorVariant={banner.colorVariant}
        />
        <Newsletter
          card
          colorVariant={newsletter.colorVariant}
          title={newsletter.title}
          description={newsletter.description}
          icon={newsletter.icon}
          privacyPolicy={newsletter.privacyPolicy}
          emailInputLabel={newsletter.emailInputLabel}
          displayNameInput={newsletter.displayNameInput}
          nameInputLabel={newsletter.nameInputLabel}
          subscribeButtonLabel={newsletter.subscribeButtonLabel}
          subscribeButtonLoadingLabel={newsletter.subscribeButtonLoadingLabel}
          toastSubscribe={newsletter.toastSubscribe}
          toastSubscribeError={newsletter.toastSubscribeError}
        />
      </div>
    </Section>
  )
}

export default BannerNewsletter
