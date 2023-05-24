import React from 'react'
import BreadcrumbBase, { BreadcrumbBaseProps } from './BreadcrumbBase'

export interface BreadcrumbProps
  extends Omit<BreadcrumbBaseProps, 'isDesktop'> {}

const Breadcrumb = ({ breadcrumbList, ...otherProps }: BreadcrumbProps) => (
  <>
    <BreadcrumbBase breadcrumbList={breadcrumbList} {...otherProps} />
    <BreadcrumbBase breadcrumbList={breadcrumbList} isDesktop {...otherProps} />
  </>
)

export default Breadcrumb