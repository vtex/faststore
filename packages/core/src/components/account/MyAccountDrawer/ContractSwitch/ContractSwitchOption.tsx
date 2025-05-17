export type ContractSwitchOptionData = { name: string; id: string }

export type ContractSwitchOptionProps = ContractSwitchOptionData & {
  onChange?: (option: ContractSwitchOptionProps) => void
  defaultChecked?: boolean
}

export const ContractSwitchOption = ({
  name,
  id,
  onChange,
  ...otherProps
}: ContractSwitchOptionProps) => (
  <>
    <input
      data-fs-contract-switch-option-input
      type="radio"
      id={id}
      name="ContractSwitchOption"
      value={id}
      onChange={() => onChange?.({ name, id })}
      {...otherProps}
    />
    <label data-fs-contract-switch-option htmlFor={id}>
      <div data-fs-contract-switch-option-profile> {name[0]} </div>
      <span data-fs-contract-switch-option-name> {name} </span>
    </label>
  </>
)
