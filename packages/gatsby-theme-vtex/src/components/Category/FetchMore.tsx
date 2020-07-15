/** @jsx jsx */
import { Button, jsx } from 'theme-ui'
import { FC } from 'react'

interface Props {
  onClick:
    | ((event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => void)
    | undefined
  disabled: boolean
  loading: boolean
}

const FetchMoreBtn: FC<Props> = ({ onClick, disabled, loading }) => (
  <Button
    sx={{ width: '100%', my: 4 }}
    variant="loadMore"
    onClick={onClick}
    disabled={disabled}
  >
    {loading ? 'Loading...' : 'More'}
  </Button>
)

export default FetchMoreBtn
