import React from 'react'
import { stripIndent } from 'common-tags'

export const sync = ({ innerHtml }: { innerHtml: string }) => {
  return (
    <script
      key="sync-vtex-rc"
      type="application/javascript"
      dangerouslySetInnerHTML={{
        __html: stripIndent`${innerHtml}`,
      }}
    />
  )
}

export const lazy = ({ src, id }: { src: string; id: string }) => {
  return (
    <script
      key="lazy-vtex-rc"
      type="application/javascript"
      dangerouslySetInnerHTML={{
        __html: stripIndent`
          (function () {
            var once = true;
            if (!once) { return; }
            once = false
            window.requestIdleCallback(() => {
              script=document.createElement('script');
              script.setAttribute('src', "${src}");
              script.setAttribute('async', true);
              script.setAttribute('id', '${id}');
              script.setAttribute('type', 'application/javascript');
              document.getElementsByTagName('head')[0].appendChild(script);
            })
          })();
        `,
      }}
    />
  )
}
