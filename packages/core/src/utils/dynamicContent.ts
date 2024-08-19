import dynamicContent from 'src/customizations/src/dynamicContent'

export async function getDynamicContent({ pageType }: { pageType: string }) {
  try {
    // Checking if the fetch function corresponding to the type of page exists (home or LP slug)
    const fetchFunction = dynamicContent[pageType]

    if (!fetchFunction) {
      console.warn(
        `\nWarning: Dynamic Content not found for the page: ${pageType}. Refer to the Dynamic Content documentation at https://developers.vtex.com/docs/guides/faststore/dynamic-content-overview for mapping the page and the corresponding data-fetching function.`
      )
      return null
    }
    // Calling the fetch function corresponding to the page
    const { data, errors = [] } = await fetchFunction()

    if (errors.length > 0) {
      console.error(...errors)
    }

    return data
  } catch (error) {
    console.error('Error while fetching Dynamic Content:', error)
    console.warn(
      `Refer to the Dynamic Content documentation at https://developers.vtex.com/docs/guides/faststore/dynamic-content-overview for mapping the page and the corresponding data-fetching function.`
    )
    return null
  }
}
