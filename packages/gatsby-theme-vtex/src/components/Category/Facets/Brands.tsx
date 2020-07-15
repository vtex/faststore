/** @jsx jsx */
import { FC, Fragment } from 'react'
import { Checkbox, Label, jsx } from 'theme-ui'

interface BrandFacet {
  Name: string
  Link: string
}

interface Props {
  name: string
  brands: BrandFacet[]
}

const BrandSelector: FC<Props> = ({ brands, name }) => (
  <Fragment>
    <div>Brands</div>

    <ul sx={{ listStyleType: 'none', mx: 0, px: 0 }}>
      {brands.map(({ Name, Link }, index) => (
        <li key={`brands-selector-${index}`}>
          <Label>
            <Checkbox />
            {Name}
          </Label>
        </li>
      ))}
    </ul>
  </Fragment>
)

export default BrandSelector
