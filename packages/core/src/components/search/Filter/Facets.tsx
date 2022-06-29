import { Label as UILabel, List as UIList } from '@faststore/ui'

import type {
  Filter_FacetsFragment,
  IStoreSelectedFacet,
} from '@generated/graphql'
import Accordion, { AccordionItem } from 'src/components/ui/Accordion'
import { Badge } from 'src/components/ui/Badge'
import Checkbox from 'src/components/ui/Checkbox'
import PriceRange from 'src/components/ui/PriceRange'

import styles from './facets.module.scss'

type OnFacetChange = (
  item: IStoreSelectedFacet,
  type: 'BOOLEAN' | 'RANGE'
) => void

interface FacetsProps {
  /**
   * ID to find this component in testing tools (e.g.: cypress,
   * testing-library, and jest).
   */
  testId: string
  /**
   * The array that represents the details of every facet.
   */
  facets: Filter_FacetsFragment[]
  /**
   * The expanded items from the `Accordion`.
   */
  indicesExpanded: Set<number>
  /**
   * This function is called when `Checkbox` from the facet changes.
   */
  onFacetChange: OnFacetChange
  /**
   * This function is called when `Accordion` is expanded or collapsed.
   */
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
    <div className={styles.fsFacets} data-store-filter data-testid={testId}>
      <h2 className="text__title-mini-alt" data-fs-facets-title>
        Filters
      </h2>
      <Accordion
        expandedIndices={indicesExpanded}
        onChange={onAccordionChange}
        data-fs-facets-accordion
      >
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
              data-fs-facets-accordion-item
            >
              {type === 'StoreFacetBoolean' && isExpanded && (
                <UIList data-fs-facets-list>
                  {facet.values.map((item) => {
                    const id = `${testId}-${facet.label}-${item.label}`

                    return (
                      <li key={id} data-fs-facets-list-item>
                        <Checkbox
                          id={id}
                          checked={item.selected}
                          onChange={() =>
                            onFacetChange(
                              { key: facet.key, value: item.value },
                              'BOOLEAN'
                            )
                          }
                          data-fs-facets-list-item-checkbox
                          data-testid={`${testId}-accordion-panel-checkbox`}
                          data-value={item.value}
                          data-quantity={item.quantity}
                        />
                        <UILabel
                          htmlFor={id}
                          className="text__title-mini-alt"
                          data-fs-facets-list-item-label
                        >
                          {item.label}{' '}
                          <Badge data-fs-facets-list-item-badge>
                            {item.quantity}
                          </Badge>
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
