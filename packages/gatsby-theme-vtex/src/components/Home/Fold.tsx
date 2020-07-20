/** @jsx jsx */
import { FC, Fragment } from 'react'
import { jsx } from 'theme-ui'

import Action from '../InfoCard/ButtonAction'
import InfoCard from '../InfoCard'
import RichText from '../RichText'

const Space: FC = ({ children }) => <div sx={{ my: 5 }}>{children}</div>

const Fold: FC = () => (
  <Fragment>
    <Space>
      <InfoCard headline="New Promotion!" to="/vintage-phone/p">
        <div sx={{ my: 3 }}>
          <Action to="/vintage-phone/p" label="BUY NOW" />
        </div>
      </InfoCard>
    </Space>
    <Space>
      <RichText
        text="This is an example store built using the VTEX platform."
        variant="question"
      />
      <RichText text="Want to know more?" variant="question" />
    </Space>
    <Space>
      <div sx={{ mb: 3 }}>
        <RichText text="Reach us at" />
      </div>
      <a href="www.vtex.com.br">
        <RichText text="www.vtex.com.br" variant="link" />
      </a>
    </Space>
  </Fragment>
)

export default Fold
