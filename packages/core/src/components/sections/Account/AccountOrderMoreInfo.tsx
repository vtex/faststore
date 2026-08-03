import MoreInformationCard from 'src/components/account/orders/OrderDetails/MoreInformationCard'
import {
  type OrderMoreInfoSectionLabels,
  defaultOrderMoreInfoLabels,
} from 'src/components/account/orders/OrderDetails/orderDetailsLabels'
import {
  type AccountOrderDetailsPageData,
  useAccountPageData,
} from 'src/sdk/account/accountPageContext'
import Section from '../Section'

export type AccountOrderMoreInfoProps = OrderMoreInfoSectionLabels

const AccountOrderMoreInfo = ({
  moreInfoTitle = defaultOrderMoreInfoLabels.moreInfoTitle,
}: AccountOrderMoreInfoProps) => {
  const { order } = useAccountPageData<AccountOrderDetailsPageData>()

  const moreInformationCustomFields = order?.customFields?.find(
    (field) => field.type === 'order'
  )?.fields

  if (!moreInformationCustomFields?.length) {
    return null
  }

  return (
    <Section className="section-account-order-more-info">
      <MoreInformationCard
        fields={moreInformationCustomFields}
        title={moreInfoTitle}
      />
    </Section>
  )
}

AccountOrderMoreInfo.$componentKey = 'AccountOrderMoreInfo'

export default AccountOrderMoreInfo
