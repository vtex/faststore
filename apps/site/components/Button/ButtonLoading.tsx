import React, { useEffect, useState } from 'react'
import { Button } from '@faststore/ui'

const ButtonLoading = () => {
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    let timer = null

    if (loading) {
      timer = window.setTimeout(() => setLoading(false), 2000)
    }

    return () => {
      window.clearTimeout(timer)
    }
  }, [loading])

  return (
    <Button
      variant="primary"
      onClick={() => setLoading(true)}
      loadingLabel="Loading"
      loading={loading}
    >
      Click me to trigger loading
    </Button>
  )
}

export default ButtonLoading
