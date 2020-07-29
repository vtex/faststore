const graphqlFetcher = async <T>(query: string, variables?: any) => {
  const response = await fetch(`/graphql/`, {
    method: 'POST',
    body: JSON.stringify({
      query,
      variables,
    }),
  })

  return response.json() as Promise<T>
}

export default graphqlFetcher
