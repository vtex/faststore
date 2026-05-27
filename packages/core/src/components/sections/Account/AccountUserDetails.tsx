import UserDetails from 'src/components/account/UserDetails/UserDetails'
import type { UserDetailsSectionLabels } from 'src/components/account/UserDetails/userDetailsLabels'
import { defaultUserDetailsLabels } from 'src/components/account/UserDetails/userDetailsLabels'
import {
  type AccountUserDetailsPageData,
  useAccountPageData,
} from 'src/sdk/account/accountPageContext'
import Section from '../Section'

export type AccountUserDetailsProps = UserDetailsSectionLabels

const AccountUserDetails = ({
  pageTitle = defaultUserDetailsLabels.pageTitle,
  nameLabel = defaultUserDetailsLabels.nameLabel,
  emailLabel = defaultUserDetailsLabels.emailLabel,
  roleLabel = defaultUserDetailsLabels.roleLabel,
  orgUnitLabel = defaultUserDetailsLabels.orgUnitLabel,
}: AccountUserDetailsProps) => {
  const { userDetails } = useAccountPageData<AccountUserDetailsPageData>()

  return (
    <Section className="section-account-user-details">
      <UserDetails
        userDetails={userDetails}
        labels={{
          pageTitle,
          nameLabel,
          emailLabel,
          roleLabel,
          orgUnitLabel,
        }}
      />
    </Section>
  )
}

AccountUserDetails.$componentKey = 'AccountUserDetails'

export default AccountUserDetails
