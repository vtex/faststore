import storeConfig from '../../../discovery.config'

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
        type="text/javascript"
        key="vtexaf-init"
        dangerouslySetInnerHTML={{
          __html: `
            (function(v,t,e,x,a,f,s){
              f=v.vtexaf=v.vtexaf||function(){(f.q=f.q||[]).push(arguments)}
              ;f.l=+new Date;s=t.createElement(e);s.async=!0;
              s.src=x;a=t.getElementsByTagName(e)[0];
              a.parentNode.insertBefore(s,a)
            })(window,document,'script','https://activity-flow.vtex.com/af/af.js');
          `,
        }}
      />
      <script
        type="text/javascript"
        key="vtexaf-config"
        dangerouslySetInnerHTML={{
          __html: `
            window.vtexaf('init', {
              account: '${storeConfig.api.storeId}',
              env: '${storeConfig.api.environment}',
              workspace: '${storeConfig.api.workspace}'
            });
          `,
        }}
      />
    </>
  )
}

export default VTEX
