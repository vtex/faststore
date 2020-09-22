/** @jsx jsx */
import { FC } from 'react'
import { Box, jsx, Spinner } from 'theme-ui'

interface Props {
  variant?: string
}

export const CenteredSpinner: FC<Props> = ({ variant }) => {
  const v = `spinner${variant ? `.${variant}` : ''}`

  return (
    <Box
      sx={{
        variant: v,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        height: '100%',
        width: '100%',
      }}
    >
      <Spinner sx={{ variant: v }} />
    </Box>
  )
}
