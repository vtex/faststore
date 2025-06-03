import { Icon as UIIcon } from '@faststore/ui'

export type StoreCardProps = {
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

export function StoreCard({ store }: StoreCardProps) {
  return (
    <div data-fs-store-card>
      <header data-fs-store-card-header>
        <UIIcon name="Storefront" />
        <h3 data-fs-store-card-header-title>{store.name}</h3>
        <span data-fs-store-card-header-zipcode>{store.postalCode}</span>
      </header>
      <div data-fs-store-card-header-content>
        <p data-fs-store-card-address>
          <span>
            {store.address}, {store.number}
          </span>
          <span>
            {store.city} - {store.state}
          </span>
        </p>
        <span data-fs-store-card-distance>
          {formatDistance(store.distance)}
        </span>
      </div>
    </div>
  )
}
