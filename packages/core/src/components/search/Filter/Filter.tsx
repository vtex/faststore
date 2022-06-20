import { setFacet, toggleFacet, useSearch } from '@faststore/sdk'
import { gql } from '@faststore/graphql-utils'

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

  const { resetInfiniteScroll, setState, state } = useSearch()

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
                payload: state.selectedFacets,
              })

              fadeOut()
            }}
          />
        </header>
        <Facets
          facets={facets}
          testId={`mobile-${testId}`}
          indicesExpanded={expanded}
          onFacetChange={(facet, type) =>
            type === 'BOOLEAN'
              ? dispatch({ type: 'toggleFacet', payload: facet })
              : dispatch({ type: 'setFacet', payload: { facet, unique: true } })
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
            resetInfiniteScroll(0)

            setState({
              ...state,
              selectedFacets: selected,
              page: 0,
            })
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
  const { resetInfiniteScroll, state, setState } = useSearch()
  const { filter: displayFilter } = useUI()
  const { facets, expanded, dispatch } = filter

  return (
    <>
      <div className="hidden-mobile">
        <Facets
          facets={facets}
          testId={`desktop-${testId}`}
          indicesExpanded={expanded}
          onFacetChange={(facet, type) => {
            setState({
              ...state,
              selectedFacets:
                type === 'BOOLEAN'
                  ? toggleFacet(state.selectedFacets, facet)
                  : setFacet(state.selectedFacets, facet, true),
              page: 0,
            })
            resetInfiniteScroll(0)
          }}
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
    ... on StoreFacetRange {
      key
      label

      min {
        selected
        absolute
      }

      max {
        selected
        absolute
      }

      __typename
    }
    ... on StoreFacetBoolean {
      key
      label
      values {
        label
        value
        selected
        quantity
      }

      __typename
    }
  }
`

export default Filter
