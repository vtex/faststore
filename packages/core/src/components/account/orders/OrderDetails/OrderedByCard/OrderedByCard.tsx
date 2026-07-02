import type { ServerOrderDetailsQueryQuery } from '@generated/graphql'
import Card from '../../../components/Card'

interface OrderedByCardProps {
  title?: string
  clientProfileData: Pick<
    ServerOrderDetailsQueryQuery['userOrder']['clientProfileData'],
    | 'firstName'
    | 'lastName'
    | 'email'
    | 'phone'
    | 'corporateName'
    | 'isCorporate'
  >
  shopper: {
    firstName: string
    lastName: string
    email: string
    phone: string
  }
}

function OrderedByCard({
  title = 'Ordered by',
  clientProfileData,
  shopper,
}: OrderedByCardProps) {
  const shopperNameExists = Boolean(shopper?.firstName)
  const firstName =
    (shopperNameExists ? shopper?.firstName : clientProfileData?.firstName) ??
    ''
  const lastName =
    (shopperNameExists ? shopper?.lastName : clientProfileData?.lastName) ?? ''
  const email = shopper?.email || clientProfileData?.email
  const phone = shopper?.phone || clientProfileData?.phone
  const corporateName = clientProfileData?.corporateName
  const isCorporate = clientProfileData?.isCorporate

  const getFirstLetter = (name: string) => {
    return name.charAt(0).toUpperCase()
  }

  return (
    <Card title={title} data-fs-order-ordered-by-card>
      {isCorporate && corporateName && (
        <div data-fs-ordered-by-org>
          <div data-fs-ordered-by-avatar>{getFirstLetter(corporateName)}</div>
          <p data-fs-ordered-by-org-name>{corporateName}</p>
        </div>
      )}
      <div data-fs-ordered-by-client-info>
        <p
          data-fs-ordered-by-client-name
        >{`${firstName ?? ''} ${lastName ?? ''}`}</p>
        {(phone || email) && (
          <p>
            {phone && <>{phone}</>}
            {phone && email && <br />}
            {email}
          </p>
        )}
      </div>
    </Card>
  )
}

export default OrderedByCard
