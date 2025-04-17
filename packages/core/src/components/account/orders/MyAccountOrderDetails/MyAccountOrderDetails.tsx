import {
  Badge as UIBadge,
  Button as UIButton,
  Icon as UIIcon,
  IconButton as UIIconButton,
} from '@faststore/ui'
import MyAccountStatusCard from 'src/components/account/orders/MyAccountOrderDetails/MyAccountStatusCard'
import MyAccountDeliveryCard from './MyAccountDeliveryCard'
import MyAccountOrderedByCard from './MyAccountOrderedByCard'
import MyAccountPaymentCard from './MyAccountPaymentCard'
import MyAccountSummaryCard from './MyAccountSummaryCard'

import type { ServerOrderDetailsQueryQuery } from '@generated/graphql'
import styles from './section.module.scss'
import {
  debitCardOrderSummary,
  bankInvoiceOrderSummary,
  paypalOrderSummary,
  giftCardOrderSummary,
  freeOrderSummary,
  multiplePaymentsOrderSummary,
  dinersOrderSummary,
  amexOrderSummary,
  hipercardOrderSummary,
  discoverOrderSummary,
  banricomprasOrderSummary,
  auraOrderSummary,
  eloOrderSummary,
  jcbOrderSummary,
  visaOrderSummary,
  mastercardOrderSummary,
  nubankOrderSummary,
  promissoryOrderSummary,
  multipleCardsOrderSummary,
  cashOrderSummary,
  applePayOrderSummary,
  googlePayOrderSummary,
} from '../../mocks/orderSummaryExamples'

export interface MyAccountOrderDetailsProps {
  order: ServerOrderDetailsQueryQuery['userOrder']
}

