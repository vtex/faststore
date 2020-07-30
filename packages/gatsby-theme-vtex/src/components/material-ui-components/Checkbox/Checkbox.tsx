import React, { FC } from 'react'
import MaterialCheckbox, { CheckboxProps } from '@material-ui/core/Checkbox'
import FormControlLabel from '@material-ui/core/FormControlLabel'
import Box from '@material-ui/core/Box'

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
