import type { ClientProfileData } from '@faststore/api/dist/esm/src/platforms/vtex/clients/commerce/types/OrderForm'
import MyAccountCard from '../../../components/MyAccountCard'

interface MyAccountOrderedByCardProps {
  clientProfileData: Pick<
    ClientProfileData,
    | 'firstName'
    | 'lastName'
    | 'email'
    | 'phone'
    | 'corporateName'
    | 'isCorporate'
  >
}

function MyAccountOrderedByCard({
  clientProfileData,
}: MyAccountOrderedByCardProps) {
  const { firstName, lastName, email, phone, corporateName, isCorporate } =
    clientProfileData

  const getFirstLetter = (name: string) => {
    return name.charAt(0).toUpperCase()
  }

  return (
    <MyAccountCard title="Ordered by" data-fs-order-ordered-by-card>
      {isCorporate && corporateName && (
        <div data-fs-ordered-by-org>
          <div data-fs-ordered-by-avatar>{getFirstLetter(corporateName)}</div>
          <p>
            <strong>{corporateName}</strong>
          </p>
        </div>
      )}
      <div data-fs-ordered-by-client-info>
        <p>
          <strong>{`${firstName} ${lastName}`}</strong>
        </p>
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
