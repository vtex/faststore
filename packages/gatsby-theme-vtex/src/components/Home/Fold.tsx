/** @jsx jsx */
import { FC, Fragment, lazy, Suspense } from 'react'
import { jsx } from 'theme-ui'

const Action = lazy(() => import('../InfoCard/ButtonAction'))
const InfoCard = lazy(() => import('../InfoCard'))
const RichText = lazy(() => import('../RichText'))

const Space: FC = ({ children }) => <div sx={{ my: 5 }}>{children}</div>

const Fold: FC = () => (
  <Fragment>
    <Suspense fallback={null}>
      <Space>
        <InfoCard headline="New Promotion!" to="/vintage-phone/p">
          <div sx={{ my: 3 }}>
            <Suspense fallback={null}>
              <Action to="/vintage-phone/p" label="BUY NOW" />
            </Suspense>
          </div>
        </InfoCard>
      </Space>
    </Suspense>
    <Suspense fallback={null}>
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
    </Suspense>
  </Fragment>
)

export default Fold
