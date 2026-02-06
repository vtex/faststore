import { LOG_LABEL_STYLE } from 'src/constants'
import storeConfig from '../../../discovery.config'

const enableScriptsLogs = storeConfig.experimental?.enableScriptsLogs === true

function VTEX() {
  return (
    <>
      <script
        key="vtexrc.js-init"
        type="text/partytown"
        dangerouslySetInnerHTML={{
          __html: `
            window.VTEX_METADATA = {account:'${storeConfig.api.storeId}', renderer: 'faststore'};
            window.sendrc=function(en,ed){window.NavigationCapture&&window.NavigationCapture.sendEvent(en,ed)};
            ${enableScriptsLogs ? 'window.sendrc=(function(orig){return function(en,ed){console.debug("%cvtex%c RC sendrc","' + LOG_LABEL_STYLE + '","color:inherit",en,ed);return orig(en,ed)}})(window.sendrc);' : ''}
          `,
        }}
      />
      <script
        key="vtexrc.js-script"
        type="text/partytown"
        async
        src="https://io2.vtex.com/rc/rc.js"
      />
      <script
        type="text/javascript"
        key="vtexaf-init"
        dangerouslySetInnerHTML={{
          __html: `
            (function(v,t,e,x,a,f,s){
              f=v.vtexaf=v.vtexaf||function(){(f.q=f.q||[]).push(arguments)}
              ${enableScriptsLogs ? 'f=(function(orig){return function(){console.debug("%cvtex%c AF","' + LOG_LABEL_STYLE + '","color:inherit",arguments);return orig.apply(this, arguments)}})(f);v.vtexaf=f;' : ''}
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
