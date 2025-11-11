import { getOverridableSection } from '../../../sdk/overrides/getOverriddenSection'
import Section from '../Section'

import styles from './section.module.scss'

import Navbar from '../../../components/navigation/Navbar'
import { NavbarDefaultComponents } from './DefaultComponents'

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
    placeholder?: string
    sort: string
    quickOrderSettings?: {
      quickOrder: boolean
      invalidQuantityToastLabels?: {
        title?: string
        message?: string
      }
      skuMatrix: {
        triggerButtonLabel: string
        columns: {
          name: string
          additionalColumns: Array<{ label: string; value: string }>
          price: string
          quantitySelector: string
          availability: {
            label: string
            stockDisplaySettings: 'showAvailability' | 'showStockQuantity'
          }
        }
      }
    }
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

NavbarSection.$componentKey = 'Navbar'

const OverridableNavbar = getOverridableSection<typeof NavbarSection>(
  'Navbar',
  NavbarSection,
  NavbarDefaultComponents
)

export default OverridableNavbar
