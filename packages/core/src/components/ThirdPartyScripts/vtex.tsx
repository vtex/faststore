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
        key="vtex-af.js-init"
        type="text/partytown"
        dangerouslySetInnerHTML={{
          __html: `f=window.vtexaf=window.vtexaf||function(){(f.q=f.q||[]).push(arguments)};f.l=+new Date`,
        }}
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
