import React, { FC } from 'react'
import MaterialCheckbox, { CheckboxProps } from '@material-ui/core/Checkbox'
import FormControlLabel from '@material-ui/core/FormControlLabel'

const Checkbox: FC<CheckboxProps & { label: string }> = ({
  label,
  ...props
}) => (
  <FormControlLabel control={<MaterialCheckbox {...props} />} label={label} />
)

export default Checkbox
