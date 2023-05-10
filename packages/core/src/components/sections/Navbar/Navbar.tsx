import UINavbar from '../../navigation/Navbar'

import Section from '../Section'

import styles from './section.module.scss'

type PageLinks = {
  url: string
  text: string
}

export interface NavbarProps {
  logo: {
    src: string
    alt: string
  }
  signInButton: {
    icon: {
      alt: string
      icon: string
    }
    label: string
  }
  cartIcon: {
    alt: string
    icon: string
  }
  navigation: {
    regionalization: {
      enabled: boolean
      icon: {
        alt: string
        icon: string
      }
      label: string
    }
    pageLinks: PageLinks[]
  }
}

function Navbar({
  logo: { src: logoSrc },
  signInButton: {
    label: signInButtonLabel,
    icon: { icon: signInButtonIcon },
  },
  cartIcon: { icon: cartIcon },
  navigation: {
    regionalization: {
      enabled: shouldDisplayRegion,
      icon: { icon: regionIcon },
      label: regionLabel,
    },
    pageLinks,
  },
}: NavbarProps) {
  return (
    <Section className={`${styles.section} section-navbar`}>
      <UINavbar
        links={pageLinks}
        logo={{ src: logoSrc }}
        cart={{ icon: cartIcon }}
        signIn={{
          button: { icon: signInButtonIcon, label: signInButtonLabel },
        }}
        region={{
          icon: regionIcon,
          label: regionLabel,
          shouldDisplayRegion,
        }}
      />
    </Section>
  )
}

export default Navbar
