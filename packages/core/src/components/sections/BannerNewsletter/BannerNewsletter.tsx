import {
  Banner as UIBanner,
  BannerContent as UIBannerContent,
} from '@faststore/ui'
import Newsletter from '../Newsletter'
import Section from '../Section'
import styles from './section.module.scss'

function BannerNewsletter() {
  return (
    <Section
      className={`${styles.section} section-banner-newsletter layout__content`}
    >
      <div data-fs-banner-newsletter>
        <UIBanner variant="secondary" colorVariant="light">
          <UIBannerContent
            title="Get to Know Our Next Release"
            caption="Lorem ipsum dolor sit amet, consectetur adipiscing elit. Etiam elit nisi, vehicula in turpis sit amet, posuere aliquam nisl. "
            link="/"
            linkText="Shop Now"
          />
        </UIBanner>

        <Newsletter
          title="Get News and Special Offers!"
          description="Receive our news and promotions in advance. Enjoy and get 10% off your first purchase. For more information click here."
          icon="Envelop"
          iconAlt="Envelop"
          privacyPolicy="By subscribing to our newsletter you agree to to our"
          emailInputLabel="Your email"
          displayNameInput
          nameInputLabel="Your name"
          subscribeButtonLabel="Subscribe"
          card
        />
      </div>
    </Section>
  )
}

export default BannerNewsletter
