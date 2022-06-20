import { Label as UILabel, List as UIList } from '@faststore/ui'

import Accordion, { AccordionItem } from 'src/components/ui/Accordion'
import { Badge } from 'src/components/ui/Badge'
import Checkbox from 'src/components/ui/Checkbox'
import type {
  IStoreSelectedFacet,
  Filter_FacetsFragment,
} from '@generated/graphql'
import PriceRange from 'src/components/ui/PriceRange'

type OnFacetChange = (
  item: IStoreSelectedFacet,
  type: 'BOOLEAN' | 'RANGE'
) => void

interface FacetsProps {
  testId: string
  facets: Filter_FacetsFragment[]
  indicesExpanded: Set<number>
  onFacetChange: OnFacetChange
  onAccordionChange: (index: number) => void
}

const formatRange = (min: number, max: number) =>
  `${min.toFixed(2)}-to-${max.toFixed(2)}`

function Facets({
  testId,
  facets,
  indicesExpanded,
  onFacetChange,
  onAccordionChange,
}: FacetsProps) {
  return (
    <div className="filter" data-store-filter data-testid={testId}>
      <h2 className="text__title-mini-alt">Filters</h2>
      <Accordion expandedIndices={indicesExpanded} onChange={onAccordionChange}>
        {facets.map((facet, index) => {
          const isExpanded = indicesExpanded.has(index)
          const { __typename: type, label } = facet

          return (
            <AccordionItem
              key={`${label}-${index}`}
              prefixId={testId}
              testId={`${testId}-accordion`}
              isExpanded={isExpanded}
              buttonLabel={label}
              data-type={type}
            >
              {type === 'StoreFacetBoolean' && isExpanded && (
                <UIList>
                  {facet.values.map((item) => {
                    const id = `${testId}-${facet.label}-${item.label}`

                    return (
                      <li key={id} className="filter__item">
                        <Checkbox
                          id={id}
                          checked={item.selected}
                          onChange={() =>
                            onFacetChange(
                              { key: facet.key, value: item.value },
                              'BOOLEAN'
                            )
                          }
                          data-testid={`${testId}-accordion-panel-checkbox`}
                          data-value={item.value}
                          data-quantity={item.quantity}
                        />
                        <UILabel htmlFor={id} className="text__title-mini-alt">
                          {item.label} <Badge>{item.quantity}</Badge>
                        </UILabel>
                      </li>
                    )
                  })}
                </UIList>
              )}
              {type === 'StoreFacetRange' && isExpanded && (
                <PriceRange
                  min={facet.min}
                  max={facet.max}
                  onEnd={(v) =>
                    onFacetChange(
                      {
                        key: facet.key,
                        value: formatRange(v.min, v.max),
                      },
                      'RANGE'
                    )
                  }
                />
              )}
            </AccordionItem>
          )
        })}
      </Accordion>
    </div>
  )
}

export default Facets
