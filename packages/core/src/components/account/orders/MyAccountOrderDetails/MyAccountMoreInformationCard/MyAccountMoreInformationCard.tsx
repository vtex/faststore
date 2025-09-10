import { camelCaseToTitle } from '../../../../../utils/utilities'
import MyAccountCard from '../../../components/MyAccountCard'

export interface MyAccountMoreInformationCardProps {
  fields: Array<{
    name: string
    value: string
    refId?: string
  }>
}

function MyAccountMoreInformationCard({
  fields,
}: MyAccountMoreInformationCardProps) {
  return (
    <MyAccountCard title="More information" data-fs-order-more-information-card>
      <div data-fs-order-more-information-card-content>
        {fields.map((item) => (
          <div key={item.name} data-fs-order-more-information-card-item>
            <p data-fs-order-more-information-card-title>
              {camelCaseToTitle(item.name)}
            </p>
            <p data-fs-order-more-information-card-value>{item.value}</p>
          </div>
        ))}
      </div>
    </MyAccountCard>
  )
}

export default MyAccountMoreInformationCard
