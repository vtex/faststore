import { Icon as UIIcon } from '@faststore/ui'
import type { PickupPoint } from '.'

export type PickupPointCardProps = {
  store: PickupPoint
}

function formatDistance(distance: number) {
  return `${distance.toFixed(1).replace('.', ',')}km`
}

function PickupPointCard({ store }: PickupPointCardProps) {
  return (
    <div data-fs-pickup-point-card>
      <header data-fs-pickup-point-card-header>
        <UIIcon name="Storefront" />
        <h3 data-fs-pickup-point-card-header-title>{store?.name}</h3>
        <span data-fs-pickup-point-card-header-postal-code>
          {store?.address?.postalCode}
        </span>
      </header>
      <div data-fs-pickup-point-card-header-content>
        <p data-fs-pickup-point-card-address>
          <span>
            {store?.address?.street}, {store?.address?.number}
          </span>
          <span>
            {store?.address?.city} - {store?.address?.state}
          </span>
        </p>
        <span data-fs-pickup-point-card-distance>
          {store?.distance !== undefined ? formatDistance(store.distance) : ''}
        </span>
      </div>
    </div>
  )
}

export default PickupPointCard
