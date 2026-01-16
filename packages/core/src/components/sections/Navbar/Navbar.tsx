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
    submitButtonAriaLabel?: string
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
    loadingLabel?: string
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
    i18nButton: {
      shouldDisplayI18nButton: boolean
      icon: {
        icon: string
      }
    }
    i18nSelector: {
      title?: string
      languageLabel?: string
      currencyLabel?: string
      description?: string
      saveLabel?: string
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

/**
 * Render the page's navbar section using the provided configuration.
 *
 * @param props - NavbarProps containing layout and behavior for the Navbar. The nested
 * `navigation.i18nSelector` fields (`title`, `languageLabel`, `currencyLabel`, `description`, `saveLabel`)
 * are optional and, when present, are passed through to the underlying Navbar's i18n selector.
 * @returns A Section element containing a configured Navbar component.
 */
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
    i18nButton: {
      icon: { icon: i18nIcon },
      shouldDisplayI18nButton,
    },
    i18nSelector: {
      title: i18nTitle,
      languageLabel: i18nLanguageLabel,
      currencyLabel: i18nCurrencyLabel,
      description: i18nDescription,
      saveLabel: i18nSaveLabel,
    } = {},
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
        i18nButton={{
          icon: i18nIcon,
          shouldDisplayI18nButton,
        }}
        i18nSelector={{
          title: i18nTitle,
          languageLabel: i18nLanguageLabel,
          currencyLabel: i18nCurrencyLabel,
          description: i18nDescription,
          saveLabel: i18nSaveLabel,
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