export default function MyAccountOrderDetails({
  order,
}: MyAccountOrderDetailsProps) {
  // TODO: Using multipleCardsOrderSummary as an example, but this would come from an API
  const orderSummary = multipleCardsOrderSummary

  return (
    <div className={styles.page} data-fs-order-details>
      <header data-fs-order-details-header>
        <div data-fs-order-details-header-title>
          <UIIconButton
            size="small"
            aria-label="Go back"
            icon={<UIIcon name="ArrowLeft" />}
          />
          <h1 data-fs-order-details-header-title-text>
            Order #{order.orderId}
          </h1>
          <UIBadge variant="warning">Pending approval</UIBadge>
        </div>
        <div data-fs-order-details-header-actions>
          <UIButton variant="secondary" size="small">
            Cancel order
          </UIButton>
          <UIButton
            variant="secondary"
            size="small"
            icon={<UIIcon name="XCircle" />}
          >
            Reject
          </UIButton>
          <UIButton
            variant="primary"
            size="small"
            icon={<UIIcon name="CircleCheck" />}
          >
            Approve
          </UIButton>
        </div>
      </header>
      <main data-fs-order-details-content>
        <MyAccountOrderedByCard clientProfileData={order.clientProfileData} />
        <MyAccountDeliveryCard />
        <MyAccountStatusCard />
        <MyAccountPaymentCard
          currencyCode={orderSummary.currencyCode}
          paymentData={orderSummary.paymentData}
          allowCancellation={orderSummary.allowCancellation}
        />
        <MyAccountSummaryCard
          totals={order.totals}
          currencyCode={order.storePreferencesData.currencyCode}
          transactions={order.paymentData.transactions}
        />
        <MyAccountPaymentCard
          currencyCode={mastercardOrderSummary.currencyCode}
          paymentData={mastercardOrderSummary.paymentData}
          allowCancellation={mastercardOrderSummary.allowCancellation}
        />
        <MyAccountPaymentCard
          currencyCode={dinersOrderSummary.currencyCode}
          paymentData={dinersOrderSummary.paymentData}
          allowCancellation={dinersOrderSummary.allowCancellation}
        />
        <MyAccountPaymentCard
          currencyCode={amexOrderSummary.currencyCode}
          paymentData={amexOrderSummary.paymentData}
          allowCancellation={amexOrderSummary.allowCancellation}
        />
        <MyAccountPaymentCard
          currencyCode={hipercardOrderSummary.currencyCode}
          paymentData={hipercardOrderSummary.paymentData}
          allowCancellation={hipercardOrderSummary.allowCancellation}
        />
        <MyAccountPaymentCard
          currencyCode={discoverOrderSummary.currencyCode}
          paymentData={discoverOrderSummary.paymentData}
          allowCancellation={discoverOrderSummary.allowCancellation}
        />
        <MyAccountPaymentCard
          currencyCode={banricomprasOrderSummary.currencyCode}
          paymentData={banricomprasOrderSummary.paymentData}
          allowCancellation={banricomprasOrderSummary.allowCancellation}
        />
        <MyAccountPaymentCard
          currencyCode={auraOrderSummary.currencyCode}
          paymentData={auraOrderSummary.paymentData}
          allowCancellation={auraOrderSummary.allowCancellation}
        />
        <MyAccountPaymentCard
          currencyCode={eloOrderSummary.currencyCode}
          paymentData={eloOrderSummary.paymentData}
        />
        <MyAccountPaymentCard
          currencyCode={jcbOrderSummary.currencyCode}
          paymentData={jcbOrderSummary.paymentData}
          allowCancellation={jcbOrderSummary.allowCancellation}
        />
        <MyAccountPaymentCard
          currencyCode={debitCardOrderSummary.currencyCode}
          paymentData={debitCardOrderSummary.paymentData}
          allowCancellation={debitCardOrderSummary.allowCancellation}
        />
        <MyAccountPaymentCard
          currencyCode={paypalOrderSummary.currencyCode}
          paymentData={paypalOrderSummary.paymentData}
          allowCancellation={paypalOrderSummary.allowCancellation}
        />
        <MyAccountPaymentCard
          currencyCode={multiplePaymentsOrderSummary.currencyCode}
          paymentData={multiplePaymentsOrderSummary.paymentData}
          allowCancellation={multiplePaymentsOrderSummary.allowCancellation}
        />
        <MyAccountPaymentCard
          currencyCode={giftCardOrderSummary.currencyCode}
          paymentData={giftCardOrderSummary.paymentData}
          allowCancellation={giftCardOrderSummary.allowCancellation}
        />
        <MyAccountPaymentCard
          currencyCode={bankInvoiceOrderSummary.currencyCode}
          paymentData={bankInvoiceOrderSummary.paymentData}
          allowCancellation={bankInvoiceOrderSummary.allowCancellation}
        />
        <MyAccountPaymentCard
          currencyCode={freeOrderSummary.currencyCode}
          paymentData={freeOrderSummary.paymentData}
          allowCancellation={freeOrderSummary.allowCancellation}
        />
        <MyAccountPaymentCard
          currencyCode={nubankOrderSummary.currencyCode}
          paymentData={nubankOrderSummary.paymentData}
          allowCancellation={nubankOrderSummary.allowCancellation}
        />
        <MyAccountPaymentCard
          currencyCode={promissoryOrderSummary.currencyCode}
          paymentData={promissoryOrderSummary.paymentData}
          allowCancellation={promissoryOrderSummary.allowCancellation}
        />
        <MyAccountPaymentCard
          currencyCode={debitCardOrderSummary.currencyCode}
          paymentData={debitCardOrderSummary.paymentData}
          allowCancellation={debitCardOrderSummary.allowCancellation}
        />
        <MyAccountPaymentCard
          currencyCode={multipleCardsOrderSummary.currencyCode}
          paymentData={multipleCardsOrderSummary.paymentData}
          allowCancellation={multipleCardsOrderSummary.allowCancellation}
        />
        <MyAccountPaymentCard
          currencyCode={cashOrderSummary.currencyCode}
          paymentData={cashOrderSummary.paymentData}
        />
        <MyAccountPaymentCard
          currencyCode={applePayOrderSummary.currencyCode}
          paymentData={applePayOrderSummary.paymentData}
          allowCancellation={applePayOrderSummary.allowCancellation}
        />
        <MyAccountPaymentCard
          currencyCode={googlePayOrderSummary.currencyCode}
          paymentData={googlePayOrderSummary.paymentData}
          allowCancellation={googlePayOrderSummary.allowCancellation}
        />
      </main>
    </div>
  )
}
