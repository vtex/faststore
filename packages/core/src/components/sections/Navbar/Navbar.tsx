import Section from '../Section'

import styles from './section.module.scss'

import Navbar from 'src/components/navigation/Navbar'

type PageLinks = {
  url: string
  text: string
}

export interface NavbarProps {
  logo: {
    alt: string
    src: string
    link: {
      url: string
      title: string
    }
  }
  searchInput: {
    sort: string
  }
  signInButton: {
    icon: {
      alt: string
      icon: string
    }
    label: string
    myAccountLabel: string
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
    menu: {
      icon: {
        alt: string
        icon: string
      }
    }
    home: {
      label: string
    }
  }
}

function NavbarSection({
  logo,
  searchInput,
  cartIcon,
  signInButton,
  navigation: {
    menu,
    home,
    pageLinks,
    regionalization: {
      label: regionLabel,
      icon: { icon: regionIcon },
      enabled: shouldDisplayRegion,
    },
  },
}: NavbarProps) {
  return (
    <Section className={`${styles.section} section-navbar`}>
      <Navbar
        home={home}
        menu={menu}
        logo={logo}
        searchInput={searchInput}
        cart={cartIcon}
        links={pageLinks}
        signIn={{ button: signInButton }}
        region={{
          icon: regionIcon,
          label: regionLabel,
          shouldDisplayRegion,
        }}
      />
    </Section>
  )
}

export default NavbarSection
