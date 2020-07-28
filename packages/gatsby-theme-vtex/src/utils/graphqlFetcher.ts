const url = `https://gimenes--storecomponents.myvtex.com/graphql`

const graphqlFetcher = async (query: string, variables?: any) => {
  const response = await fetch(url, {
    method: 'POST',
    body: JSON.stringify({
      query,
      variables,
    }),
  })

  return response.json()
}

export default graphqlFetcher
