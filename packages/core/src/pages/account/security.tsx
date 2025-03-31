/* ######################################### */
/* Mocked Page until development is finished, it will be removed after */

import { NextSeo } from 'next-seo'
import type { ComponentType } from 'react'
import { MyAccountLayout } from 'src/components/account'
import RenderSections from 'src/components/cms/RenderSections'
import { default as GLOBAL_COMPONENTS } from 'src/components/cms/global/Components'
import CUSTOM_COMPONENTS from 'src/customizations/src/components'
import {
  getServerSideProps,
  type MyAccountProps,
} from 'src/experimental/myAccountSeverSideProps'

/* A list of components that can be used in the CMS. */
const COMPONENTS: Record<string, ComponentType<any>> = {
  ...GLOBAL_COMPONENTS,
  ...CUSTOM_COMPONENTS,
}

const style = {
  alignContent: 'center',
  justifyContent: 'center',
  alignItems: 'center',
  display: 'flex',
  backgroundColor: 'black',
  h1: {
    color: 'red',
    fontSize: '100px',
  },
}

export default function Page({ globalSections }: MyAccountProps) {
  return (
    <RenderSections
      globalSections={globalSections.sections}
      components={COMPONENTS}
    >
      <NextSeo noindex nofollow />

      <MyAccountLayout>
        <div style={style}>
          <h1 style={style.h1}>Security</h1>
        </div>
      </MyAccountLayout>
    </RenderSections>
  )
}

export { getServerSideProps }
