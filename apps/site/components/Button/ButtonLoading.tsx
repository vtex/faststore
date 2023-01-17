import React, { useState } from 'react'
import { Button } from '@faststore/ui'

const ButtonLoading = () => {
  const [loading, setLoading] = useState(false)

  return (
    <Button variant="primary" onClick={() => { setLoading(true) }} loadingLabel="Loading" loading={loading}>
      Click me to trigger loading
    </Button>
  )

}

export default ButtonLoading
