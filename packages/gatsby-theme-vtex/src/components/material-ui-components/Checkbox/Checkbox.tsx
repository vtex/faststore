import React, { FC } from 'react'
import {
  Box,
  CheckboxProps,
  FormControlLabel,
  Checkbox as MaterialCheckbox,
} from '@material-ui/core'

const Checkbox: FC<CheckboxProps & { label: string }> = ({
  label,
  ...props
}) => (
  <Box ml={1}>
    <FormControlLabel
      control={<MaterialCheckbox color={props.color ?? 'primary'} {...props} />}
      label={label}
    />
  </Box>
)

export default Checkbox
