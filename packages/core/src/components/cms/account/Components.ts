import type { ComponentType } from 'react'

import AccountNavigation from 'src/components/sections/Account/AccountNavigation'
import AccountOrderBudgets from 'src/components/sections/Account/AccountOrderBudgets'
import AccountOrderDelivery from 'src/components/sections/Account/AccountOrderDelivery'
import AccountOrderDetails from 'src/components/sections/Account/AccountOrderDetails'
import AccountOrderMoreInfo from 'src/components/sections/Account/AccountOrderMoreInfo'
import AccountOrderOrderedBy from 'src/components/sections/Account/AccountOrderOrderedBy'
import AccountOrderPayment from 'src/components/sections/Account/AccountOrderPayment'
import AccountOrderStatus from 'src/components/sections/Account/AccountOrderStatus'
import AccountOrderSummary from 'src/components/sections/Account/AccountOrderSummary'
import AccountOrdersList from 'src/components/sections/Account/AccountOrdersList'
import AccountProfile from 'src/components/sections/Account/AccountProfile'
import AccountSecurity from 'src/components/sections/Account/AccountSecurity'
import AccountUnauthorized from 'src/components/sections/Account/AccountUnauthorized'
import AccountUserDetails from 'src/components/sections/Account/AccountUserDetails'
import { getComponentKey } from 'src/utils/cms'
import { default as GLOBAL_COMPONENTS } from '../global/Components'

import CUSTOM_COMPONENTS from 'src/customizations/src/components'
import PLUGINS_COMPONENTS from 'src/plugins'

const ACCOUNT_COMPONENTS: Record<string, ComponentType<any>> = {
  ...GLOBAL_COMPONENTS,
  [getComponentKey(AccountNavigation, 'AccountNavigation')]: AccountNavigation,
  [getComponentKey(AccountProfile, 'AccountProfile')]: AccountProfile,
  [getComponentKey(AccountOrdersList, 'AccountOrdersList')]: AccountOrdersList,
  [getComponentKey(AccountUserDetails, 'AccountUserDetails')]:
    AccountUserDetails,
  [getComponentKey(AccountSecurity, 'AccountSecurity')]: AccountSecurity,
  [getComponentKey(AccountOrderDetails, 'AccountOrderDetails')]:
    AccountOrderDetails,
  [getComponentKey(AccountOrderStatus, 'AccountOrderStatus')]:
    AccountOrderStatus,
  [getComponentKey(AccountOrderPayment, 'AccountOrderPayment')]:
    AccountOrderPayment,
  [getComponentKey(AccountOrderDelivery, 'AccountOrderDelivery')]:
    AccountOrderDelivery,
  [getComponentKey(AccountOrderSummary, 'AccountOrderSummary')]:
    AccountOrderSummary,
  [getComponentKey(AccountOrderOrderedBy, 'AccountOrderOrderedBy')]:
    AccountOrderOrderedBy,
  [getComponentKey(AccountOrderBudgets, 'AccountOrderBudgets')]:
    AccountOrderBudgets,
  [getComponentKey(AccountOrderMoreInfo, 'AccountOrderMoreInfo')]:
    AccountOrderMoreInfo,
  [getComponentKey(AccountUnauthorized, 'AccountUnauthorized')]:
    AccountUnauthorized,
  ...PLUGINS_COMPONENTS,
  ...CUSTOM_COMPONENTS,
}

export default ACCOUNT_COMPONENTS
