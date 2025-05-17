import {
  ContractSwitchOption,
  type ContractSwitchOptionProps,
} from './ContractSwitchOption'

export type ContractSwitchOptionsListProps = {
  options: Array<ContractSwitchOptionProps>
  currentContract: ContractSwitchOptionProps
  onChange?: (option: ContractSwitchOptionProps) => void
}

export const ContractSwitchOptionsList = ({
  options,
  currentContract,
  onChange,
}: ContractSwitchOptionsListProps) => {
  return (
    <div data-fs-customer-options-list>
      <ContractSwitchOption
        defaultChecked
        name={currentContract.name}
        id={currentContract.id}
        onChange={onChange}
      />
      {options
        .filter((customerOption) => customerOption.id !== currentContract.id)
        .map((customerOption) => (
          <ContractSwitchOption
            name={customerOption.name}
            id={customerOption.id}
            key={customerOption.id}
            onChange={onChange}
          />
        ))}
    </div>
  )
}
