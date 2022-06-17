import React from 'react'
import { ApolloExplorerReact } from '@apollo/explorer'
import { useColorMode } from '@docusaurus/theme-common'

const GraphQLExplorer = function ({ query, vars }) {
  const { isDarkTheme } = useColorMode()
  return (
    <div>
      <ApolloExplorerReact
        className="h-[600px] mb-6"
        graphRef="faststore-api@current"
        endpointUrl="https://faststore-api.herokuapp.com/graphql"
        persistExplorerState={false}
        initialState={{
          document: query,
          variables: vars,
          displayOptions: {
            showHeadersAndEnvVars: false,
            docsPanelState: 'closed',
            theme: `${isDarkTheme ? 'dark' : 'light'}`,
          },
        }}
      />
    </div>
  )
}

export default GraphQLExplorer
