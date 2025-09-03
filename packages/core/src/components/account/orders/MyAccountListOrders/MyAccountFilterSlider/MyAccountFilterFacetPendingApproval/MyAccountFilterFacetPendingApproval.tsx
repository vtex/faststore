import { Toggle } from '@faststore/ui'
import { useMemo } from 'react'
import type { SelectedFacet } from 'src/sdk/search/useMyAccountFilter'

export interface MyAccountFilterFacetPendingApprovalProps {
  /**
   * Current selected facets from filter context
   */
  selected: SelectedFacet[]
  /**
   * Dispatch from filter context
   */
  dispatch: (action: { type: 'toggleFacet' | 'setFacet'; payload: any }) => void
}

function MyAccountFilterFacetPendingApproval({
  selected,
  dispatch,
}: MyAccountFilterFacetPendingApprovalProps) {
  const isSelected = useMemo(
    () =>
      selected.some((f) => f.key === 'pendingMyApproval' && f.value === 'true'),
    [selected]
  )

  const handleToggleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const isChecked = event.target.checked

    if (isChecked) {
      dispatch({
        type: 'setFacet',
        payload: {
          facet: { key: 'pendingMyApproval', value: 'true' },
          unique: true,
        },
      })
    } else {
      dispatch({
        type: 'toggleFacet',
        payload: {
          key: 'pendingMyApproval',
          value: 'true',
        },
      })
    }
  }

  return (
    <div data-fs-my-account-filter-facet-pending-approval>
      <Toggle
        id="pending-approval-toggle"
        testId="pending-approval-toggle"
        checked={isSelected}
        onChange={handleToggleChange}
        aria-label="Filter orders pending approval"
      />
      <label htmlFor="pending-approval-toggle">Pending my approval</label>
    </div>
  )
}

export default MyAccountFilterFacetPendingApproval
