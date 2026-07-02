export type MyAccountContentType =
  | 'myAccountProfile'
  | 'myAccountOrders'
  | 'myAccountOrderDetails'
  | 'myAccountUserDetails'
  | 'myAccountSecurity'
  | 'myAccountUnauthorized'

export type DefaultMyAccountSection = {
  name: string
  $componentKey: string
  data: Record<string, unknown>
}

const DEFAULT_SECTION_KEYS: Record<MyAccountContentType, string[]> = {
  myAccountProfile: ['AccountNavigation', 'AccountProfile'],
  myAccountOrders: ['AccountNavigation', 'AccountOrdersList'],
  myAccountOrderDetails: [
    'AccountNavigation',
    'AccountOrderDetails',
    'AccountOrderStatus',
    'AccountOrderPayment',
    'AccountOrderDelivery',
    'AccountOrderSummary',
    'AccountOrderOrderedBy',
    'AccountOrderBudgets',
    'AccountOrderMoreInfo',
  ],
  myAccountUserDetails: ['AccountNavigation', 'AccountUserDetails'],
  myAccountSecurity: ['AccountNavigation', 'AccountSecurity'],
  myAccountUnauthorized: ['AccountUnauthorized'],
}

export function getDefaultMyAccountSections(
  contentType: MyAccountContentType
): DefaultMyAccountSection[] {
  return (DEFAULT_SECTION_KEYS[contentType] ?? []).map((key) => ({
    name: key,
    $componentKey: key,
    data: {},
  }))
}

export function withDefaultMyAccountSections<
  T extends { $componentKey?: string; name: string; data?: unknown },
>(contentType: MyAccountContentType, sections: T[] | undefined | null): T[] {
  if (sections && sections.length > 0) {
    return sections
  }

  return getDefaultMyAccountSections(contentType) as unknown as T[]
}

export function extractAccountNavigationData<
  T extends { $componentKey?: string; name: string; data?: unknown },
>(sections: T[]) {
  const navigationSection = sections.find(
    (section) => (section.$componentKey ?? section.name) === 'AccountNavigation'
  )

  return {
    navigationData: (navigationSection?.data ?? {}) as Record<string, string>,
    pageSections: sections
      .filter(
        (section) =>
          (section.$componentKey ?? section.name) !== 'AccountNavigation'
      )
      .map((section) => ({
        ...section,
        data: (section.data ?? {}) as Record<string, unknown>,
      })),
  }
}
