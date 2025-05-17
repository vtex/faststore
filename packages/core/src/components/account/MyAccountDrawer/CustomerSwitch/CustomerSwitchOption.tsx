export type CustomerSwitchOptionData = { name: string; id: string }

export type CustomerSwitchOptionProps = CustomerSwitchOptionData & {
  onChange?: (option: CustomerSwitchOptionProps) => void
  defaultChecked?: boolean
}

export const CustomerSwitchOption = ({
  name,
  id,
  onChange,
  ...otherProps
}: CustomerSwitchOptionProps) => (
  <>
    <input
      data-fs-customer-switch-option-input
      type="radio"
      id={id}
      name="CustomerSwitchOption"
      value={id}
      onChange={() => onChange?.({ name, id })}
      {...otherProps}
    />
    <label data-fs-customer-switch-option htmlFor={id}>
      <div data-fs-customer-switch-option-profile> {name[0]} </div>
      <span data-fs-customer-switch-option-name> {name} </span>
    </label>
  </>
)
