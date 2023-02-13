import {
  List as UIList,
  PaymentMethods as UIPaymentMethods,
} from '@faststore/ui'

import Logo from 'src/components/ui/Logo'
import IncentivesFooter from 'src/components/sections/Incentives/IncentivesFooter'
import Icon from 'src/components/ui/Icon'
import Link from 'src/components/ui/Link'
import { mark } from 'src/sdk/tests/mark'

import styles from './footer.module.scss'
import FooterLinks from './FooterLinks'
import FooterFlags from './FooterFlags'

type FooterProps = {
  /**
   * Enables Incentives Section
   */
  sectionIncentives?: boolean
  /**
   * Enables Social Section
   */
  sectionSocial?: boolean
  /**
   * Enables Payment Methods Section
   */
  sectionPaymentMethods?: boolean
}

export function Footer({
  sectionIncentives = true,
  sectionSocial = true,
  sectionPaymentMethods = true,
}: FooterProps) {
  return (
    <footer
      data-fs-footer
      data-fs-footer-incentives={sectionIncentives}
      data-fs-footer-social={sectionSocial}
      data-fs-footer-payment-methods={sectionPaymentMethods}
      className={`${styles.fsFooter} layout__content-full`}
    >
      {sectionIncentives && <IncentivesFooter />}

      <div data-fs-footer-nav className="layout__content">
        <FooterLinks />

        {sectionSocial && (
          <section data-fs-footer-social>
            <p data-fs-footer-title>Follow us</p>
            <UIList>
              <li>
                <Link
                  variant="display"
                  size="small"
                  href="https://www.facebook.com/"
                  title="Facebook"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <Icon width="24px" height="24px" name="Facebook" />
                </Link>
              </li>
              <li>
                <Link
                  variant="display"
                  size="small"
                  href="https://www.instagram.com/"
                  title="Instagram"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <Icon width="24px" height="24px" name="Instagram" />
                </Link>
              </li>
              <li>
                <Link
                  variant="display"
                  size="small"
                  href="https://www.pinterest.com/"
                  title="Pinterest"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <Icon width="24px" height="24px" name="Pinterest" />
                </Link>
              </li>
              <li>
                <Link
                  variant="display"
                  size="small"
                  href="https://twitter.com/"
                  title="Twitter"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <Icon width="24px" height="24px" name="Twitter" />
                </Link>
              </li>
            </UIList>
          </section>
        )}
      </div>

      <div data-fs-footer-note className="layout__content">
        <Logo />

        {sectionPaymentMethods && (
          <UIPaymentMethods
            title={<p>Payment Methods</p>}
            flagList={FooterFlags}
          />
        )}

        <div data-fs-footer-copyright className="text__legend">
          <p>This website uses VTEX technology</p>
          <p>
            In-store price may vary. Prices and offers are subject to change.
            2021 Store name. All rights reserved. Store is a trademark of Store
            and its affiliated companies.
          </p>
          <address>Mount St, 000, New York / NY - 00000.</address>
        </div>
      </div>
    </footer>
  )
}

Footer.displayName = 'Footer'
export default mark(Footer)
