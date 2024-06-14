import { mark } from 'src/sdk/tests/mark'

export function FooterInfo({ children }) {
  return <div data-fs-footer-info>{children}</div>
}

export function FooterNavigation({ children }) {
  return <div data-fs-footer-navigation>{children}</div>
}

export function Footer({ children }) {
  return (
    <footer
      data-fs-footer
      data-fs-footer-social
      data-fs-footer-incentives
      data-fs-footer-payment-methods
    >
      <div data-fs-content="footer">{children}</div>
    </footer>
  )
}

Footer.displayName = 'Footer'
export default mark(Footer)
