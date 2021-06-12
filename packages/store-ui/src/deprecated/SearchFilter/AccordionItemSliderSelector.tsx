/** @jsx jsx */
import { Box, Flex, jsx } from 'theme-ui'
import type { ComponentType, FC } from 'react'
import { Fragment } from 'react'

interface Props {
  active?: boolean
  value?: number | string
  displayPopup?: boolean
  offset: number
  icon: ComponentType | null
}

const Popup: FC<{ offset: number; value: number | string }> = ({
  offset,
  value,
}) => (
  <Box
    sx={{
      paddingBottom: '.75rem',
      position: 'absolute',
      left: 0,
      bottom: '100%',
      marginLeft: `${offset * 100}%`,
      marginRight: `${(1 - offset) * 100}%`,
    }}
  >
    <Flex
      sx={{
        alignItems: 'center',
        backgroundColor: 'primary',
        border: '1px solid',
        borderColor: 'primary',
        borderRadius: '.25rem',
        color: '#FFF',
        padding: '.25rem .5rem',
        position: 'relative',
        justifyContent: 'center',
        left: '-50%',
        fontWeight: 'normal',
        fontSize: '.875rem',
        textTransform: 'initial',
        letterSpacing: 0,
      }}
    >
      {value}
    </Flex>
  </Box>
)

const Selector: FC<Props> = ({
  active = false,
  value = 0,
  displayPopup = false,
  icon = null,
  offset,
}) => (
  <Fragment>
    {active && displayPopup && <Popup offset={offset} value={value} />}

    <Flex
      sx={{
        zIndex: active ? 2 : 1,
        top: 6.5,
        left: 0,
        position: 'absolute',
        marginLeft: `${offset * 100}%`,
        marginRight: `${(1 - offset) * 100}%`,
        willChange: 'transform',
        alignItems: 'center',
        backgroundColor: 'primary',
        borderRadius: '100%',
        boxShadow: '-1px 1px 3px rgba(0, 0, 0, 0.15)',
        height: '0.75rem',
        width: '0.75rem',
        justifyContent: 'center',
        ':focus': {
          outline: 0,
        },
      }}
    >
      {icon}
    </Flex>
  </Fragment>
)

export default Selector
