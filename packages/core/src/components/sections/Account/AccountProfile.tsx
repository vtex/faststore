import {
  ProfileSection,
  type ProfileSectionLabels,
} from 'src/components/account/profile'
import { useAccountPageData } from 'src/sdk/account/accountPageContext'
import type { AccountProfilePageData } from 'src/sdk/account/accountPageContext'
import Section from '../Section'

export type AccountProfileProps = ProfileSectionLabels

const defaultLabels: Required<ProfileSectionLabels> = {
  pageTitle: 'Profile',
  nameLabel: 'Name',
  emailLabel: 'Email',
  idLabel: 'ID',
  createdDateLabel: 'Created date',
}

const AccountProfile = ({
  pageTitle = defaultLabels.pageTitle,
  nameLabel = defaultLabels.nameLabel,
  emailLabel = defaultLabels.emailLabel,
  idLabel = defaultLabels.idLabel,
  createdDateLabel = defaultLabels.createdDateLabel,
}: AccountProfileProps) => {
  const { profile } = useAccountPageData<AccountProfilePageData>()

  return (
    <Section className="section-account-profile">
      <ProfileSection
        profile={profile}
        labels={{
          pageTitle,
          nameLabel,
          emailLabel,
          idLabel,
          createdDateLabel,
        }}
      />
    </Section>
  )
}

AccountProfile.$componentKey = 'AccountProfile'

export default AccountProfile
