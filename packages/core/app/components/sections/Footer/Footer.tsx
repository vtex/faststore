'use client'

import { PaymentMethods as UIPaymentMethods } from '@faststore/ui'
import type { PaymentMethodsProps as UIPaymentMethodProps } from '@faststore/ui'

import Section from '../../../../src/components/sections/Section'
import UIFooter, {
  FooterLinks,
  FooterSocial,
  FooterInfo as UIFooterInfo,
  FooterNavigation as UIFooterNavigation,
} from '../../common/Footer'
import type { FooterLinksProps, FooterSocialProps } from '../../common/Footer'

import Logo from 'app/components/ui/Logo'
import Link from 'app/components/ui/Link'
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
    link: {
      url: string
      title: string
    }
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
  logo: { src: logoSrc, alt: logoAlt, link: logoLink },
  copyrightInfo,
  acceptedPaymentMethods: {
    showPaymentMethods,
    title: acceptedPaymentMethodsTitle,
    paymentMethods,
  },
}: FooterProps) => {
  const homeLabel = 'Go to Home'
  return (
    <Section
      className={`section ${styles.section} section-footer layout__section`}
    >
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
          <Link
            href={logoLink ? logoLink.url : '/'}
            title={logoLink ? logoLink.title : homeLabel}
          >
            <Logo alt={logoAlt} src={logoSrc} />
          </Link>

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
    </Section>
  )
}

export default Footer
