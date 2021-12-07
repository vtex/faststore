/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
import React from 'react'
import Layout from '@theme/Layout'
import Translate, { translate } from '@docusaurus/Translate'
import errorImage from '/img/404.jpeg'
import SectionImage from '../components/SectionImage/SectionImage'

function NotFound() {
  return (
    <Layout
      title={translate({
        id: 'theme.NotFound.title',
        message: 'Page Not Found',
      })}
    >
      <main className="container">
        <SectionImage
          tag="404 - page not found"
          title="The content you are looking for was not found or does not exist anymore."
          description="Use the menu above to find what you need or contact us at the link below:"
          linkTo="https://docs.google.com/forms/d/e/1FAIpQLSfmnotPvPjw-SjiE7lt2Nt3RQgNUe10ixXZmuO2v9enOJReoQ/viewform?entry.1972292648=developers.vtex.com&entry.1799503232="
          message="Send a feedback"
          img={errorImage}
        />
      </main>
    </Layout>
  )
}

export default NotFound
