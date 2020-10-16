export interface Session {
  id: string
  namespaces: Namespaces
}

export interface Namespaces {
  account?: NamespacesAccount
  store?: Store
  public: Record<string, unknown>
  creditControl?: CreditControl
  authentication?: Authentication
  profile?: Profile
}

export interface NamespacesAccount {
  id: ID
  accountName: AccountName
}

export interface AccountName {
  value: string
}

export interface ID {
  value: string
  keepAlive: boolean
}

export interface Authentication {
  storeUserID: AccountName
  storeUserEmail: AccountName
}

export interface CreditControl {
  creditAccounts: CreditAccounts
  deadlines: Deadlines
  minimumInstallmentValue: MinimumInstallmentValue
}

export interface CreditAccounts {
  value: CreditAccountsValue
}

export interface CreditAccountsValue {
  accounts: AccountElement[]
}

export interface AccountElement {
  id: string
  availableCredit: number
}

export interface Deadlines {
  value: DeadlinesValue
}

export interface DeadlinesValue {
  deadlines: Deadline[]
}

export interface Deadline {
  paymentOptions: number[]
}

export interface MinimumInstallmentValue {
  value: number
}

export interface Profile {
  id?: AccountName
  email?: AccountName
  firstName?: AccountName
  lastName?: AccountName
  phone?: AccountName
  document?: AccountName
  isAuthenticated?: AccountName
}

export interface Store {
  channel: AccountName
  countryCode: AccountName
  cultureInfo: AccountName
  currencyCode: AccountName
  currencySymbol: AccountName
  adminCultureInfo: AccountName
}
