/** @jsx jsx */
import { Box, Button, Input, jsx } from '@vtex/store-ui'
import { useRef } from 'react'
import type { SxStyleProp } from '@vtex/store-ui'
import { useIntl } from '@vtex/gatsby-plugin-i18n'

import RegionIcon from './RegionIcon'

const backdropStyle: SxStyleProp = {
  background: 'rgba(0, 0, 0, 0.75)',
  display: 'flex',
  overflowY: 'auto',
  overflowX: 'hidden',
  padding: '1.2rem',
  position: 'fixed',
  bottom: 0,
  left: 0,
  right: 0,
  top: 0,
  zIndex: 1000,
}

const modalBodyStyle: SxStyleProp = {
  backgroundColor: '#FFFFFF',
  borderRadius: 5,
  boxShadow: '0 12px 15px 0 rgb(0 0 0 / 25%)',
  margin: 'auto',
  padding: '1.2rem',
}

const modalContentStyle: SxStyleProp = {
  alignItems: 'center',
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'space-around',
  padding: '30px 80px',
  height: 323,
  width: 462,
}

const titleStyle: SxStyleProp = {
  color: '#02296d',
  fontSize: 20,
  fontWeight: 300,
}

const subtitleStyle: SxStyleProp = {
  fontSize: 14,
  fontWeight: 400,
  letterSpacing: 0,
  textAlign: 'center',
}

const formStyle: SxStyleProp = {
  display: 'flex',
  input: {
    width: 'auto',
  },
  button: {
    borderTopLeftRadius: '0',
    borderBottomLeftRadius: '0',
    marginLeft: '-2px',
  },
}

interface Props {
  onSubmit: (region: string) => void
}

const RegionLocalization = ({ onSubmit }: Props) => {
  const input = useRef<HTMLInputElement>(null)
  const { formatMessage } = useIntl()

  return (
    <Box sx={backdropStyle}>
      <Box sx={modalBodyStyle}>
        <Box sx={modalContentStyle}>
          <RegionIcon />

          <Box sx={titleStyle} as="h1">
            {formatMessage({
              id: 'zipcode.change.modal.title',
            })}
          </Box>

          <Box sx={subtitleStyle} as="p">
            {formatMessage({
              id: 'zipcode.change.modal.description',
            })}
          </Box>

          <Box
            sx={formStyle}
            as="form"
            onSubmit={(e) => {
              e.preventDefault()
              onSubmit(input.current?.value ?? '')
            }}
          >
            <Input
              ref={input}
              type="text"
              name="zipcode"
              id="zipcode"
              placeholder="_____-___"
            />
            <Button type="submit">
              {formatMessage({
                id: 'zipcode.change.modal.button',
              })}
            </Button>
          </Box>
        </Box>
      </Box>
    </Box>
  )
}

export default RegionLocalization
