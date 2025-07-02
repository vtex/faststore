import type { StoreFacetValueBoolean } from '@generated/graphql'
import type { RegionalizationCmsData } from 'src/utils/globalSettings'

interface FilterDeliveryOptionFacetProps {
  item: StoreFacetValueBoolean
  deliveryOptions: RegionalizationCmsData['deliverySettings']['deliveryOptions']
}

export default function FilterDeliveryOptionFacet({
  item,
  deliveryOptions,
}: FilterDeliveryOptionFacetProps) {
  const mapDeliveryOptionLabel: Record<string, string> = {
    'all-delivery-options':
      deliveryOptions?.allDeliveryOptions ?? 'All delivery options',
    express: deliveryOptions?.expressDelivery ?? 'Express',
    standard: deliveryOptions?.standardDelivery ?? 'Standard',
  }

  return <>{mapDeliveryOptionLabel[item.value] ?? item.label}</>
}
