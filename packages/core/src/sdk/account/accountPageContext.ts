import type {
  ServerListOrdersQueryQuery,
  ServerOrderDetailsQueryQuery,
  ServerProfileQueryQuery,
} from '@generated/graphql'
import type { PageGlobalContext } from 'src/sdk/overrides/PageProvider'
import { usePage } from 'src/sdk/overrides/PageProvider'
import type { OrderStatusCmsLabels } from 'src/utils/userOrderStatus'
import type { AccountNavigationLabels } from './getMyAccountRoutes'

export type AccountProfilePageData = {
  profile: ServerProfileQueryQuery['accountProfile']
}

export type AccountOrdersListPageData = {
  listOrders: ServerListOrdersQueryQuery['listUserOrders']
  total: number
  perPage: number
  filters: {
    page: number
    status: string[]
    dateInitial: string
    dateFinal: string
    text: string
    clientEmail: string
    pendingMyApproval?: boolean
  }
}

export type AccountOrderDetailsPageData = {
  order: ServerOrderDetailsQueryQuery['userOrder']
  orderStatusLabels?: OrderStatusCmsLabels
}

export type AccountSecurityPageData = {
  userEmail: string
}

export type AccountUserDetailsPageData = {
  userDetails: {
    username: string
    name: string
    email: string
    phone: string
    role: string[]
    orgUnit: string
  }
}

export type AccountPageData =
  | AccountProfilePageData
  | AccountOrdersListPageData
  | AccountOrderDetailsPageData
  | AccountSecurityPageData
  | AccountUserDetailsPageData
  | Record<string, never>

export interface AccountPageContext extends PageGlobalContext {
  accountPageData: AccountPageData
  navigationLabels?: AccountNavigationLabels
}

export function useAccountNavigationLabels() {
  const ctx = usePage<AccountPageContext>()
  return ctx.navigationLabels
}

export function useAccountPageData<
  T extends AccountPageData = AccountPageData,
>(): T {
  const ctx = usePage<AccountPageContext>()
  return ctx.accountPageData as T
}
