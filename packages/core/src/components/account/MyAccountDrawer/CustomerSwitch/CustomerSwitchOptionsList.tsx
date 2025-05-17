import {
  CustomerSwitchOption,
  type CustomerSwitchOptionProps,
} from './CustomerSwitchOption'

export type CustomerSwitchOptionsListProps = {
  options: Array<CustomerSwitchOptionProps>
  currentCustomer: CustomerSwitchOptionProps
  onChange?: (option: CustomerSwitchOptionProps) => void
}

export const CustomerSwitchOptionsList = ({
  options,
  currentCustomer,
  onChange,
}: CustomerSwitchOptionsListProps) => {
  return (
    <div data-fs-customer-options-list>
      <CustomerSwitchOption
        defaultChecked
        name={currentCustomer.name}
        id={currentCustomer.id}
        onChange={onChange}
      />
      {options
        .filter((customerOption) => customerOption.id !== currentCustomer.id)
        .map((customerOption) => (
          <CustomerSwitchOption
            name={customerOption.name}
            id={customerOption.id}
            key={customerOption.id}
            onChange={onChange}
          />
        ))}
    </div>
  )
}
