import { SecuritySection } from 'src/components/account/security'
import type { SecuritySectionLabels } from 'src/components/account/security/securityLabels'
import { defaultSecurityLabels } from 'src/components/account/security/securityLabels'
import {
  type AccountSecurityPageData,
  useAccountPageData,
} from 'src/sdk/account/accountPageContext'
import Section from '../Section'

export type AccountSecurityProps = SecuritySectionLabels

const AccountSecurity = ({
  pageTitle = defaultSecurityLabels.pageTitle,
  passwordLabel = defaultSecurityLabels.passwordLabel,
  resetPasswordLabel = defaultSecurityLabels.resetPasswordLabel,
  currentPasswordLabel = defaultSecurityLabels.currentPasswordLabel,
  newPasswordLabel = defaultSecurityLabels.newPasswordLabel,
  showPasswordAria = defaultSecurityLabels.showPasswordAria,
  cancelLabel = defaultSecurityLabels.cancelLabel,
  savePasswordLabel = defaultSecurityLabels.savePasswordLabel,
  passwordRulesIntro = defaultSecurityLabels.passwordRulesIntro,
  rule8Chars = defaultSecurityLabels.rule8Chars,
  rule1Uppercase = defaultSecurityLabels.rule1Uppercase,
  rule1Lowercase = defaultSecurityLabels.rule1Lowercase,
  rule1Number = defaultSecurityLabels.rule1Number,
  emailRequiredError = defaultSecurityLabels.emailRequiredError,
  allFieldsRequiredError = defaultSecurityLabels.allFieldsRequiredError,
  samePasswordError = defaultSecurityLabels.samePasswordError,
  passwordUpdatedToast = defaultSecurityLabels.passwordUpdatedToast,
  passwordFailedToast = defaultSecurityLabels.passwordFailedToast,
}: AccountSecurityProps) => {
  const { userEmail } = useAccountPageData<AccountSecurityPageData>()

  return (
    <Section className="section-account-security">
      <SecuritySection
        userEmail={userEmail}
        labels={{
          pageTitle,
          passwordLabel,
          resetPasswordLabel,
          currentPasswordLabel,
          newPasswordLabel,
          showPasswordAria,
          cancelLabel,
          savePasswordLabel,
          passwordRulesIntro,
          rule8Chars,
          rule1Uppercase,
          rule1Lowercase,
          rule1Number,
          emailRequiredError,
          allFieldsRequiredError,
          samePasswordError,
          passwordUpdatedToast,
          passwordFailedToast,
        }}
      />
    </Section>
  )
}

AccountSecurity.$componentKey = 'AccountSecurity'

export default AccountSecurity
