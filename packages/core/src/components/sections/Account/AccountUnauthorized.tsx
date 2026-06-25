import { LinkButton } from '@faststore/ui'
import { OverriddenDefaultEmptyState as EmptyState } from 'src/components/sections/EmptyState/OverriddenDefaultEmptyState'
import Section from '../Section'

export type AccountUnauthorizedProps = {
  title?: string
  subtitle?: string
  backLabel?: string
}

const defaultLabels = {
  title: 'Unauthorized Access',
  subtitle: "You don't have permission to access this page.",
  backLabel: 'Back to Account',
}

const AccountUnauthorized = ({
  title = defaultLabels.title,
  subtitle = defaultLabels.subtitle,
  backLabel = defaultLabels.backLabel,
}: AccountUnauthorizedProps) => {
  return (
    <Section className="section-account-unauthorized">
      <EmptyState
        title={title}
        titleIcon={{ icon: 'ShoppingCart', alt: 'Shopping Cart' }}
        subtitle={subtitle}
        showLoader={false}
      >
        <LinkButton variant="secondary" href="/pvt/account">
          {backLabel}
        </LinkButton>
      </EmptyState>
    </Section>
  )
}

AccountUnauthorized.$componentKey = 'AccountUnauthorized'

export default AccountUnauthorized
