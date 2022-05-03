import React from 'react'
import { ApolloExplorerReact } from '@apollo/explorer';
import {useColorMode} from '@docusaurus/theme-common';
  
var App = function () {
  const { isDarkTheme } = useColorMode();
  return (
    <div >
      <ApolloExplorerReact 
      className="h-[500px]"
      graphRef='faststore-api@current'
      endpointUrl='http://localhost:4000/'
      persistExplorerState={false}
      initialState={{
        document: `query Node($first: Int!) {
          allProducts(first: $first) {
            edges {
              node {
                name
              }
            }
          }
        }
`,
        variables: { 'first': 10 },
        displayOptions: {
          showHeadersAndEnvVars: false, 
          docsPanelState: 'closed', 
          theme: `${isDarkTheme ? "dark" : "light"}`,
        },
      }}
    /></div>
  );
}

export default App;
