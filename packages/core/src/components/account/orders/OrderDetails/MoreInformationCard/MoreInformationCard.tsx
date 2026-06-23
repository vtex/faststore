import { camelCaseToTitle } from 'src/utils/utilities'
import Card from '../../../components/Card'
import { defaultOrderMoreInfoLabels } from '../orderDetailsLabels'

export interface MoreInformationCardProps {
  title?: string
  fields: Array<{
    name: string
    value: string
    refId?: string
  }>
}

function MoreInformationCard({
  title = defaultOrderMoreInfoLabels.moreInfoTitle,
  fields,
}: MoreInformationCardProps) {
  return (
    <Card title={title} data-fs-order-more-information-card>
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
    </Card>
  )
}

export default MoreInformationCard
