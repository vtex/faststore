export function FooterInfo({ children }) {
  return (
    <div data-fs-footer-info className="layout__content">
      {children}
    </div>
  )
}

export function FooterNavigation({ children }) {
  return (
    <div data-fs-footer-navigation className="layout__content">
      {children}
    </div>
  )
}

export function Footer({ children }) {
  return (
    <div
      data-fs-footer
      data-fs-footer-social
      data-fs-footer-incentives
      data-fs-footer-payment-methods
      className="layout__content-full"
    >
      {children}
    </div>
  )
}

export default Footer
