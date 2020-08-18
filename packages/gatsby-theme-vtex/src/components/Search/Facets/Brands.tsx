/** @jsx jsx */
import { FC, Fragment } from 'react'
import { Checkbox, Label, jsx, LocalizedLink } from '@vtex/store-ui'
// import { FormattedMessage } from 'react-intl'
import { t } from 'frenchkiss'

interface Brands {
  value: string
  quantity: number
  selected: boolean
  linkEncoded: string
}

type Props = {
  brands: Brands[]
}

const BrandSelector: FC<Props> = ({ brands }) => (
  <Fragment>
    {/* <FormattedMessage id="facets.brand-selector.title" /> */}
    <div>{t('facets.brand-selector.title')}</div>
    <ul sx={{ listStyleType: 'none', mx: 0, px: 0 }}>
      {brands.map(({ linkEncoded, value, selected, quantity }, index) => (
        <li key={`brands-selector-${index}`}>
          <LocalizedLink to={linkEncoded}>
            <Label>
              <Checkbox checked={selected} readOnly />
              {value} ({quantity})
            </Label>
          </LocalizedLink>
        </li>
      ))}
    </ul>
  </Fragment>
)

export default BrandSelector
