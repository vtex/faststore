import { PaymentMethods as UIPaymentMethods } from '@faststore/ui'
import type { PaymentMethodsProps as UIPaymentMethodProps } from '@faststore/ui'

import UIFooter, {
  FooterLinks,
  FooterSocial,
  FooterInfo as UIFooterInfo,
  FooterNavigation as UIFooterNavigation,
} from '../../common/Footer'
import type { FooterLinksProps, FooterSocialProps } from '../../common/Footer'

import Logo from 'src/components/ui/Logo'
import UIIncentives from '../../ui/Incentives'
import type { Incentive } from '../../ui/Incentives'

import styles from './section.module.scss'

export type FooterProps = {
  incentives: Incentive[]
  footerLinks: FooterLinksProps['links']
  footerSocial: {
    title?: FooterSocialProps['title']
    socialLinks: FooterSocialProps['links']
  }
  logo: {
    src: string
    alt: string
  }
  copyrightInfo: string
  acceptedPaymentMethods: {
    showPaymentMethods: boolean
    title?: string
    paymentMethods?: UIPaymentMethodProps['flagList']
  }
}

const Footer = ({
  incentives,
  footerLinks,
  footerSocial,
  footerSocial: { title: footerSocialTitle },
  logo: { src: logoSrc, alt: logoAlt },
  copyrightInfo,
  acceptedPaymentMethods: {
    showPaymentMethods,
    title: acceptedPaymentMethodsTitle,
    paymentMethods,
  },
}: FooterProps) => {
  return (
    <footer className={`section ${styles.section} section-footer`}>
      <UIFooter>
        <UIIncentives incentives={incentives} />
        <UIFooterNavigation>
          <FooterLinks links={footerLinks} />
          <FooterSocial
            title={footerSocialTitle}
            links={footerSocial.socialLinks}
          />
        </UIFooterNavigation>
        <UIFooterInfo>
          <Logo alt={logoAlt} src={logoSrc} />
          {showPaymentMethods && (
            <UIPaymentMethods
              flagList={paymentMethods}
              title={<p>{acceptedPaymentMethodsTitle}</p>}
            />
          )}
          <div data-fs-footer-copyright className="text__legend">
            <p>{copyrightInfo}</p>
          </div>
        </UIFooterInfo>
      </UIFooter>
    </footer>
  )
}

export default Footer
