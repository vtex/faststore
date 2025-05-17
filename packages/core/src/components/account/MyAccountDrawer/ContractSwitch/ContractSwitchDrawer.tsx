import {
  Button,
  Icon,
  SlideOver,
  SlideOverHeader,
  Icon as UIIcon,
  useFadeEffect,
} from '@faststore/ui'
import { useMemo, useState } from 'react'
import type { ContractSwitchOptionData } from './ContractSwitchOption'
import { ContractSwitchOptionsList } from './ContractSwitchOptionsList'
import { ContractSwitchSearch } from './ContractSwitchSearch'

import useScreenResize from 'src/sdk/ui/useScreenResize'
import styles from '../OrganizationDrawer/section.module.scss'

type ContractSwitchDrawerProps = {
  isOpen: boolean
  onCloseDrawer?: () => void
}

// TODO: Remove mock when integrating with the backend
const options = [
  'Finance Solutions',
  'Green Innovations',
  'Blue Horizon Corp',
  'Prime Finance Group',
  'John Ventures',
  'Evergreen Holdings',
  'Finance Pro Consulting',
  'John Strategies',
  'A Technologies',
  'Global Finance Advisors',
  'Tech Solutions',
  'Capital Partners',
].map((name, index) => ({ name, id: `id-${index}` }))

export const ContractSwitchDrawer = ({
  isOpen,
  onCloseDrawer,
}: ContractSwitchDrawerProps) => {
  const { fade, fadeOut } = useFadeEffect()
  const { isDesktop } = useScreenResize()

  const [option, setOption] = useState<ContractSwitchOptionData>(options[0])
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

  const handleSubmitContract = () => {
    setLoading(true)
    setTimeout(() => {
      setLoading(false)
      onCloseDrawer?.()
    }, 3000)
  }

  return (
    <SlideOver
      data-fs-contract-switch-drawer
      fade={fade}
      onDismiss={fadeOut}
      onTransitionEnd={() => fade === 'out' && onCloseDrawer?.()}
      isOpen={isOpen}
      size="partial"
      direction="rightSide"
      overlayProps={{
        className: `section ${styles.section} section-contract-switch-drawer`,
      }}
    >
      <SlideOverHeader
        data-fs-contract-switch-drawer-header
        onClose={() => onCloseDrawer?.()}
      >
        <div data-fs-contract-switch-drawer-header-content>
          <Button
            size="small"
            variant="tertiary"
            data-fs-contract-switch-drawer-close-button
            onClick={() => onCloseDrawer?.()}
            aria-label="Close"
            className="text__title-mini"
            icon={<UIIcon name="CaretLeft" width={16} height={16} />}
          >
            {!isDesktop && <>back</>}
          </Button>
          {isDesktop && (
            <h1 data-fs-contract-switch-drawer-title>Switch Contract</h1>
          )}
        </div>
      </SlideOverHeader>

      <section data-fs-contract-switch-drawer-body>
        {!isDesktop && (
          <h1 data-fs-contract-switch-drawer-title>Switch Contract</h1>
        )}
        <ContractSwitchSearch onSearch={setSearchTerm} />
        <ContractSwitchOptionsList
          currentContract={options[0]}
          options={filteredOptions}
          onChange={setOption}
        />
      </section>

      <footer data-fs-contract-switch-drawer-footer>
        <Button
          data-fs-contract-switch-drawer-button
          onClick={onCloseDrawer}
          size="small"
          variant="tertiary"
        >
          Cancel
        </Button>
        <Button
          data-fs-contract-switch-drawer-button
          size="small"
          variant="primary"
          onClick={handleSubmitContract}
          disabled={option.id === options[0].id || loading}
        >
          {loading ? <Icon name="Load" width={16} height={16} /> : 'Switch'}
        </Button>
      </footer>
    </SlideOver>
  )
}
