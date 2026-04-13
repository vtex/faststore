import { LocaleSelector } from '../../i18n/LocaleSelector'

interface MyAccountHeaderProps {
  pageTitle: string
}

function MyAccountHeader({ pageTitle }: MyAccountHeaderProps) {
  return (
    <header data-fs-account-header>
      <h1 data-fs-account-header-title>{pageTitle}</h1>
      <LocaleSelector />
    </header>
  )
}

export default MyAccountHeader
