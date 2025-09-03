import type { ServerOrderDetailsQueryQuery } from '../../../../../../@generated/graphql'
import MyAccountCard from '../../../components/MyAccountCard'

interface MyAccountOrderedByCardProps {
  clientProfileData: Pick<
    ServerOrderDetailsQueryQuery['userOrder']['clientProfileData'],
    | 'firstName'
    | 'lastName'
    | 'email'
    | 'phone'
    | 'corporateName'
    | 'isCorporate'
  >
  shopperName: {
    firstName: string
    lastName: string
  }
}

function MyAccountOrderedByCard({
  clientProfileData,
  shopperName,
}: MyAccountOrderedByCardProps) {
  const firstName = shopperName?.firstName ?? clientProfileData?.firstName ?? ''
  const lastName = shopperName?.lastName ?? clientProfileData?.lastName ?? ''
  const email = clientProfileData?.email
  const phone = clientProfileData?.phone
  const corporateName = clientProfileData?.corporateName
  const isCorporate = clientProfileData?.isCorporate

  const getFirstLetter = (name: string) => {
    return name.charAt(0).toUpperCase()
  }

  return (
    <MyAccountCard title="Ordered by" data-fs-order-ordered-by-card>
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
    </MyAccountCard>
  )
}

export default MyAccountOrderedByCard
