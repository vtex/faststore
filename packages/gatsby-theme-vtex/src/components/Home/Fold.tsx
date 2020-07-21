/** @jsx jsx */
import { FC, Fragment, lazy, Suspense } from 'react'
import { jsx } from 'theme-ui'

import Action from '../InfoCard/ButtonAction'

const RichText = lazy(() => import('../RichText'))
const InfoCard = lazy(() => import('../InfoCard'))

const Space: FC = ({ children }) => <div sx={{ my: 5 }}>{children}</div>

const SuspenseNull: FC = ({ children }) => (
  <Suspense fallback={null}>{children}</Suspense>
)

const Fold: FC = () => (
  <Fragment>
    <Space>
      <SuspenseNull>
        <InfoCard
          to="/vintage-phone/p"
          headline="New Promotion!"
          imgSrc="https://storecomponents.vtexassets.com/arquivos/banner-infocard2.png"
          imgAlt="infocard-banner"
        >
          <div sx={{ my: 3 }}>
            <Action to="/vintage-phone/p" label="BUY NOW" />
          </div>
        </InfoCard>
      </SuspenseNull>
    </Space>

    <Space>
      <SuspenseNull>
        <RichText
          text="This is an example store built using the VTEX platform."
          variant="question"
        />
      </SuspenseNull>
      <SuspenseNull>
        <RichText text="Want to know more?" variant="question" />
      </SuspenseNull>
    </Space>
    <Space>
      <div sx={{ mb: 3 }}>
        <SuspenseNull>
          <RichText text="Reach us at" />
        </SuspenseNull>
      </div>
      <a href="www.vtex.com.br">
        <SuspenseNull>
          <RichText text="www.vtex.com.br" variant="link" />
        </SuspenseNull>
      </a>
    </Space>
  </Fragment>
)

export default Fold
