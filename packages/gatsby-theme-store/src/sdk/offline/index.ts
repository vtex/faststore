/** There are two different cases that we need to consider when the user
  is back online.

  1. User went offline, then navigated into a page that didn't trigger a fetch
  request to the server. If any request being made to render the page fails,
  our ErrorHandler will handle it and redirect the user to '/offline'.
  In this case, there should be a query string '?from=...' in the current URL.
  The value of this query string is the route to which we should redirect the
  user once they're back online.

  2. User went offline, then navigated into a page that **did** trigger a fetch
  request to the server. In this case, our service worker will respond with
  this page's HTML. There will be no redirect, so the user will see an
  offline page, but still be in the route there were trying to navigate
  to. Then, when back online, we just need to reload the page.

  */
export function handleUserBackOnline() {
  const queryStringParams = new URLSearchParams(window.location.search)
  const isOfflineRoute = window.location.pathname.startsWith('/offline')

  // Case 1.
  if (queryStringParams.has('from')) {
    const offlineFrom = queryStringParams.get('from') ?? '/'

    window.location.href = offlineFrom

    return
  }

  // Case 2.
  if (!isOfflineRoute) {
    window.location.reload()

    return
  }

  window.location.href = '/'
}
