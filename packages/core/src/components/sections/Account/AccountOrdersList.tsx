import { ListOrders } from 'src/components/account/orders/ListOrders'
import type { ListOrdersSectionLabels } from 'src/components/account/orders/ListOrders/listOrdersLabels'
import { defaultListOrdersLabels } from 'src/components/account/orders/ListOrders/listOrdersLabels'
import {
  type AccountOrdersListPageData,
  useAccountPageData,
} from 'src/sdk/account/accountPageContext'
import Section from '../Section'

export type AccountOrdersListProps = ListOrdersSectionLabels

const AccountOrdersList = ({
  pageTitle = defaultListOrdersLabels.pageTitle,
  searchPlaceholder = defaultListOrdersLabels.searchPlaceholder,
  filtersLabel = defaultListOrdersLabels.filtersLabel,
  clearAllLabel = defaultListOrdersLabels.clearAllLabel,
  viewResultsLabel = defaultListOrdersLabels.viewResultsLabel,
  noResultsLabel = defaultListOrdersLabels.noResultsLabel,
  noOrdersLabel = defaultListOrdersLabels.noOrdersLabel,
  startShoppingLabel = defaultListOrdersLabels.startShoppingLabel,
  placedOnLabel = defaultListOrdersLabels.placedOnLabel,
  deliveryByLabel = defaultListOrdersLabels.deliveryByLabel,
  pendingApprovalLabel = defaultListOrdersLabels.pendingApprovalLabel,
  paginationOfLabel = defaultListOrdersLabels.paginationOfLabel,
  previousPageLabel = defaultListOrdersLabels.previousPageLabel,
  nextPageLabel = defaultListOrdersLabels.nextPageLabel,
  viewAllLabel = defaultListOrdersLabels.viewAllLabel,
  viewLessLabel = defaultListOrdersLabels.viewLessLabel,
  fromLabel = defaultListOrdersLabels.fromLabel,
  toLabel = defaultListOrdersLabels.toLabel,
  invalidDateRangeLabel = defaultListOrdersLabels.invalidDateRangeLabel,
  orderPlacedStatus = defaultListOrdersLabels.orderPlacedStatus,
  pendingApprovalStatus = defaultListOrdersLabels.pendingApprovalStatus,
  paymentPendingStatus = defaultListOrdersLabels.paymentPendingStatus,
  paymentApprovedStatus = defaultListOrdersLabels.paymentApprovedStatus,
  paymentDeniedStatus = defaultListOrdersLabels.paymentDeniedStatus,
  readyForDeliveryStatus = defaultListOrdersLabels.readyForDeliveryStatus,
  invoicedStatus = defaultListOrdersLabels.invoicedStatus,
  cancellationRequestedStatus = defaultListOrdersLabels.cancellationRequestedStatus,
  canceledStatus = defaultListOrdersLabels.canceledStatus,
}: AccountOrdersListProps) => {
  const { listOrders, total, perPage, filters } =
    useAccountPageData<AccountOrdersListPageData>()

  return (
    <Section className="section-account-orders-list">
      <ListOrders
        listOrders={listOrders}
        total={total}
        perPage={perPage}
        filters={filters}
        labels={{
          pageTitle,
          searchPlaceholder,
          filtersLabel,
          clearAllLabel,
          viewResultsLabel,
          noResultsLabel,
          noOrdersLabel,
          startShoppingLabel,
          placedOnLabel,
          deliveryByLabel,
          pendingApprovalLabel,
          paginationOfLabel,
          previousPageLabel,
          nextPageLabel,
          viewAllLabel,
          viewLessLabel,
          fromLabel,
          toLabel,
          invalidDateRangeLabel,
          orderPlacedStatus,
          pendingApprovalStatus,
          paymentPendingStatus,
          paymentApprovedStatus,
          paymentDeniedStatus,
          readyForDeliveryStatus,
          invoicedStatus,
          cancellationRequestedStatus,
          canceledStatus,
        }}
      />
    </Section>
  )
}

AccountOrdersList.$componentKey = 'AccountOrdersList'

export default AccountOrdersList
