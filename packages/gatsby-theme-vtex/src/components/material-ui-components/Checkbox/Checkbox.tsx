import React, { FC } from 'react'
import {
  makeStyles,
  CheckboxProps,
  FormControlLabel,
  Checkbox as MaterialCheckbox,
} from '@material-ui/core'
import type { Theme } from '@material-ui/core'

const useStyles = makeStyles((theme: Theme) => ({
  root: {
    marginLeft: theme.spacing(1),
  },
}))

const Checkbox: FC<CheckboxProps & { label: string }> = ({
  label,
  ...props
}) => {
  const classes = useStyles()

  return (
    <div className={classes.root}>
      <FormControlLabel
        control={<MaterialCheckbox color={props.color ?? 'primary'} {...props} />}
        label={label}
      />
    </div>
  )
}

export default Checkbox
