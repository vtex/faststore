import { useSearch } from '@faststore/sdk'
import { gql } from '@vtex/graphql-utils'

import Button, { ButtonIcon } from 'src/components/ui/Button'
import Icon from 'src/components/ui/Icon'
import SlideOver from 'src/components/ui/SlideOver'
import { useUI } from 'src/sdk/ui/Provider'
import { useFadeEffect } from 'src/sdk/ui/useFadeEffect'
import type { Filter_FacetsFragment } from '@generated/graphql'

import Facets from './Facets'
import { useFilter } from './useFilter'

interface Props {
  facets: Filter_FacetsFragment[]
  /**
   * ID to find this component in testing tools (e.g.: cypress,
   * testing-library, and jest).
   */
  testId?: string
}

function FilterSlider({
  facets,
  testId,
  dispatch,
  expanded,
  selected,
}: Props & ReturnType<typeof useFilter>) {
  const { closeFilter } = useUI()
  const { fade, fadeOut } = useFadeEffect()

  const {
    setFacets,
    state: { selectedFacets },
  } = useSearch()

  return (
    <SlideOver
      isOpen
      fade={fade}
      onDismiss={fadeOut}
      size="partial"
      direction="rightSide"
      className="filter-modal__content"
      onTransitionEnd={() => fade === 'out' && closeFilter()}
    >
      <div className="filter-modal__body">
        <header className="filter-modal__header">
          <h2 className="text__lead">Filters</h2>
          <ButtonIcon
            data-testid="filter-modal-button-close"
            aria-label="Close Filters"
            icon={<Icon name="X" width={32} height={32} />}
            onClick={() => {
              dispatch({
                type: 'selectFacets',
                payload: selectedFacets,
              })

              fadeOut()
            }}
          />
        </header>
        <Facets
          facets={facets}
          testId={`mobile-${testId}`}
          indicesExpanded={expanded}
          onFacetChange={(facet) =>
            dispatch({ type: 'toggleFacet', payload: facet })
          }
          onAccordionChange={(index) =>
            dispatch({ type: 'toggleExpanded', payload: index })
          }
        />
      </div>
      <footer className="filter-modal__footer">
        <Button
          variant="secondary"
          onClick={() => dispatch({ type: 'selectFacets', payload: [] })}
        >
          Clear All
        </Button>
        <Button
          variant="primary"
          data-testid="filter-modal-button-apply"
          onClick={() => {
            setFacets(selected)
            fadeOut()
          }}
        >
          Apply
        </Button>
      </footer>
    </SlideOver>
  )
}

function Filter({ facets: allFacets, testId = 'store-filter' }: Props) {
  const filter = useFilter(allFacets)
  const { toggleFacet } = useSearch()
  const { filter: displayFilter } = useUI()
  const { facets, expanded, dispatch } = filter

  return (
    <>
      <div className="hidden-mobile">
        <Facets
          facets={facets}
          testId={`desktop-${testId}`}
          indicesExpanded={expanded}
          onFacetChange={toggleFacet}
          onAccordionChange={(index) =>
            dispatch({ type: 'toggleExpanded', payload: index })
          }
        />
      </div>

      {displayFilter && <FilterSlider {...filter} testId={testId} />}
    </>
  )
}

export const fragment = gql`
  fragment Filter_facets on StoreFacet {
    key
    label
    type
    values {
      label
      value
      selected
      quantity
    }
  }
`

export default Filter
