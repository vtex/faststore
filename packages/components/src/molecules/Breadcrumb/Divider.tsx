import React from "react"
import { BreadcrumbBaseProps } from "./BreadcrumbBase"

const Divider = ({ divider, testId }: Omit<BreadcrumbBaseProps, "breadcrumbList">) => {
    const props = {
      'data-fs-breadcrumb-divider': true,
      'aria-hidden': true,
      'data-testid': `${testId}-divider`,
    }
  
    if (React.isValidElement(divider)) {
      return React.cloneElement(divider, props)
    }
  
    return <span {...props}>{divider ?? '/'}</span>
}

export default Divider
