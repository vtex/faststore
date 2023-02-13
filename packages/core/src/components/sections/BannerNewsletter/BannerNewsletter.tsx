import BannerText from '../BannerText'
import Newsletter from '../Newsletter'
import Section from '../Section'
import styles from './banner-newsletter.module.scss'

function BannerNewsletter() {
  return (
    <Section className="layout__content">
      <div className={styles.fsBannerNewsletter}>
        <BannerText
          title="Get to Know Our Next Release"
          caption="Lorem ipsum dolor sit amet, consectetur adipiscing elit. Etiam elit nisi, vehicula in turpis sit amet, posuere aliquam nisl. "
          actionLabel="Shop Now"
          actionPath="/"
          variant="secondary"
          colorVariant="light"
        />
        <Newsletter
          title="Get News and Special Offers!"
          description="Receive our news and promotions in advance. Enjoy and get 10% off your first purchase. For more information click here."
          card
        />
      </div>
    </Section>
  )
}

export default BannerNewsletter
