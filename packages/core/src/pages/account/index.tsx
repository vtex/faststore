import { useEffect } from 'react'
import menuRoutes from 'src/customizations/src/myAccount/navigation'

function Page() {
  useEffect(() => {
    window.location.href = `${window.location.origin}/${menuRoutes[0].route}${window.location.search}`
  }, [])
}

export default Page
