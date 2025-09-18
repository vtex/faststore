import React from 'react'
import BreadcrumbBase, { type BreadcrumbBaseProps } from './BreadcrumbBase'

export interface BreadcrumbProps
  extends Omit<BreadcrumbBaseProps, 'isDesktop'> {}

export default function Breadcrumb({
  breadcrumbList,
  ...otherProps
}: BreadcrumbProps) {
  return (
    <>
      <BreadcrumbBase breadcrumbList={breadcrumbList} {...otherProps} />
      <BreadcrumbBase
        breadcrumbList={breadcrumbList}
        isDesktop
        {...otherProps}
      />
    </>
  )
}
