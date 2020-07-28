const graphqlFetcher = async (query: string, variables?: any) => {
  const response = await fetch(`/graphql/`, {
    method: 'POST',
    body: JSON.stringify({
      query,
      variables,
    }),
  })

  return response.json()
}

export default graphqlFetcher
