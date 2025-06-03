import { Icon as UIIcon } from '@faststore/ui'

export type PickupPointCardProps = {
  store: {
    name: string
    postalCode: string
    address: string
    number: string
    city: string
    state: string
    distance: number
  }
}

function formatDistance(distance: number) {
  return `${distance.toFixed(1).replace('.', ',')}km`
}

export function PickupPointCard({ store }: PickupPointCardProps) {
  return (
    <div data-fs-pickup-point-card>
      <header data-fs-pickup-point-card-header>
        <UIIcon name="Storefront" />
        <h3 data-fs-pickup-point-card-header-title>{store.name}</h3>
        <span data-fs-pickup-point-card-header-zipcode>{store.postalCode}</span>
      </header>
      <div data-fs-pickup-point-card-header-content>
        <p data-fs-pickup-point-card-address>
          <span>
            {store.address}, {store.number}
          </span>
          <span>
            {store.city} - {store.state}
          </span>
        </p>
        <span data-fs-pickup-point-card-distance>
          {formatDistance(store.distance)}
        </span>
      </div>
    </div>
  )
}
