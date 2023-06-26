function VTEX() {
  return (
    <>
      <script
        key="vtexrc.js-init"
        type="text/partytown"
        dangerouslySetInnerHTML={{
          __html: `
    window.sendrc=function(en,ed){window.NavigationCapture&&window.NavigationCapture.sendEvent(en,ed)};
    `,
        }}
      />
      <script
        key="vtexrc.js-script"
        type="text/partytown"
        async
        src="https://io.vtex.com.br/rc/rc.js"
      />
      <script
        key="vtex-af.js-script"
        type="text/partytown"
        async
        src="https://activity-flow.vtex.com/af/af.js"
      />
    </>
  )
}

export default VTEX
