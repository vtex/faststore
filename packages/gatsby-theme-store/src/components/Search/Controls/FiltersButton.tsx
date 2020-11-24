import React, { FC, useState, useCallback, Suspense, lazy } from 'react'
import { useIntl } from '@vtex/gatsby-plugin-i18n'
import { SearchControlsFiltersButton as StoreUISearchControlsFiltersButton } from '@vtex/store-ui'

const SearchFiltersDrawer = lazy(() => import('../Filters/Mobile'))

interface Props {
  variant: string
  isActive?: boolean
}

export const SearchControlsFiltersButton: FC<Props> = ({
  variant,
  ...props
}) => {
  const { formatMessage } = useIntl()
  const [active, setActive] = useState(false)
  const toggle = useCallback(() => setActive(!active), [active])

  return (
    <>
      <StoreUISearchControlsFiltersButton
        label={formatMessage({ id: 'searchControls.filters' })}
        variant={variant}
        onClick={toggle}
      />
      {active ? (
        <Suspense fallback={null}>
          <SearchFiltersDrawer {...props} toggle={toggle} isOpen={active} />
        </Suspense>
      ) : null}
    </>
  )
}
