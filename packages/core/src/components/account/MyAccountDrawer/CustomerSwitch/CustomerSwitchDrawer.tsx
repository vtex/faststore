import {
  Button,
  Icon,
  SlideOver,
  SlideOverHeader,
  Icon as UIIcon,
  useFadeEffect,
} from '@faststore/ui'
import { useMemo, useState } from 'react'
import type { CustomerSwitchOptionData } from './CustomerSwitchOption'
import { CustomerSwitchOptionsList } from './CustomerSwitchOptionsList'
import { CustomerSwitchSearch } from './CustomerSwitchSearch'

import useScreenResize from 'src/sdk/ui/useScreenResize'
import styles from '../OrganizationDrawer/section.module.scss'

type CustomerSwitchDrawerProps = {
  isOpen: boolean
  onCloseDrawer?: () => void
}

// TODO: Remove mock
const options = [
  'Finance Solutions',
  'Stellar Innovations',
  'Blue Horizon Corp',
  'Prime Finance Group',
  'Stellar Ventures',
  'Evergreen Holdings',
  'Finance Pro Consulting',
  'Stellar Strategies',
  'Pioneer Technologies',
  'Global Finance Advisors',
  'TechWave Solutions',
  'Stellar Capital Partners',
].map((name, index) => ({ name, id: `id-${index}` }))

export const CustomerSwitchDrawer = ({
  isOpen,
  onCloseDrawer,
}: CustomerSwitchDrawerProps) => {
  const { fade, fadeOut } = useFadeEffect()
  const { isDesktop } = useScreenResize()

  const [option, setOption] = useState<CustomerSwitchOptionData>(options[0])
  const [loading, setLoading] = useState(false)
  const [searchTerm, setSearchTerm] = useState('')

  const filteredOptions = useMemo(() => {
    if (!searchTerm) {
      return options
    }
    return options.filter((currentOption) =>
      currentOption.name?.toLowerCase().includes(searchTerm.toLowerCase())
    )
  }, [options, searchTerm])

  const handleSubmitCustomer = () => {
    setLoading(true)
    setTimeout(() => {
      setLoading(false)
      onCloseDrawer?.()
    }, 3000)
  }

  return (
    <SlideOver
      data-fs-customer-switch-drawer
      fade={fade}
      onDismiss={fadeOut}
      onTransitionEnd={() => fade === 'out' && onCloseDrawer?.()}
      isOpen={isOpen}
      size="partial"
      direction="rightSide"
      overlayProps={{
        className: `section ${styles.section} section-customer-switch-drawer`,
      }}
    >
      <SlideOverHeader
        data-fs-customer-switch-drawer-header
        onClose={() => onCloseDrawer?.()}
      >
        <div data-fs-customer-switch-drawer-header-content>
          <Button
            size="small"
            variant="tertiary"
            data-fs-customer-switch-drawer-close-button
            onClick={() => onCloseDrawer?.()}
            aria-label="Close"
            className="text__title-mini"
            icon={<UIIcon name="CaretLeft" width={16} height={16} />}
          >
            {!isDesktop && <>back</>}
          </Button>
          {isDesktop && (
            <h1 data-fs-customer-switch-drawer-title>Switch Contract</h1>
          )}
        </div>
      </SlideOverHeader>

      <section data-fs-customer-switch-drawer-body>
        {!isDesktop && (
          <h1 data-fs-customer-switch-drawer-title>Switch Contract</h1>
        )}
        <CustomerSwitchSearch onSearch={setSearchTerm} />
        <CustomerSwitchOptionsList
          currentCustomer={options[0]}
          options={filteredOptions}
          onChange={setOption}
        />
      </section>

      <footer data-fs-customer-switch-drawer-footer>
        <Button
          data-fs-customer-switch-drawer-button
          onClick={onCloseDrawer}
          size="small"
          variant="tertiary"
        >
          Cancel
        </Button>
        <Button
          data-fs-customer-switch-drawer-button
          size="small"
          variant="primary"
          onClick={handleSubmitCustomer}
          disabled={option.id === options[0].id || loading}
        >
          {loading ? <Icon name="Load" width={16} height={16} /> : 'Switch'}
        </Button>
      </footer>
    </SlideOver>
  )
}
