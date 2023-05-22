import { Breadcrumb as UIBreadcrumb } from '@faststore/ui'

import BreadcrumbCustomizations from 'src/customizations/components/overrides/Breadcrumb'

const Components = {
  Breadcrumb: UIBreadcrumb,
  ...BreadcrumbCustomizations.components,
}

export { Components }
