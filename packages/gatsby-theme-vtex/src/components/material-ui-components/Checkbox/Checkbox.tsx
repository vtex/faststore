import React, { FC } from 'react'
import MaterialCheckbox, { CheckboxProps } from '@material-ui/core/Checkbox'
import FormControlLabel from '@material-ui/core/FormControlLabel'
import { Box } from '@material-ui/core'

const Checkbox: FC<CheckboxProps & { label: string }> = ({
  label,
  ...props
}) => (
  <Box ml={1}>
    <FormControlLabel
      control={
        <MaterialCheckbox
          color={props.color ?? 'primary'}
          style={props.style ?? { width: 24, height: 24 }}
          {...props}
        />
      }
      label={label}
    />
  </Box>
)

export default Checkbox
