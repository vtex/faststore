import { useRef, type FormEvent } from 'react'

import { IconButton, Input, Icon as UIIcon } from '@faststore/ui'

export type ContractSwitchSearchProps = {
  onSearch?: (term: string) => void
}

export const ContractSwitchSearch = ({
  onSearch,
}: ContractSwitchSearchProps) => {
  const inputRef = useRef<HTMLInputElement>(null)

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const inputValue = inputRef.current?.value
    onSearch?.(inputValue || '')
  }

  return (
    <form data-fs-contract-switch-search onSubmit={handleSubmit} role="search">
      <IconButton
        data-fs-contract-switch-search-button
        type="submit"
        aria-label="Submit Search"
        icon={<UIIcon name="MagnifyingGlass" height={17} width={17} />}
        size="small"
      />
      <Input
        data-fs-contract-switch-search-input
        placeholder="Search"
        ref={inputRef}
      />
    </form>
  )
}
