interface HeaderProps {
  pageTitle: string
}

function Header({ pageTitle }: HeaderProps) {
  return (
    <header data-fs-account-header>
      <h1 data-fs-account-header-title>{pageTitle}</h1>
    </header>
  )
}

export default Header
