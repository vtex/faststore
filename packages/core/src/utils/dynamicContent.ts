import dynamicContent from 'src/customizations/src/dynamicContent'

export async function getDynamicContent({ pageType }: { pageType: string }) {
  // Checking if the fetch function corresponding to the type of page exists (home or LP slug)
  const fetchFunction = dynamicContent[pageType]
  let serverData = null

  if (!fetchFunction) {
    console.warn(
      `Warning: Dynamic Content not found for the page: ${pageType}. Refer to the Dynamic Content documentation at https://developers.vtex.com/docs/guides/faststore/dynamic-content-overview for mapping the page and the corresponding data-fetching function.`
    )
  } else {
    // Calling the fetch function corresponding to the page
    const { data, errors = [] } = await fetchFunction()
    serverData = data

    if (errors.length > 0) {
      console.error(...errors)
    }
  }
  return serverData
}
