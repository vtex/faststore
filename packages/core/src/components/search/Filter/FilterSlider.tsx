import { useSearch } from '@faststore/sdk'
import {
  Button as UIButton,
  SlideOver as UISlideOver,
  SlideOverHeader as UISlideOverHeader,
} from '@faststore/ui'

import type { Filter_FacetsFragment } from '@generated/graphql'
import { useUI } from '@faststore/ui'
import { useFadeEffect } from '@faststore/ui'

import Facets from './Facets'
import styles from './filter-slider.module.scss'
import type { useFilter } from './useFilter'

interface Props {
  /**
   * The array that represents the details of every facet.
   */
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
    <UISlideOver
      isOpen
      fade={fade}
      onDismiss={fadeOut}
      size="partial"
      direction="rightSide"
      className={styles.fsFilterSlider}
      onTransitionEnd={() => fade === 'out' && closeFilter()}
    >
      <div data-fs-filter-slider-content>
        <UISlideOverHeader
          onClose={() => {
            dispatch({
              type: 'selectFacets',
              payload: state.selectedFacets,
            })

            fadeOut()
          }}
        >
          <h2 className="text__lead">Filters</h2>
        </UISlideOverHeader>
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
      <footer data-fs-filter-slider-footer>
        <UIButton
          data-fs-filter-slider-footer-button-clear
          variant="secondary"
          onClick={() => dispatch({ type: 'selectFacets', payload: [] })}
        >
          Clear All
        </UIButton>
        <UIButton
          data-fs-filter-slider-footer-button-apply
          variant="primary"
          data-testid="filter-slider-button-apply"
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
        </UIButton>
      </footer>
    </UISlideOver>
  )
}

export default FilterSlider
