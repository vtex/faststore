import { Icon, LinkButton } from '@faststore/ui'

export default function MyAccountListOrdersEmptyState() {
  return (
    <div data-fs-list-orders-empty-state>
      <div data-fs-list-orders-empty-state-image>
        <Icon name="Bag2" width={56} height={56} />
        <h2 data-fs-list-orders-empty-state-title>You don’t have any orders</h2>
      </div>

      <LinkButton
        data-fs-list-orders-empty-state-link
        href="/"
        variant="secondary"
      >
        Start shopping
      </LinkButton>
    </div>
  )
}
