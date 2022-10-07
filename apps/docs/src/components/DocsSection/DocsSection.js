import React from 'react'
import { useColorMode } from '@docusaurus/theme-common'

function DocsSection() {
  const isDarkTheme = useColorMode().colorMode === "dark"
  
  let conditionalClasses = isDarkTheme ? "lg:bg-[url('https://vtexhelp.vtexassets.com/assets/docs/src/docsDark___35c5ffa5b64e647de1654779f8b118a4.jpeg')]" : "lg:bg-[url('https://vtexhelp.vtexassets.com/assets/docs/src/docs___c12d6d045275ecbf10a3910be72eec57.jpeg')]"
  return (    
    <div className={`bg-cover ${conditionalClasses } sm:pr-8 bg-right-top`}>
        <div className="lg:py-24">
          <h2 className="text-5xl text-fontSecondary leading-tight font-VTEXMedium break-normal">
            FastStore documentation
          </h2>
          <p className="text-base text-details my-6 lg:w-3/5">
          Welcome to FastStore, a lightweight yet powerful set of libraries made for developers who want to build blazing-fast ecommerce websites with great flexibility. FastStore consists of a React-based UI library, GraphQL APIs, and a state management SDK.
          </p>
        </div>
    </div>
  )
}

export default DocsSection
