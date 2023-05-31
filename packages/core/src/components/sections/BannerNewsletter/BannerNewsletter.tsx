import BannerText from 'src/components/ui/BannerText'
import type { BannerTextProps } from 'src/components/sections/BannerText'
import Newsletter, { NewsletterProps } from 'src/components/ui/Newsletter'
import Section from '../Section'
import styles from './section.module.scss'

function BannerNewsletter({
  banner,
  newsletter,
}: {
  banner: BannerTextProps
  newsletter: NewsletterProps
}) {
  return (
    <Section
      className={`${styles.section} section-banner-newsletter layout__content`}
    >
      <div data-fs-banner-newsletter>
        <BannerText
          title={banner.title}
          caption={banner.caption}
          actionLabel={banner.link.text}
          actionPath={banner.link.url}
          variant={banner.variant}
          colorVariant={banner.colorVariant}
        />
        <Newsletter
          title={newsletter.title}
          description={newsletter.description}
          icon={newsletter.icon}
          privacyPolicy={newsletter.privacyPolicy}
          emailInputLabel={newsletter.emailInputLabel}
          displayNameInput={newsletter.displayNameInput}
          nameInputLabel={newsletter.nameInputLabel}
          subscribeButtonLabel={newsletter.subscribeButtonLabel}
          toastSubscribe={newsletter.toastSubscribe}
          toastSubscribeError={newsletter.toastSubscribeError}
          card={newsletter.card}
        />
      </div>
    </Section>
  )
}

export default BannerNewsletter
