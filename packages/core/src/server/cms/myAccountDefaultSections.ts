export type NativeMyAccountContentType =
  | 'myAccountProfile'
  | 'myAccountOrders'
  | 'myAccountOrderDetails'
  | 'myAccountUserDetails'
  | 'myAccountSecurity'
  | 'myAccountUnauthorized'
  | 'myAccountCards'

/** Store content-types are opaque strings; native literals keep autocompletion. */
export type MyAccountContentType = NativeMyAccountContentType | (string & {})

export type DefaultMyAccountSection = {
  name: string
  $componentKey: string
  data: Record<string, unknown>
}

const DEFAULT_SECTION_KEYS: Record<NativeMyAccountContentType, string[]> = {
  myAccountProfile: ['AccountNavigation', 'AccountProfile'],
  myAccountOrders: ['AccountNavigation', 'AccountOrdersList'],
  myAccountCards: ['AccountNavigation', 'AccountListCards'],
  // Mirrors the render order of the `@deprecated OrderDetails.tsx` component,
  // which is the design reference available in the repo. The delivery option
  // accordions render inside AccountOrderDelivery, so they sit right after the
  // compact delivery card instead of after the summary — known deviation, see
  // specs/order-details-layout-fix.md (Decision 3).
  myAccountOrderDetails: [
    'AccountNavigation',
    'AccountOrderDetails',
    'AccountOrderOrderedBy',
    'AccountOrderDelivery',
    'AccountOrderStatus',
    'AccountOrderPayment',
    'AccountOrderSummary',
    'AccountOrderMoreInfo',
    'AccountOrderBudgets',
  ],
  myAccountUserDetails: ['AccountNavigation', 'AccountUserDetails'],
  myAccountSecurity: ['AccountNavigation', 'AccountSecurity'],
  myAccountUnauthorized: ['AccountUnauthorized'],
}

export function getDefaultMyAccountSections(
  contentType: MyAccountContentType
): DefaultMyAccountSection[] {
  return (
    DEFAULT_SECTION_KEYS[contentType as NativeMyAccountContentType] ?? []
  ).map((key) => ({
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
