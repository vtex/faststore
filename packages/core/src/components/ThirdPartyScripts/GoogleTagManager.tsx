interface Props {
  containerId: string
  dataLayerName?: string
}

const GTM_DEBUG_QUERY_STRING = 'gtm_debug'

const useSnippet = (opts: Props & { partytownScript: boolean }) => `${
  opts.partytownScript ? '!' : ''
}window.location.search.includes('${GTM_DEBUG_QUERY_STRING}=')&&
  (function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
 new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
 j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
 'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
 })(window,document,'script',${JSON.stringify(
   opts.dataLayerName ?? 'dataLayer'
 )},${JSON.stringify(opts.containerId)});`

/**
 * Google Tag Manager script adapted to be executed only when necessary.
 *
 * The first script adds the GTM script to partytown. It is meant for when regular users
 * are browsing the website, so that loading and executing it doesn't affect performance
 *
 * The second script is meant for GTM debugging. Since debugging GTM inside partytown still doesn't work,
 * it is only executed when the url includes the gtm_debug query string.
 *
 * Since the query string isn't accessible during SSR, the decision of which script should be executed
 * is bundled with the script, and that's why we need to include both. The script isn't GTM itself, but
 * the code who will, after being executed, add the GTM script to the page.
 *
 * https://developers.google.com/tag-manager/quickstart
 */
function GoogleTagManager(props: Props) {
  return (
    <>
      <script
        key="gtm.partytown"
        type="text/partytown"
        dangerouslySetInnerHTML={{
          __html: useSnippet({
            ...props,
            partytownScript: true,
          }),
        }}
      />
      <script
        key="gtm"
        type="text/javascript"
        dangerouslySetInnerHTML={{
          __html: useSnippet({
            ...props,
            partytownScript: false,
          }),
        }}
      />
    </>
  )
}

export default GoogleTagManager
