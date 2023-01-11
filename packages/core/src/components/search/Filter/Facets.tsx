import {
  Checkbox as UICheckbox,
  Label as UILabel,
  List as UIList,
  Badge as UIBadge,
  Accordion as UIAccordion,
  AccordionItem as UIAccordionItem,
  AccordionButton as UIAccordionButton,
  AccordionPanel as UIAccordionPanel,
} from '@faststore/ui'

import type {
  Filter_FacetsFragment,
  IStoreSelectedFacet,
} from '@generated/graphql'
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
    <div className={styles.fsFacets} data-fs-filter data-testid={testId}>
      <h2 className="text__title-mini-alt" data-fs-facets-title>
        Filters
      </h2>
      <UIAccordion
        indices={indicesExpanded}
        onChange={onAccordionChange}
        data-fs-facets-accordion
      >
        {facets.map((facet, index) => {
          const isExpanded = indicesExpanded.has(index)
          const { __typename: type, label } = facet

          return (
            <UIAccordionItem
              key={`${label}-${index}`}
              prefixId={testId}
              testId={`${testId}-accordion`}
              data-type={type}
              data-fs-facets-accordion-item
            >
              <UIAccordionButton testId={`${testId}-accordion-button`}>
                {label}
              </UIAccordionButton>
              <UIAccordionPanel>
                {type === 'StoreFacetBoolean' && isExpanded && (
                  <UIList data-fs-facets-list>
                    {facet.values.map((item) => {
                      const id = `${testId}-${facet.label}-${item.label}`

                      return (
                        <li key={id} data-fs-facets-list-item>
                          <UICheckbox
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
                            <UIBadge data-fs-facets-list-item-badge>
                              {item.quantity}
                            </UIBadge>
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
              </UIAccordionPanel>
            </UIAccordionItem>
          )
        })}
      </UIAccordion>
    </div>
  )
}

export default Facets
